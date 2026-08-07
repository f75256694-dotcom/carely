'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

type FlowType = 'care_seeker' | 'family' | 'care_giver';

interface Step {
  id: string;
  title: string;
  path: string;
}

const FLOWS: Record<FlowType, { name: string; steps: Step[] }> = {
  care_seeker: {
    name: 'Hilfesuchende',
    steps: [
      { id: '1', title: 'Landingpage', path: '/' },
      { id: '2', title: 'Registrierung', path: '/register' },
      { id: '3', title: 'KYC Identität', path: '/kyc' },
      { id: '4', title: 'Suche & Angebot', path: '/care-seeker' },
      { id: '5', title: 'Chats', path: '/chats' },
    ],
  },
  family: {
    name: 'Angehörige',
    steps: [
      { id: '1', title: 'Landingpage', path: '/' },
      { id: '2', title: 'Registrierung', path: '/register' },
      { id: '3', title: 'Familien Dashboard', path: '/family' },
      { id: '4', title: 'Chats & Anfragen', path: '/chats' },
    ],
  },
  care_giver: {
    name: 'Helfer',
    steps: [
      { id: '1', title: 'Landingpage', path: '/' },
      { id: '2', title: 'Registrierung', path: '/register' },
      { id: '3', title: 'KYC Verifikation', path: '/kyc' },
      { id: '4', title: 'Helfer Dashboard', path: '/caregiver' },
      { id: '5', title: 'Chats & Anfragen', path: '/chats' },
    ],
  },
};

export default function DevAdminBar() {
  const [activeFlow, setActiveFlow] = useState<FlowType>('care_seeker');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedFlow = localStorage.getItem('carely_dev_flow') as FlowType;
    const savedStep = localStorage.getItem('carely_dev_step');
    if (savedFlow && FLOWS[savedFlow]) setActiveFlow(savedFlow);
    if (savedStep) setCurrentStepIndex(parseInt(savedStep, 10) || 0);
  }, []);

  useEffect(() => {
    const currentSteps = FLOWS[activeFlow].steps;
    const matchingIndex = currentSteps.findIndex((s) => s.path === pathname);
    if (matchingIndex !== -1 && matchingIndex !== currentStepIndex) {
      setCurrentStepIndex(matchingIndex);
    }
  }, [pathname, activeFlow]);

  const handleFlowSwitch = (flow: FlowType) => {
    setActiveFlow(flow);
    setCurrentStepIndex(0);
    localStorage.setItem('carely_dev_flow', flow);
    localStorage.setItem('carely_dev_step', '0');
    router.push(FLOWS[flow].steps[0].path);
  };

  const handleNext = () => {
    const steps = FLOWS[activeFlow].steps;
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      localStorage.setItem('carely_dev_step', nextIdx.toString());
      router.push(steps[nextIdx].path);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      localStorage.setItem('carely_dev_step', prevIdx.toString());
      router.push(FLOWS[activeFlow].steps[prevIdx].path);
    }
  };

  const currentSteps = FLOWS[activeFlow].steps;
  const currentStep = currentSteps[currentStepIndex] || currentSteps[0];

  return (
    <aside aria-label="Dev Flow Navigator" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] font-sans">
      <div className="bg-gray-950/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 pl-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-3 text-white">
        <div className="flex items-center gap-2 border-r border-white/10 pr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-4 h-4 text-gray-950 fill-current" />
          </div>
          <select
            value={activeFlow}
            onChange={(e) => handleFlowSwitch(e.target.value as FlowType)}
            className="bg-transparent text-xs font-black tracking-wide text-gray-200 outline-none cursor-pointer hover:text-teal-400 transition-colors"
          >
            <option value="care_seeker" className="bg-gray-900 text-white">Flow: Hilfesuchende</option>
            <option value="family" className="bg-gray-900 text-white">Flow: Angehörige</option>
            <option value="care_giver" className="bg-gray-900 text-white">Flow: Helfer</option>
          </select>
        </div>

        {!isMinimized && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center px-2 min-w-[180px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
                Schritt {currentStepIndex + 1} von {currentSteps.length}
              </span>
              <span className="text-xs font-bold text-gray-100 truncate max-w-[160px]">
                {currentStep?.title}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === currentSteps.length - 1}
              className="w-8 h-8 rounded-full bg-teal-500 text-gray-950 hover:bg-teal-400 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md shadow-teal-500/20 cursor-pointer font-bold"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </>
        )}

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors ml-1"
        >
          {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
}