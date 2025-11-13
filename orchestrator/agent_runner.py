# orchestrator/agent_runner.py
from orchestrator.llm_client import LocalLLMClient

def run_task(prompt):
    client = LocalLLMClient()
    resp = client.generate(prompt)
    # naive parsing & action stub
    print("LLM Response:", resp)

if __name__ == "__main__":
    run_task("Suggest a data pipeline for daily ingestion from S3 to Delta Lake.")
