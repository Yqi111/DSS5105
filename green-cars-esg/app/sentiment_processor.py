import os
import re
import fitz
import PyPDF2
import pandas as pd
from PIL import Image
from collections import defaultdict
from transformers import pipeline
from pytesseract import image_to_string

# Sentiment model pipeline (loaded once)
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")


def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text()
        if not text.strip():
            doc = fitz.open(pdf_path)
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                pix = page.get_pixmap()
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                text += image_to_string(img)
    except Exception as e:
        print(f"[PDF EXTRACT ERROR] {e}")
    return text


def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'[^\w\s.,]', '', text)
    return text.strip()


def extract_esg_sentences(text):
    esg_keywords = [
        "environment", "sustainability", "carbon", "social", "diversity",
        "governance", "ethics", "climate", "renewable", "energy",
        "emissions", "waste", "recycling", "employee", "community",
        "responsibility", "compliance", "transparency"
    ]
    return [sent.strip() for sent in text.split('.') if any(k in sent.lower() for k in esg_keywords)]


def categorize_esg_sentences(esg_sentences):
    categories = defaultdict(list)
    for sent in esg_sentences:
        lowered = sent.lower()
        if any(k in lowered for k in ["environment", "sustainability", "carbon", "climate", "renewable", "energy", "emissions", "waste", "recycling"]):
            categories["Environment"].append(sent)
        elif any(k in lowered for k in ["social", "diversity", "employee", "community", "responsibility"]):
            categories["Social"].append(sent)
        elif any(k in lowered for k in ["governance", "ethics", "compliance", "transparency"]):
            categories["Governance"].append(sent)
    return categories


def analyze_sentiment(sentences):
    results = {
        "Positive": [],
        "Negative": [],
        "Neutral": [],
        "Polarity_Scores": []
    }

    for sent in sentences:
        truncated = sent[:512]
        try:
            res = sentiment_pipeline(truncated)[0]
            score = res["score"]
            if res["label"] == "POSITIVE":
                results["Positive"].append(sent)
                results["Polarity_Scores"].append(score)
            elif res["label"] == "NEGATIVE":
                results["Negative"].append(sent)
                results["Polarity_Scores"].append(-score)
            else:
                results["Neutral"].append(sent)
                results["Polarity_Scores"].append(0)
        except Exception as e:
            print(f"[SENTIMENT ERROR] {e}")
            results["Neutral"].append(sent)
            results["Polarity_Scores"].append(0)

    return results


def calculate_average_polarity(results):
    return sum(results["Polarity_Scores"]) / len(results["Polarity_Scores"]) if results["Polarity_Scores"] else 0


def calculate_weighted_average_polarity(categories, results, weights):
    scores = []
    all_sentences = results["Positive"] + results["Negative"] + results["Neutral"]
    for cat in categories:
        sents = categories[cat]
        cat_scores = [results["Polarity_Scores"][i] for i, s in enumerate(all_sentences) if s in sents]
        if cat_scores:
            scores.append(sum(cat_scores) / len(cat_scores) * weights[cat])
    return sum(scores) / sum(weights.values()) if scores else 0


def process_esg_report(pdf_path):
    raw_text = extract_text_from_pdf(pdf_path)
    cleaned = clean_text(raw_text)
    esg_sentences = extract_esg_sentences(cleaned)
    categories = categorize_esg_sentences(esg_sentences)
    sentiments = analyze_sentiment(esg_sentences)

    polarity_scores = {
        cat: calculate_average_polarity({
            "Polarity_Scores": [sentiments["Polarity_Scores"][i]
            for i, s in enumerate(sentiments["Positive"] + sentiments["Negative"] + sentiments["Neutral"])
            if s in categories.get(cat, [])]
        }) for cat in ["Environment", "Social", "Governance"]
    }

    weights = {"Environment": 0.4, "Social": 0.35, "Governance": 0.25}
    weighted_avg = calculate_weighted_average_polarity(categories, sentiments, weights)

    return {
        "esg_categories": categories,
        "sentiment_results": sentiments,
        "avg_polarity": calculate_average_polarity(sentiments),
        "esg_polarity_scores": polarity_scores,
        "weighted_avg_polarity": weighted_avg
    }
