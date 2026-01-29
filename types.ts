
export enum WineDryness {
  DRY = 'Wytrawne',
  SEMI_DRY = 'Półwytrawne',
  SEMI_SWEET = 'Półsłodkie',
  SWEET = 'Słodkie',
  UNKNOWN = 'Nieznane'
}

export interface WineInfo {
  id?: string;
  name: string;
  region: string;
  dryness: WineDryness;
  description: string;
  pairings: string[];
  grapeType: string;
  alcoholContent: string;
  servingTemp?: string;
  classification?: string; // np. DOCG, DOC, IGT
  timestamp?: number;
}

export interface ScanResult {
  wine: WineInfo | null;
  error?: string;
  rawAnalysis?: string;
}
