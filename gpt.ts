import { load } from "https://deno.land/std@0.219.1/dotenv/mod.ts"
import { parse } from "https://deno.land/std@0.219.1/yaml/mod.ts"

import { OpenAI } from "npm:openai"


const { OPENAI_API_KEY } = await load()
const client = new OpenAI({ apiKey: OPENAI_API_KEY })

const previousReviews = JSON.parse(await Deno.readTextFile("./data/reviews.json")) as ReviewData[]
const systemPrompt = await Deno.readTextFile("./data/system_prompt.txt")


async function getChatGPTResponse({ title, textContent }: NewsData) {
  const prompt = (await Deno.readTextFile("./data/user_prompt.txt")).replace(/{{title}}/g, title).replace(/{{text}}/g, textContent)
  console.log(prompt)
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    max_tokens: 500
  })
  return response.choices[0].message.content
}


let newCount = 0
const newsList = JSON.parse(await Deno.readTextFile("./data/news.json")) as NewsData[]
const reviewList = await Promise.all(newsList.slice(0, 10).filter(news => !previousReviews.map(pr => pr.link).includes(news.link)).map(async news => {
  try {
    const response = await getChatGPTResponse(news)
    if (!response) return null
    const reviewArray = parse(response) as object[]
    const [rating, reason, conclusion] = reviewArray.map((rObj: object) => Object.values(rObj)[0])
    newCount++
    return { ...news, rating, reason, conclusion } as ReviewData
  } catch (error) {
    console.error(error)
    console.log(`Error parsing ${news.link}`)
    return null
  }
}))
const filteredReviewList = reviewList.filter(review => review !== null) as ReviewData[]
const allReviews = previousReviews.concat(filteredReviewList)


await Deno.writeTextFile("./data/reviews.json", JSON.stringify(allReviews))


console.log(`The number of new reviews is ${newCount}`)
