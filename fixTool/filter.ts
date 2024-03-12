async function filterLang() {
    const filePath = "../data/reviews.json";
    const fileContent = await Deno.readFile(filePath);

    const decodedContent = new TextDecoder("utf-8").decode(fileContent);

    const reviews = JSON.parse(decodedContent);

    const filteredReviews = reviews.filter((review: ReviewData) => {
        return (review.lang !== "zh-TW" && 
                review.lang !== "zh-tw" && 
                review.lang !== "zh-Hant" && 
                review.lang !== "tw" &&
                review.textContent !== "" &&
                review.siteName !== "巴哈姆特電玩資訊站");
    });

    await Deno.writeFile(filePath, new TextEncoder().encode(JSON.stringify(filteredReviews)));
}

filterLang();