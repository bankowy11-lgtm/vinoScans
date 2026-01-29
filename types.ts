
export enum WineDryness {
  DRY = 'Wytrawne',
  SEMI_DRY = 'Półwytrawne',
  SEMI_SWEET = 'Półsłodkie',
  SWEET = 'Słodkie',
  UNKNOWN = 'Nieznane'
}

export interface WineInfo {
  name: string;
  region: string;
  dryness: WineDryness;
  description: string;
  pairings: string[];
  grapeType: string;
  alcoholContent: string;
}

export interface ScanResult {
  wine: WineInfo | null;
  error?: string;
  rawAnalysis?: string;
}
