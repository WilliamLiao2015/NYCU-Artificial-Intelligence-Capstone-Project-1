import { load } from "https://deno.land/std@0.219.1/dotenv/mod.ts"

import { OpenAI } from "npm:openai"


const { OPENAI_API_KEY } = await load()
const client = new OpenAI({ apiKey: OPENAI_API_KEY })

const systemPrompt = (await Deno.readTextFile("./data/system_prompt.txt")).replace(/{{currentDate}}/g, new Date().toDateString())


async function getChatGPTResponse(text: string) {
  const prompt = (await Deno.readTextFile("./data/user_prompt.txt")).replace(/{{text}}/g, text)
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ]
  })
  return response.choices[0].message.content
}


const news = JSON.parse(await Deno.readTextFile("./data/news.json")) as NewsData[]
const newsTexts = news.map(({ textContent }) => textContent).slice(7, 8)

newsTexts.forEach(async (text: string) => {
  const response = await getChatGPTResponse(text)
  console.log(response)
})
