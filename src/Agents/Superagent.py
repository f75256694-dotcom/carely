import os
import sys
import ollama
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

# --- CONFIGURATION ---
TELEGRAM_TOKEN = "8851761688:AAG12-3SXyJTNwuyjqnuoDUFsSoypwflZSM"
ALLOWED_CHAT_ID = "502225112"
MODEL_NAME = "llama3.2"  # Lokales Modell auf deinem Mac
MAX_HISTORY_MESSAGES = 20  # Behält die letzten 20 Nachrichten im aktiven Kontext

# --- LOAD EXECUTIVE OPERATING SYSTEM PROMPT ---
PROMPT_FILE_PATH = os.path.join(os.path.dirname(__file__), "SA_system_prompt.md")

try:
    with open(PROMPT_FILE_PATH, "r", encoding="utf-8") as f:
        SYSTEM_PROMPT = f.read()
    print("✅ Helpify Executive Operating System V2 erfolgreich geladen.")
except Exception as e:
    print(f"❌ Fehler beim Laden der system_prompt.md: {e}")
    sys.exit(1)

# --- GLOBAL CONVERSATION HISTORY ---
chat_histories = {}

# Befehl `/reset` im Telegram-Chat löscht den Verlauf bei Bedarf
async def reset_history(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if str(update.effective_chat.id) != ALLOWED_CHAT_ID:
        return
    chat_histories[update.effective_chat.id] = []
    await update.message.reply_text("🧹 Gedächtnis zurückgesetzt. Wir starten ein neues Thema!")

# --- TELEGRAM MESSAGE HANDLER ---
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    if str(chat_id) != ALLOWED_CHAT_ID:
        return

    user_text = update.message.text
    await context.bot.send_chat_action(chat_id=chat_id, action="typing")

    if chat_id not in chat_histories:
        chat_histories[chat_id] = []

    # Benutzer-Nachricht im Speicher ablegen
    chat_histories[chat_id].append({"role": "user", "content": user_text})

    # Historie begrenzen, um den Arbeitsspeicher des M1 nicht zu überlasten
    if len(chat_histories[chat_id]) > MAX_HISTORY_MESSAGES:
        chat_histories[chat_id] = chat_histories[chat_id][-MAX_HISTORY_MESSAGES:]

    # Prompt + voller bisheriger Gesprächsverlauf als Kontext für Ollama
    messages_payload = [{"role": "system", "content": SYSTEM_PROMPT}] + chat_histories[chat_id]

    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=messages_payload
        )
        assistant_reply = response['message']['content']
        
        # Antwort der KI ebenfalls im Speicher sichern
        chat_histories[chat_id].append({"role": "assistant", "content": assistant_reply})
        
        await update.message.reply_text(assistant_reply)
    except Exception as e:
        await update.message.reply_text(f"⚠️ Fehler beim lokalen Modell: {e}")

# --- MAIN BOT RUNNER ---
if __name__ == "__main__":
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("reset", reset_history))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    print(f"🚀 Helpify Executive Superagent mit Gedächtnis (Lokal auf M1 mit {MODEL_NAME}) ist online...")
    app.run_polling()