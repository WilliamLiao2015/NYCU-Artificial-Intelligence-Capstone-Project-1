import { load } from "https://deno.land/std@0.219.1/dotenv/mod.ts"

import { OpenAI } from "npm:openai"


const { OPENAI_API_KEY } = await load()
const client = new OpenAI({ apiKey: OPENAI_API_KEY })

const systemPrompt = (await Deno.readTextFile("./data/system_prompt.txt"))


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


const newsList = JSON.parse(await Deno.readTextFile("./data/news.json")) as NewsData[]

newsList.slice(0, 1).forEach(async news => {
  const response = await getChatGPTResponse(news)
  console.log(response)
})
