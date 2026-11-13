
import asyncio
import json
import subprocess
from pathlib import Path

from edge_tts import Communicate
import re

PRONUNCIATION_MAP = {
    "Cable Fly": "Keybıl Fılay",
    "Barbell Press": "Barrbel Pıress",
    "Romanian Deadlift": "Romaniyın Ded Lift",
    "Goblet Squat": "Gablet Skvat",
    "Dumbbell Bench Press": "Dambıl Bench Pres",
    "Overhead Press": "Overhed Pres",
    "Lateral Raise": "Laterıl Reyz",
    "Face Pull": "Feys Pul",
    "Lat Pulldown": "Lat Pul Davn",
    "Walking Lunge": "Volking Lanç",
    "Calf Raise": "Kelf Reyz",
    "Triceps Pushdown": "Triseps Puş Davn",
    "Hammer Curl": "Hemır Körl",
    "Dead Bug": "Ded Bag",
    "Russian Twist": "Raşşın Tvist",
    "Push-up": "Puş Ap",
    "Pull-up": "Pul Ap",
    "Deadlift": "Ded Lift",
    "Squat": "Skvat",
    "Plank": "Plengk",
    "Curl": "Körl",
    "Raise": "Reyz",
    "Press": "Pres",
    "Fly": "Flay",
    "Dip": "Dip",
    "Lunge": "Lanj",
    "Biceps": "Biseps",
    "Kettlebell" : "Kedtılbell",
    "Pulldown" : "Pull davn",
    "Lunge": "Lanç",
    "Quadriceps" : "Kuvadriseps",
    "Hamstring" : "Hemstrink",
}

def apply_pronunciation_dictionary(text):
    for original, pronunciation in PRONUNCIATION_MAP.items():
        pattern = rf'(?<!\w){re.escape(original)}(?!\w)'
        text = re.sub(
            pattern,
            pronunciation,
            text,
            flags=re.IGNORECASE
        )

    return text

# Proje klasörü
PROJECT_ROOT = Path(__file__).resolve().parent / "easygym"

VOICE = "tr-TR-EmelNeural"

OUTPUT_EXERCISES = PROJECT_ROOT / "public/audio/tr/exercises"
OUTPUT_WARMUPS = PROJECT_ROOT / "public/audio/tr/warmups"


def load_project_data():
    """
    Egzersizleri, ısınma/soğuma hareketlerini ve
    Türkçe çevirileri doğrudan JavaScript dosyalarından okur.
    """

    root = json.dumps(str(PROJECT_ROOT))

    node_code = f"""
import {{ pathToFileURL }} from 'node:url';
import {{ join }} from 'node:path';

const root = {root};
const project = root;
const {{ EXERCISES }} = await import(
  pathToFileURL(join(project, 'src/data/exercises.js'))
);

const {{
  WARMUP_EXERCISES,
  COOLDOWN_EXERCISES,
}} = await import(
  pathToFileURL(join(project, 'src/data/warmups.js'))
);

const {{ translations }} = await import(
  pathToFileURL(join(project, 'src/i18n/translations.js'))
);

const data = {{
  exercises: EXERCISES,
  warmups: Object.values(WARMUP_EXERCISES),
  cooldowns: Object.values(COOLDOWN_EXERCISES),
  translations: translations.tr,
}};

console.log(JSON.stringify(data));
"""

    result = subprocess.run(
        ["node", "--input-type=module", "-e", node_code],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8"
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    return json.loads(result.stdout)


def translated(translations, key, fallback=""):
    value = translations.get(key)

    if not value:
        print(f"UYARI: Türkçe çeviri bulunamadı: {key}")
        return fallback

    return value


def create_narration(exercise, translations):
    exercise_id = exercise["id"]
    prefix = f"exercise_{exercise_id}"

    name = translated(
        translations,
        prefix,
        exercise.get("name", "")
    )

    description = translated(
        translations,
        f"{prefix}_description",
        exercise.get("description", "")
    )

    parts = [name, description]

    for index, step in enumerate(exercise.get("steps", []), start=1):
        step_text = translated(
            translations,
            f"{prefix}_step_{index}",
            step
        )

        parts.append(f"Adım {index}: {step_text}")

    for index, tip in enumerate(exercise.get("tips", []), start=1):
        tip_text = translated(
            translations,
            f"{prefix}_tip_{index}",
            tip
        )

        parts.append(f"İpucu: {tip_text}")

    warning = exercise.get("warning")

    if warning:
        warning_text = translated(
            translations,
            f"{prefix}_warning",
            warning
        )

        parts.append(f"Dikkat: {warning_text}")

    alternative = exercise.get("alt")

    if alternative:
        alternative_text = translated(
            translations,
            f"{prefix}_alt",
            alternative
        )

        parts.append(f"Daha kolay alternatif: {alternative_text}")

    return ". ".join(part for part in parts if part)



async def generate_group(exercises, translations, output_dir, group_name):
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n{group_name}: {len(exercises)} hareket bulundu.")

    success_count = 0
    error_count = 0

    for exercise in exercises:
        exercise_id = exercise["id"]
        file_path = output_dir / f"{exercise_id}.mp3"

        narration = create_narration(exercise, translations)

        if not narration.strip():
            print(f"Atlandı: {exercise_id} - Metin bulunamadı.")
            continue

        print(f"Seslendiriliyor: {exercise_id}.mp3")

        try:
            # Türkçe telaffuz düzenlemelerini uygula
            narration = apply_pronunciation_dictionary(narration)

            communicate = Communicate(narration, VOICE)
            await communicate.save(str(file_path))

            success_count += 1

        except Exception as error:
            error_count += 1
            print(f"HATA ({exercise_id}): {error}")

    print(f"\n{group_name} sonucu:")
    print(f"Başarılı: {success_count}")
    print(f"Hatalı: {error_count}")



async def main():
    try:
        data = load_project_data()

        translations = data["translations"]

        await generate_group(
            data["exercises"],
            translations,
            OUTPUT_EXERCISES,
            "Ana egzersizler"
        )

        all_warmups = data["warmups"] + data["cooldowns"]

        await generate_group(
            all_warmups,
            translations,
            OUTPUT_WARMUPS,
            "Isınma ve soğuma hareketleri"
        )

        print("\nTürkçe ses üretimi tamamlandı!")

    except Exception as error:
        print(f"\nİşlem durduruldu: {error}")


if __name__ == "__main__":
    asyncio.run(main())
