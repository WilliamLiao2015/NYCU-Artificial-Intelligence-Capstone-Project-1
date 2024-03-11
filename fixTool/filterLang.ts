async function filterLang() {
    const filePath = "../data/reviews.json";
    const fileContent = await Deno.readFile(filePath);

    const decodedContent = new TextDecoder("utf-8").decode(fileContent);

    const reviews = JSON.parse(decodedContent);

    const filteredReviews = reviews.filter((review: any) => {
        return (review.lang !== "zh-TW" && review.lang !== "zh-tw" && review.lang !== "zh-Hant");
    });

    await Deno.writeFile(filePath, new TextEncoder().encode(JSON.stringify(filteredReviews)));
}

filterLang();