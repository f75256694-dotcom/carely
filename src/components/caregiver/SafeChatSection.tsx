'use client';

import { useState } from 'react';
import { MessageSquare, Calendar as CalendarIcon, Clock, MapPin, Send, Download, CheckCircle2 } from 'lucide-react';

interface SafeChatSectionProps {
  onAcceptJob: (job: any) => void;
}

export function SafeChatSection({ onAcceptJob }: SafeChatSectionProps) {
  const [messages, setMessages] = useState([
    { sender: 'incoming', text: 'Hallo! Passt morgen um 10:00 Uhr bei Ihnen?', time: '13:20' },
    { sender: 'outgoing', text: 'Hallo! Ja, das passt perfekt.', time: '13:35' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => [...prev, { sender: 'outgoing', text: inputMessage, time: 'Gerade eben' }]);
    setInputMessage('');
  };

  const downloadCalendarFile = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Carely Einsatz - Maria Schwabing\nDTSTART:20260319T100000Z\nDTEND:20260319T120000Z\nLOCATION:München Schwabing\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'carely-einsatz.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirm = () => {
    setBookingConfirmed(true);
    onAcceptJob({
      id: 'job-' + Date.now(),
      title: 'Wocheneinkauf für Maria Schwabing',
      date: 'Morgen, 10:00 Uhr',
      location_zip: '80801 München-Schwabing',
      status: 'confirmed'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] bg-white border border-gray-200 shadow-xl rounded-[2.5rem] h-[580px] overflow-hidden">
      {/* Messages Column */}
      <div className="flex flex-col h-full border-r border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-sm font-black text-gray-900">Maria Schwabing (82)</h3>
            <p className="text-[11px] text-gray-500 font-semibold">Wocheneinkauf & Begleitung</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black ${bookingConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {bookingConfirmed ? 'Bestätigt' : 'Offen'}
          </span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-gray-50/20">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col max-w-[75%] ${msg.sender === 'outgoing' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <div className={`p-3 rounded-2xl text-xs font-medium ${msg.sender === 'outgoing' ? 'bg-teal-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Sichere Nachricht schreiben..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-teal-500"
          />
          <button onClick={handleSendMessage} className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-1">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Details Side Panel */}
      <div className="p-5 bg-gray-50/50 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Einsatz-Details</h4>
          <div className="space-y-2 text-xs text-gray-700 font-medium">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200/60"><CalendarIcon className="w-4 h-4 text-teal-600" /> Morgen, 10:00 Uhr</div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200/60"><Clock className="w-4 h-4 text-teal-600" /> ca. 2 Stunden</div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200/60"><MapPin className="w-4 h-4 text-teal-600" /> 80801 Schwabing</div>
          </div>
        </div>

        <div className="space-y-2">
          {!bookingConfirmed ? (
            <button
              onClick={handleConfirm}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Einsatz Verbindlich Zusagen
            </button>
          ) : (
            <button
              onClick={downloadCalendarFile}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Kalendereintrag (.ics)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}