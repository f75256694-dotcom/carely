"""
Standalone Podcast Subtitle Generator
Transkribiert automatisch Videos und erzeugt dynamische 3-Wort-Untertitel
mit gelbem Word-Highlighting im Hormozi / TikTok-Stil.
"""
import os
import sys
import subprocess
import whisper


def seconds_to_ass_time(seconds):
    """Konvertiert Sekunden in das ASS-Zeitformat (H:MM:SS.cc)."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:05.2f}"


def ass_escape(text):
    """Macht Sonderzeichen sicher für das ASS-Format."""
    return text.replace("{", "\\{").replace("}", "\\}").replace("\n", "\\N")


def chunk_words(words, size=3):
    """Teilt Wörter in Gruppen von maximal N Wörtern auf."""
    return [words[i:i + size] for i in range(0, len(words), size)]


def generate_ass_subtitles(segments, ass_path):
    """Erzeugt die ASS-Untertiteldatei mit Gelb-Highlighting und Vergrößerung."""
    ass_header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: TikTok,Impact,85,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,6,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for seg in segments:
        words = [w for w in seg.get("words", []) if w.get("word", "").strip()]
        for chunk in chunk_words(words, 3):
            for idx, active_w in enumerate(chunk):
                start_t = seconds_to_ass_time(active_w["start"])
                end_t = seconds_to_ass_time(active_w["end"])
                
                # Wenn ein Wort extrem kurz ist, Start/Ende absichern
                if active_w["start"] >= active_w["end"]:
                    continue

                formatted_words = []
                for i, w in enumerate(chunk):
                    clean_w = ass_escape(w["word"].strip().upper())
                    if i == idx:
                        # Aktives Wort: Gelb (&H0000FFFF&) und 120% skaliert
                        formatted_words.append(f"{{\\pos(540,1650)\\c&H0000FFFF&\\fscx120\\fscy120}}{clean_w}")
                    else:
                        # Inaktive Wörter: Weiß (&H00FFFFFF&) und 100% skaliert
                        formatted_words.append(f"{{\\pos(540,1650)\\c&H00FFFFFF&\\fscx100\\fscy100}}{clean_w}")

                line_text = " ".join(formatted_words)
                lines.append(f"Dialogue: 0,{start_t},{end_t},TikTok,,0,0,0,,{line_text}")

    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(ass_header + "\n".join(lines) + "\n")


def process_video(input_video, output_video, model_size="base"):
    if not os.path.exists(input_video):
        print(f"❌ Fehler: Die Datei '{input_video}' wurde nicht gefunden.")
        return

    print("🎙️ Schritt 1/3: Transkribiere Audio via Whisper...")
    model = whisper.load_model(model_size)
    result = model.transcribe(input_video, word_timestamps=True, language="de")

    print("✍️ Schritt 2/3: Erzeuge dynamische Untertitel...")
    temp_ass = "temp_podcast_subs.ass"
    generate_ass_subtitles(result.get("segments", []), temp_ass)

    print("🎬 Schritt 3/3: Brenne Untertitel mit FFmpeg ein...")
    cmd = [
        "ffmpeg", "-y", "-i", input_video,
        "-vf", f"subtitles={temp_ass}",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        "-c:a", "copy",
        output_video
    ]

    try:
        subprocess.run(cmd, check=True)
        print(f"\n✅ FERTIG! Dein Video wurde gespeichert unter: {output_video}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Fehler beim Rendern: {e}")
    finally:
        if os.path.exists(temp_ass):
            os.remove(temp_ass)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("\n💡 Nutzung im Terminal:")
        print("python podcast_subs.py <eingabe_video.mp4> <ausgabe_video.mp4>\n")
    else:
        process_video(sys.argv[1], sys.argv[2])