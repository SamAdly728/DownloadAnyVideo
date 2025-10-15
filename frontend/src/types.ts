export enum VideoPlatform {
  YouTube = 'YouTube',
  TikTok = 'TikTok',
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  Vimeo = 'Vimeo',
  X = 'X',
  Unknown = 'Unknown',
}

export interface VideoData {
  platform: VideoPlatform | string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isValid: boolean;
  downloadUrl?: string; // Optional direct download link from backend
}
