const reviewList = JSON.parse(await Deno.readTextFile("../data/reviews.json")) as ReviewData[]
const repairedReviewList = reviewList.map(review => {
  const { conclusion } = review
  return { ...review, conclusion: String(conclusion) === "1" ? 1 : 0 }
})

await Deno.writeTextFile("../data/reviews.json", JSON.stringify(repairedReviewList))
