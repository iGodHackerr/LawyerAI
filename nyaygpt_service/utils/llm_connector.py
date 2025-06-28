# utils/llm_connector.py
import subprocess

def query_tinyllama_ollama(prompt):
    try:
        result = subprocess.run(
            ["ollama", "run", "tinyllama"],
            input=prompt.encode('utf-8'),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30
        )
        output = result.stdout.decode('utf-8').strip()
        if result.returncode != 0:
            print(f"❌ Ollama error: {result.stderr.decode('utf-8')}")
            return "⚠️ Couldn't generate a useful response due to an internal error."
        return output or "⚠️ No response generated."
    except subprocess.TimeoutExpired:
        return "⚠️ Response generation timed out. Try again."
    except FileNotFoundError:
        return "❌ Ollama is not installed or not in PATH. Install it to use NyayGPT."
    except Exception as e:
        return f"⚠️ Unexpected error: {str(e)}"
