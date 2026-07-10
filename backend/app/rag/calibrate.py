"""
Calibration script — run this to see retrieval scores across question
buckets so you can pick real MIN_SCORE / FOLLOW_UP_MIN_SCORE values.

Usage:
    python calibrate.py
"""

from app.rag.retriever import retrieve

QUESTIONS = {
    "A_well_covered": [
        "Who founded Asan Innovators?",
        "What services does Asan Innovators offer?",
        "How much does mobile app development cost?",
        "What is LeadPilot?",
        "What technologies do you use for web development?",
        "Where is your office located?",
        "What certifications does Asan Innovators hold?",
        "Which industries have you worked in?",
        "How can I contact Asan Innovators?",
        "Do you offer internships?",
        "What is the typical timeline for a chatbot project?",
        "Tell me about the Optex Opticians project.",
        "What are the three portals in LeadPilot?",
        "Does Asan Innovators build e-commerce websites?",
        "What is your client satisfaction rating?",
    ],
    "B_borderline": [
        "pricing for AI ML",
        "web dev cost",
        "is chatbot fast",
        "who is CEO",
        "app timeline",
        "leadpilot launch date",
        "team size",
    ],
    "C_out_of_scope": [
        "What is your refund policy?",
        "Who are your competitors?",
        "Do you accept cryptocurrency payments?",
        "What's the weather in Hyderabad today?",
        "Can I speak to a human customer support agent right now?",
        "What is your revenue?",
        "Do you have an office in the US?",
        "What programming language is best for beginners?",
    ],
    "D_followup_style": [
        "What's your pricing for chatbots?",
        "Can I see your portfolio?",
        "What technologies do you use?",
        "How do I contact you?",
        "Do you offer internships?",
        "When will LeadPilot launch?",
        "What's your response time?",
        "Do you work with startups?",
    ],
}


def main():
    results = {}

    for bucket, questions in QUESTIONS.items():
        bucket_scores = []
        for q in questions:
            nodes = retrieve(q, min_score=0.0)  # no cutoff, we want raw scores
            top_score = nodes[0].score if nodes else None
            bucket_scores.append((q, top_score))
        results[bucket] = bucket_scores

    print("\n\n========== CALIBRATION SUMMARY ==========\n")

    for bucket, scores in results.items():
        valid = [s for _, s in scores if s is not None]
        avg = sum(valid) / len(valid) if valid else 0
        lo = min(valid) if valid else 0
        hi = max(valid) if valid else 0

        print(f"--- {bucket} ---  (avg={avg:.3f}  min={lo:.3f}  max={hi:.3f})")
        for q, s in sorted(scores, key=lambda x: (x[1] is None, x[1]), reverse=True):
            score_str = f"{s:.3f}" if s is not None else "NO MATCH"
            print(f"  {score_str:>10}  |  {q}")
        print()

    print("===========================================\n")
    print("How to read this:")
    print("- MIN_SCORE: pick a value between max(C) and min(A).")
    print("- FOLLOW_UP_MIN_SCORE: pick a value between max(C) and min(D).")
    print("- If A and C overlap, or D scores are systematically lower than A,")
    print("  note it — may mean short queries need their own threshold logic.")


if __name__ == "__main__":
    main()
