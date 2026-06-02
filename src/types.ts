export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export type AppMode = 'idle' | 'scanning' | 'reading' | 'explaining';

export type VoiceGender = 'male' | 'female';

export interface VoiceCommand {
  keywords: string[];
  action: () => void;
}

export interface ReadingState {
  text: string;
  isReading: boolean;
  progress: number;
}
