interface NewsArticle {
  title: string
  byline: string
  lang: string
  content: string
  textContent: string
  length: number
  excerpt: string
  siteName: string
  publishedTime: string
}

interface NewsData extends NewsArticle {
  link: string
}


interface Review {
  rating: number[]
  reason: string
  conclusion: boolean
}

interface ReviewData extends NewsData, Review {}
