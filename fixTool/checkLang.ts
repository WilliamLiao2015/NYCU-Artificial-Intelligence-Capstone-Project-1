import fs from "node:fs";

// Read the reviews.json file
const reviewsData = fs.readFileSync("../data/reviews.json", "utf-8");
const reviews = JSON.parse(reviewsData);

// Extract the "lang" values
const langValues = reviews.map((review: any) => review.lang);

// Remove duplicates
const uniqueLangValues = Array.from(new Set(langValues));

// Write the unique lang values to a text file
fs.writeFileSync("checkLang.txt", uniqueLangValues.join("\n"));