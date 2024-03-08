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
