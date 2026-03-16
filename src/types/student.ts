export interface Student {
  id: string;
  name: string;
  phone: string;
  date: string;
  sleep: string;
  condition: 'good' | 'normal' | 'bad' | 'very_bad';
  meal: 'good' | 'normal' | 'none';
  bowel: 'normal' | 'none';
  note: string;
  medication: string;
  avatar?: string;
}

export interface DailyStats {
  date: string;
  totalStudents: number;
  needAttention: number;
  events: number;
}
