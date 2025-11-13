# examples/openai_fallback.py
import os
from openai import OpenAI

# pip install openai (or the appropriate sdk)
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def openai_generate(prompt):
    resp = client.responses.create(
        model="gpt-4o-mini",  # adjust model
        input=prompt
    )
    return resp.output_text

if __name__ == "__main__":
    print(openai_generate("Provide a short Python function to normalize a DataFrame."))
