import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// Lazy, damit der Build (Prerendering) nicht abbricht, wenn die ENV-Variablen fehlen.
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error('Supabase ist nicht konfiguriert (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY fehlen).');
    }
    client = createClient(url, anonKey);
  }
  return client;
}

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

// Erlaubt +, Leerzeichen, Klammern, Schrägstrich und Bindestriche; mind. 7 Ziffern.
export const isValidPhone = (phone: string) =>
  /^[+\d][\d\s()/-]*$/.test(phone.trim()) && phone.replace(/\D/g, '').length >= 7;

// Supabase-Fehler sind Plain Objects ({ code, message, details, hint }) – console.error(err)
// zeigt im Browser sonst oft nur "{}". Daher die Felder explizit protokollieren.
export function logSubmitError(context: string, err: unknown) {
  if (err && typeof err === 'object' && 'message' in err) {
    const { code, message, details, hint } = err as Record<string, unknown>;
    console.error(`${context}:`, { code, message, details, hint });
  } else {
    console.error(`${context}:`, err);
  }
}

export function submitErrorMessage(err: unknown): string {
  const contact = 'Bitte versuche es erneut oder schreib uns an office@helpifyservices.at.';
  if (err instanceof TypeError) {
    return `Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung. ${contact}`;
  }
  if (err instanceof Error && err.message.startsWith('Supabase ist nicht konfiguriert')) {
    return `Das Formular ist derzeit technisch nicht erreichbar. ${contact}`;
  }
  return `Es gab ein Problem beim Absenden. ${contact}`;
}

// Benachrichtigung ans Team im Hintergrund. fetch() wirft bei HTTP-Fehlern (4xx/5xx) nicht,
// daher den Status selbst prüfen, damit fehlgeschlagene Mails in der Konsole sichtbar werden.
export function notifyTeam(payload: Record<string, unknown>) {
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async res => {
      if (!res.ok) {
        console.error(`Benachrichtigungs-Mail fehlgeschlagen (HTTP ${res.status}):`, await res.text().catch(() => ''));
      }
    })
    .catch(err => console.error('Benachrichtigungs-Mail fehlgeschlagen (Netzwerk):', err));
}
