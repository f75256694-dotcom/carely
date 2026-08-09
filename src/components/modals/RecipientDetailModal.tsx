'use client';

import { X, Trash2, Save, User, Phone, MapPin, FileText } from 'lucide-react';
import { CareRecipient } from '@/types/care';
import { useState } from 'react';

interface RecipientDetailModalProps {
  recipient: CareRecipient | null;
  onClose: () => void;
  onSave: (updated: CareRecipient) => void;
  onDelete: (id: string) => void;
}

export default function RecipientDetailModal({ recipient, onClose, onSave, onDelete }: RecipientDetailModalProps) {
  if (!recipient) return null;

  const [formData, setFormData] = useState<CareRecipient>(recipient);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <img src={recipient.avatar} alt={recipient.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-600 shadow-sm" />
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-900">{recipient.name}</h3>
              <p className="text-xs text-slate-500">{recipient.relation} • {recipient.careLevel}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" /> Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" /> Telefon
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Pflegegrad</label>
              <input
                type="text"
                value={formData.careLevel}
                onChange={(e) => setFormData({ ...formData, careLevel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" /> Adresse
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" /> Medizinische Hinweise / Notizen
            </label>
            <textarea
              rows={3}
              value={formData.medicalNotes || ''}
              onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (confirm('Möchtest du diesen Angehörigen wirklich abmelden / aus dem System entfernen?')) {
                  onDelete(recipient.id);
                }
              }}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-rose-200"
            >
              <Trash2 className="w-4 h-4" /> Angehörigen abmelden
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#063934] hover:bg-[#084d46] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" /> Änderungen speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}