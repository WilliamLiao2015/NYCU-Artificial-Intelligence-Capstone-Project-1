import pick from "https://deno.land/x/lodash@4.17.15-es/pick.js"

import { JSDOM, VirtualConsole } from "npm:jsdom"
import { Readability } from "npm:@mozilla/readability"


const virtualConsole = new VirtualConsole()
virtualConsole.sendTo(console, { omitJSDOMErrors: true })
virtualConsole.on("jsdomError", (error: Error) => {
  if (!error.message.startsWith("Could not parse CSS")) console.error(error)
})


function parseText(text: string){
  const parsed = text.split(/\n+/g).filter(p => p.split(/\s+/).filter(word => word.length > 0).length > 10).join("\n").split(/ +/).join(" ").trim()
  return parsed
}

async function parseNews(url: string) {
  const response = await fetch(url)
  if (!response.ok) return null
  const html = await response.text()
  const dom = new JSDOM(html, { virtualConsole })
  const reader = new Readability(dom.window.document)
  const article = reader.parse()
  return article as NewsArticle
}

async function scrapeNews() {
  const newsLinkList = (await Deno.readTextFile("../data/links.txt")).replace(/\r/g, "").split("\n")
  console.log(`The number of news links is ${newsLinkList.length}`)
  let success = 0
  const newsDataList = await Promise.all(
    newsLinkList.map(async (link) => {
      try {
        const article = await parseNews(link)
        if (!article) return null
        success++
        return { link, ...article, excerpt: article.excerpt, textContent: parseText(article.textContent) } as NewsData
      } catch (error) {
        console.error(`Error parsing ${link}: ${error.message}`)
        return null
      }
    })
  )
  const restrictedDataList = newsDataList.map(newsData => pick(newsData, ["lang", "siteName", "link", "title", "byline", "excerpt", "textContent", "length", "publishedTime"])).filter(data => Object.keys(data).length) as NewsData[]
  await Deno.writeTextFile("../data/news.json", JSON.stringify(restrictedDataList, null, 2))
  console.log(`The number of successfully parsed news articles is ${success}`)
}


await scrapeNews()
