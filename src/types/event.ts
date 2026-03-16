export interface EventThumbnail {
  id: string;
  time: string;
  imageUrl: string;
  label: string;
}

export interface BehaviorEvent {
  id: string;
  type: 'self_harm' | 'harm_others' | 'obsession';
  thumbnails: EventThumbnail[];
}

export interface EventCardData {
  id: string;
  subjectName: string;
  subjectPhone: string;
  avatar?: string;
  behaviors: BehaviorEvent[];
}

export interface UnconfirmedEvent {
  id: string;
  thumbnail: EventThumbnail;
}
