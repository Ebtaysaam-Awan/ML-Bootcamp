# Gemini API — First Project

A minimal Python project that calls Google's **Gemini API** (free tier)
using nothing but the `requests` library. No paid SDK, no billing account
needed — just your free API key.

## 1. Get a free API key

Go to https://aistudio.google.com/app/apikey and generate a key
(the free tier includes generous quota for models like
`gemini-2.0-flash` and `gemini-2.5-flash`).

## 2. Set up the project

```bash
# unzip and enter the folder
cd gemini_api_project

# (recommended) create a virtual environment
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt
```

## 3. Add your API key

Rename `.env.example` to `.env` and paste in your key:

```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

(You can also skip the `.env` file — the script will just ask you to
type the key in when you run it.)

## 4. Run it

```bash
python main.py
```

You'll get a simple chat loop in your terminal:

```
Gemini API Chat — model: gemini-2.0-flash
Type your message and press Enter. Type 'exit' to quit.

You: What's the capital of France?

Gemini: The capital of France is Paris.

You: exit
Goodbye!
```

## How it works

`main.py` sends a POST request to Gemini's REST endpoint:

```
https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=YOUR_KEY
```

with a JSON body containing your prompt, and prints back the model's
text reply. That's the entire integration — see `call_gemini()` in
`main.py` for the ~15 lines of code doing the actual work.

## Switching models

Free-tier models you can try by changing `GEMINI_MODEL` in `.env`:

- `gemini-2.0-flash` — fast, solid default, good free quota
- `gemini-2.5-flash` — newer, more capable, check current free-tier limits

## Notes

- Keep your API key secret — never commit `.env` to version control
  (a `.gitignore` is included that already excludes it).
- If you hit a quota/rate-limit error, wait a bit or check your usage
  at https://aistudio.google.com.
