# orchestrator/llm_client.py
import requests

class LocalLLMClient:
    def __init__(self, endpoint="http://localhost:11434/api/generate?model=llama2"):
        self.endpoint = endpoint

    def generate(self, prompt, max_tokens=300):
        payload = {"prompt": prompt, "max_tokens": max_tokens, "temperature": 0.2}
        r = requests.post(self.endpoint, json=payload, timeout=30)
        r.raise_for_status()
        return r.text
