export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  previewColor: string;
  icon?: string;
}

export interface GeneratedImage {
  original: string; // Base64
  generated: string; // Base64
  promptUsed: string;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  CONFIGURE = 'CONFIGURE',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
