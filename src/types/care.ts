export interface CareRecipient {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  careLevel: string;
  budgetMax: number;
  budgetUsed: number;
  moodScore: number; 
  activityScore: number; 
  address?: string;
  phone?: string;
  medicalNotes?: string;
}

export interface Transaction {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  helperName: string;
  service: string;
  date: string;
  amount: number;
  status: 'Erstattet' | 'In Prüfung';
}

export interface CareRequest {
  id: string;
  title: string;
  helperName: string;
  helperAvatar: string;
  date: string;
  time: string;
  status: 'Offen' | 'Angenommen' | 'Abgelehnt';
  recipientName: string;
}

export interface WeekAppointment {
  id: string;
  day: string;
  time: string;
  title: string;
  helperName: string;
  recipientName: string;
  status: 'Bestätigt' | 'Ausstehend';
}