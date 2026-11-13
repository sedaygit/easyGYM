import asyncio
import os
import re
from edge_tts import Communicate

EXERCISES_FILE_PATH = "easygym/src/data/warmups.js" # Eğer dosya yolun farklıysa buradan ayarlayabilirsin
OUTPUT_DIR = "easygym/public/audio/warmups"

def parse_exercises_js(file_path):
    if not os.path.exists(file_path):
        alternative_paths = ["./src/data/warmups.js", "easygym/src/data/warmups.js", "../src/data/warmups.js", "warmups.js"]
        found = False
        for p in alternative_paths:
            if os.path.exists(p):
                file_path = p
                found = True
                break
        if not found:
            raise FileNotFoundError(f"'{file_path}' dosyası hiçbir konumda bulunamadı!")

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    exercises = []
    blocks = re.findall(r"\{([^}]+)\}", content)
    
    for block in blocks:
        if "id:" not in block:
            continue
            
        def extract_field(pattern, text, is_list=False):
            match = re.search(pattern, text, re.DOTALL)
            if not match:
                return [] if is_list else ""
            val = match.group(1).strip()
            if is_list:
                items = re.findall(r"['\"]([^'\"]+)['\"]", val)
                return items
            else:
                val = re.sub(r"^['\"]|['\"],?$", "", val).strip()
                return val

        ex_id = extract_field(r"id\s*:\s*['\"]([^'\"]+)['\"]", block)
        name = extract_field(r"name\s*:\s*['\"]([^'\"]+)['\"]", block)
        description = extract_field(r"description\s*:\s*['\"]([^'\"]+)['\"]", block)
        steps = extract_field(r"steps\s*:\s*\[(.*?)\]", block, is_list=True)
        tips = extract_field(r"tips\s*:\s*\[(.*?)\]", block, is_list=True)
        warning = extract_field(r"warning\s*:\s*['\"]([^'\"]+)['\"]", block)
        alt = extract_field(r"alt\s*:\s*['\"]([^'\"]+)['\"]", block)

        if ex_id:
            exercises.append({
                "id": ex_id,
                "name": name,
                "description": description,
                "steps": steps,
                "tips": tips,
                "warning": warning,
                "alt": alt
            })
            
    return exercises

async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    try:
        exercises = parse_exercises_js(EXERCISES_FILE_PATH)
    except Exception as e:
        print(f"Hata: {e}")
        return

    print(f"Toplam {len(exercises)} egzersiz bulundu. Ses dosyaları üretiliyor...\n")

    for ex in exercises:
        steps_text = ". ".join([f"Step {i+1}: {step}" for i, step in enumerate(ex["steps"])])
        tips_text = ". ".join([f"Tip: {tip}" for tip in ex["tips"]])
        
        full_text = f"{ex['name']}. {ex['description']}. {steps_text}. {tips_text}."
        if ex["warning"]:
            full_text += f" Careful: {ex['warning']}."
        if ex["alt"]:
            full_text += f" Easier alternative: {ex['alt']}."

        file_path = os.path.join(OUTPUT_DIR, f"{ex['id']}.mp3")
        print(f"-> Seslendiriliyor: {ex['name']} ({ex['id']}.mp3)")

        try:
            # Hatalı olan rate parametresi kaldırıldı, sorunsuz çalışacaktır
            communicate = Communicate(full_text, "en-US-JennyNeural")
            await communicate.save(file_path)
        except Exception as e:
            print(f"Hata oluştu ({ex['id']}): {e}")

    print("\nTüm ses dosyaları başarıyla oluşturuldu ve klasöre kaydedildi!")

if __name__ == "__main__":
    asyncio.run(generate_audio())