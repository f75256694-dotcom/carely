import { CareRecipient, Transaction, CareRequest, WeekAppointment } from '@/types/care';

export const INITIAL_RECIPIENTS: CareRecipient[] = [
  {
    id: 'mom',
    name: 'Maria Mustermann',
    relation: 'Mama',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    careLevel: 'Pflegegrad 2',
    budgetMax: 125.00,
    budgetUsed: 45.00,
    moodScore: 88,
    activityScore: 72,
    address: 'Hauptstraße 12, 10115 Berlin',
    phone: '+49 30 1234567',
    medicalNotes: 'Leichte Mobilitätseinschränkung, benötigt Unterstützung beim Einkaufen.'
  },
  {
    id: 'dad',
    name: 'Heinrich Mustermann',
    relation: 'Papa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    careLevel: 'Pflegegrad 3',
    budgetMax: 125.00,
    budgetUsed: 90.00,
    moodScore: 65,
    activityScore: 50,
    address: 'Hauptstraße 12, 10115 Berlin',
    phone: '+49 30 7654321',
    medicalNotes: 'Regelmäßige Arztbesuche erforderlich, Demenz im Frühstadium.'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101', recipientId: 'mom', recipientName: 'Maria Mustermann',
    recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    helperName: 'Sarah M.', service: 'Alltagsbegleitung & Spaziergang (2 Std.)',
    date: '04.08.2026, 14:30 Uhr', amount: 30.00, status: 'Erstattet'
  },
  {
    id: 'tx-102', recipientId: 'mom', recipientName: 'Maria Mustermann',
    recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    helperName: 'Lukas K.', service: 'Einkaufsservice & Haushaltshilfe',
    date: '01.08.2026, 11:00 Uhr', amount: 15.00, status: 'Erstattet'
  },
  {
    id: 'tx-103', recipientId: 'dad', recipientName: 'Heinrich Mustermann',
    recipientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    helperName: 'Jan W.', service: 'Begleitung zum Facharzt',
    date: '03.08.2026, 16:00 Uhr', amount: 50.00, status: 'In Prüfung'
  }
];

export const INITIAL_REQUESTS: CareRequest[] = [
  {
    id: 'req-1',
    title: 'Wöchentlicher Einkauf & Botengänge',
    helperName: 'Sarah Müller',
    helperAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    date: '10.08.2026',
    time: '10:00 - 12:00 Uhr',
    status: 'Offen',
    recipientName: 'Maria Mustermann'
  },
  {
    id: 'req-2',
    title: 'Arztbegleitung Kardiologie',
    helperName: 'Michael Weber',
    helperAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    date: '12.08.2026',
    time: '14:00 - 16:30 Uhr',
    status: 'Offen',
    recipientName: 'Heinrich Mustermann'
  }
];

export const INITIAL_WEEK_APPOINTMENTS: WeekAppointment[] = [
  {
    id: 'app-1',
    day: 'Montag, 10.08.',
    time: '10:00 Uhr',
    title: 'Spaziergang & frische Luft',
    helperName: 'Sarah Müller',
    recipientName: 'Maria Mustermann',
    status: 'Bestätigt'
  },
  {
    id: 'app-2',
    day: 'Mittwoch, 12.08.',
    time: '14:00 Uhr',
    title: 'Arztbegleitung Kardiologie',
    helperName: 'Michael Weber',
    recipientName: 'Heinrich Mustermann',
    status: 'Bestätigt'
  }
];

export const MOOD_HISTORY = [
  { day: 'Mo', score: 60, label: 'Zufrieden' },
  { day: 'Di', score: 75, label: 'Sehr gut' },
  { day: 'Mi', score: 70, label: 'Gut' },
  { day: 'Do', score: 85, label: 'Ausgezeichnet' },
  { day: 'Fr', score: 90, label: 'Sehr glücklich' },
  { day: 'Sa', score: 82, label: 'Entspannt' },
  { day: 'So', score: 88, label: 'Sehr gut' }
];