import random
import requests
import time

import pandas as pd

from bs4 import BeautifulSoup
from tqdm import tqdm


TOPIC_SLICE = slice(1000, 2000)


def get_links(query: str, category: str = "nws", language: str = "en"):
    with requests.Session() as s:
        headers = {
            "referer": "referer: https://www.google.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
        }
        response = s.get(f"https://www.google.com/search?q={'+'.join(query.split())}&tbm={category}&lr=lang_{language}", headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        links = [str(a_tag.get("href")).replace("\"", "") for a_tag in soup.find_all("a")]
        return list(filter(lambda link: link and link.startswith("https") and link.count("google.com") == 0, links))


if __name__ == "__main__":
    with open("../data/random_words.txt") as fp:
        queries = fp.readlines()[TOPIC_SLICE]
    links = []
    progress = tqdm(queries)
    for query in queries:
        links.extend(get_links(query))
        progress.n += 1
        progress.refresh()
        time.sleep(random.random() * 0.3)
        if progress.n % 10 == 0: time.sleep(random.random())
    links_set = set([*links, *pd.read_csv("../data/links.csv")["links"]])
    df = pd.DataFrame({ "links": list(links_set) })
    df.to_csv(f"../data/links.csv", index=False)
