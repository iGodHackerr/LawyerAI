# utils/data_loader.py
import json
import os

def load_legal_data(file_paths):
    data = []
    for path in file_paths:
        if not os.path.exists(path):
            print(f"❌ File not found: {path}")
            continue

        try:
            with open(path, 'r', encoding='utf-8') as f:
                file_data = json.load(f)
                if isinstance(file_data, list):
                    data.extend(file_data)
                else:
                    data.append(file_data)
        except json.JSONDecodeError:
            print(f"⚠️ Invalid JSON format in file: {path}")
        except Exception as e:
            print(f"⚠️ Error while loading {path}: {e}")
    return data
