import json
import random


with open("../data/reviews.json", "r", encoding="utf-8") as fp:
    reviews = json.load(fp)


valid_reviews = [review for review in reviews if len([r for r in review["rating"] if r is not None]) == 7]
random.shuffle(valid_reviews)

test_data = valid_reviews[50:]
train_data = valid_reviews[:50]

expected_accepted = [vr for vr in valid_reviews if bool(vr['conclusion'])]
expected_rejected = [vr for vr in valid_reviews if not bool(vr['conclusion'])]


print(f"Total: {len(valid_reviews)}")
print(f"Expected accepted: {len(expected_accepted)}")
print(f"Expected rejected: {len(expected_rejected)}")
print(f"Percentage of expected accepted reviews: {len(expected_accepted) / len(valid_reviews) * 100:.2f}%")
print()
print(f"Test: {len(test_data)}")
print(f"Expected accepted in Test: {len([vr for vr in test_data if bool(vr['conclusion'])])}")
print(f"Expected rejected in Test: {len([vr for vr in test_data if not bool(vr['conclusion'])])}")
print(f"Percentage of expected accepted reviews in Test: {len([vr for vr in test_data if bool(vr['conclusion'])]) / len(test_data) * 100:.2f}%")
print()
print(f"Train: {len(train_data)}")
print(f"Expected accepted in Train: {len([vr for vr in train_data if bool(vr['conclusion'])])}")
print(f"Expected rejected in Train: {len([vr for vr in train_data if not bool(vr['conclusion'])])}")
print(f"Percentage of expected accepted reviews in Train: {len([vr for vr in train_data if bool(vr['conclusion'])]) / len(train_data) * 100:.2f}%")


with open("../data/training/test.json", "w", encoding="utf-8") as fp:
    json.dump(test_data, fp)

with open("../data/training/train.json", "w", encoding="utf-8") as fp:
    json.dump(train_data, fp)
