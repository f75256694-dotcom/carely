'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function CreateRequestPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Einkauf');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationZip, setLocationZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Du musst eingeloggt sein, um eine Anfrage zu erstellen.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('care_requests').insert([
      {
        user_id: user.id,
        title,
        category,
        description,
        date,
        time,
        location_zip: locationZip,
        status: 'open',
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/care-seeker');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Neue Hilfsanfrage erstellen</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titel der Anfrage</label>
          <input
            type="text"
            required
            placeholder="z.B. Unterstützung beim Wocheneinkauf"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="Einkauf">Einkauf & Besorgungen</option>
            <option value="Haushalt">Haushalt & Garten</option>
            <option value="Gesellschaft">Gesellschaft & Spaziergang</option>
            <option value="Begleitung">Arzt- & Terminbegleitung</option>
            <option value="Technik">Technik-Hilfe</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Datum</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Uhrzeit / Zeitfenster</label>
            <input
              type="text"
              required
              placeholder="z.B. 14:00 - 16:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Postleitzahl / Ort</label>
          <input
            type="text"
            required
            placeholder="z.B. 10115 Berlin"
            value={locationZip}
            onChange={(e) => setLocationZip(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Beschreibung & Details</label>
          <textarea
            rows={3}
            placeholder="Was genau soll gemacht werden? Gibt es Besonderheiten?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Wird veröffentlicht...' : 'Hilfsanfrage veröffentlichen'}
        </button>
      </form>
    </div>
  );
}