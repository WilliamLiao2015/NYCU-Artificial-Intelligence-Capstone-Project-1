import json
import time

import gradio as gr


with open("../data/training/test.json", "r", encoding="utf-8") as fp:
    test_reviews = json.load(fp)


def save_review(review, human_conclusion: int):
    try:
        with open("../data/training/test_human.json", "r", encoding="utf-8") as fp:
            reviews = json.load(fp)
    except: reviews = []
    with open("../data/training/test_human.json", "w", encoding="utf-8") as fp:
        review["humanConclusion"] = human_conclusion
        found = [i for i, r in enumerate(reviews) if r["link"] == review["link"]]
        if len(found): reviews[found[0]] = review
        else: reviews.append(review)
        json.dump(reviews, fp)


iterator = iter(test_reviews[25:])

with gr.Blocks(gr.themes.Default(text_size="lg")) as demo:
    try: review = next(iterator)
    except StopIteration: quit()

    markdown_preview = gr.Markdown(f"# [{review['title']}]({review['link']})\n\n{review['textContent']}".replace("\n", "\n\n").replace("\t", "").replace(r"\s", " "), label="Review")
    button_accept = gr.Button("Accept")
    button_reject = gr.Button("Reject")

    def switch_review():
        global review
        try: review = next(iterator)
        except StopIteration:
            review = None
            return "No more reviews"
        return f"# [{review['title']}]({review['link']})\n\n{review['textContent']}".replace("\n", "\n\n").replace("\t", "").replace(r"\s", " ")

    def on_click_accept(review):
        if review: save_review(review, 1)
        time.sleep(0.5)
        return switch_review()

    def on_click_reject(review):
        if review: save_review(review, 0)
        time.sleep(0.5)
        return switch_review()

    button_accept.click(lambda: on_click_accept(review), outputs=markdown_preview)
    button_reject.click(lambda: on_click_reject(review), outputs=markdown_preview)


demo.launch(share = True)
