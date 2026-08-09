'use client';

import { X } from 'lucide-react';
import { CareRecipient } from '@/types/care';
import { useState, useEffect } from 'react';

interface BudgetModalProps {
  editingRecipient: CareRecipient | null;
  onClose: () => void;
  onSave: (newBudget: number, recipientId: string) => void;
}

export default function BudgetModal({ editingRecipient, onClose, onSave }: BudgetModalProps) {
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    if (editingRecipient) {
      setInputVal(editingRecipient.budgetMax.toString());
    }
  }, [editingRecipient]);

  if (!editingRecipient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed) && parsed >= 0) {
      onSave(parsed, editingRecipient.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif font-bold text-lg">Budget anpassen</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-bold text-slate-500 mb-2">Maximales Budget (€)</label>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none mb-6"
          />
          <button type="submit" className="w-full py-3 bg-[#063934] text-white rounded-xl font-bold hover:bg-[#084d46] transition cursor-pointer">
            Speichern
          </button>
        </form>
      </div>
    </div>
  );
}