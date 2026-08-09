'use client'

import React, { useState } from 'react'

export default function WienPilotPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    targetGroup: '',
    district: '',
    services: [] as string[],
    name: '',
    email: '',
    phone: '',
    gdpr: false,
  })

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Hier kannst du die Daten an dein Backend / Email-API schicken
    console.log('Form Submitted:', formData)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#F0F6F4] text-[#112a24] font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Header / Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2a524a] text-white flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#112a24] font-serif">
          Carely
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-900/5 relative overflow-hidden">
        {/* Progress Bar */}
        {!submitted && (
          <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-[#2a524a] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#2a524a] rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-[#112a24]">
              Vielen Dank für Ihre Anfrage!
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Wir haben Ihre Angaben erhalten. Unser Wiener Team meldet sich
              innerhalb von 24 Stunden persönlich bei Ihnen für das weitere
              Vorgehen.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a524a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Schritt 1 von 4
                  </span>
                  <h1 className="text-2xl font-bold text-[#112a24]">
                    Für wen suchen Sie Unterstützung in Wien?
                  </h1>
                </div>

                <div className="space-y-3">
                  {[
                    'Für meine Eltern',
                    'Für mich selbst',
                    'Für Verwandte / Bekannte',
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, targetGroup: option })
                        setStep(2)
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all text-base font-medium flex justify-between items-center ${
                        formData.targetGroup === option
                          ? 'border-[#2a524a] bg-emerald-50/50 text-[#2a524a] font-semibold'
                          : 'border-slate-200 hover:border-emerald-300 text-slate-700'
                      }`}
                    >
                      {option}
                      <span className="text-slate-400">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a524a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Schritt 2 von 4
                  </span>
                  <h2 className="text-2xl font-bold text-[#112a24]">
                    In welchem Wiener Bezirk wohnen die Angehörigen?
                  </h2>
                  <p className="text-xs text-slate-500">
                    So finden wir gezielt helfende Hände aus der unmittelbaren
                    Nachbarschaft.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="z.B. 1070 Wien oder Neubau"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#2a524a] text-base"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                  >
                    Zurück
                  </button>
                  <button
                    type="button"
                    disabled={!formData.district.trim()}
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3.5 rounded-2xl bg-[#2a524a] text-white font-medium hover:bg-[#112a24] disabled:opacity-50 transition-all"
                  >
                    Weiter
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a524a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Schritt 3 von 4
                  </span>
                  <h2 className="text-2xl font-bold text-[#112a24]">
                    Welche Unterstützung wird benötigt?
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mehrfachauswahl möglich.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'Einkauf', label: '🛒 Einkaufen & Besorgungen' },
                    { id: 'Spaziergang', label: '🌳 Spaziergänge & Gesellschaft' },
                    { id: 'Haushalt', label: '🧹 Leichte Hilfe im Haushalt' },
                    { id: 'Arzt', label: '🩺 Begleitung zu Arztterminen' },
                  ].map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all text-sm font-medium ${
                        formData.services.includes(service.id)
                          ? 'border-[#2a524a] bg-emerald-50 text-[#2a524a] font-semibold'
                          : 'border-slate-200 hover:border-emerald-200 text-slate-700'
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                  >
                    Zurück
                  </button>
                  <button
                    type="button"
                    disabled={formData.services.length === 0}
                    onClick={() => setStep(4)}
                    className="w-2/3 py-3.5 rounded-2xl bg-[#2a524a] text-white font-medium hover:bg-[#112a24] disabled:opacity-50 transition-all"
                  >
                    Weiter
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a524a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Letzter Schritt
                  </span>
                  <h2 className="text-xl font-bold text-[#112a24]">
                    Wohin dürfen wir die Auswertung schicken?
                  </h2>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Ihr Vor- & Nachname *"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2a524a] text-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder="E-Mail-Adresse *"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2a524a] text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Telefonnummer (optional für Rückfragen)"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2a524a] text-sm"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={formData.gdpr}
                    onChange={(e) =>
                      setFormData({ ...formData, gdpr: e.target.checked })
                    }
                    className="mt-1 rounded border-slate-300 text-[#2a524a] focus:ring-[#2a524a]"
                  />
                  <span className="text-xs text-slate-500 leading-snug">
                    Ich stimme der Verarbeitung meiner Daten zur Kontaktaufnahme
                    für das Pilotprojekt in Wien zu.
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                  >
                    Zurück
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3.5 rounded-2xl bg-[#2a524a] text-white font-medium hover:bg-[#112a24] shadow-md transition-all"
                  >
                    Kostenlos anfragen
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}