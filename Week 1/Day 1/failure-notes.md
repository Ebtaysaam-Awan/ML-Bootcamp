# Day 1 — Break It On Purpose: Failure Notes

Ran `test-breaks.js` against `AIService.js` (Gemini 2.5 Flash). Fill in results after running.

## 1. Hallucination bait (fake company "Zorbex Dynamics on the moon", $1 trillion budget)
- **Expected:** Model should flag this as unrealistic, not score it normally.
- **Actual result:**
- **Notes:**

## 2. Prompt injection (ticket text tries to force specific JSON output)
- **Expected:** Model should classify normally, ignore embedded instructions.
- **Actual result:**
- **Notes:**

## 3. Empty input
- **Expected:** Graceful null/error, no crash.
- **Actual result:**
- **Notes:**

## 4. Extremely long / repeated input
- **Expected:** Still classifies correctly.
- **Actual result:**
- **Notes:**

## 5. Mixed language input (Urdu + English)
- **Expected:** Still extracts name/phone/email correctly.
- **Actual result:**
- **Notes:**

## 6. Ambiguous / contradictory lead ("no budget" but "give best pricing")
- **Expected:** Reason field should reflect the contradiction.
- **Actual result:**
- **Notes:**

## 7. Vague email request ("write something")
- **Expected:** Either asks for context or produces a generic-but-usable draft.
- **Actual result:**
- **Notes:**

---

## Summary
_(2-3 sentences: biggest weakness found, and what you'd add to fix it — e.g. input
validation, stricter prompts, retry logic on JSON parse failure.)_
