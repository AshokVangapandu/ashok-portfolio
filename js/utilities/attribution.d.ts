export interface AttributionResult {
  source: string | null;
  sourceDisplay: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
  referrer: string;
  hasUTM: boolean;
  hasReferrer: boolean;
  attributionType: 'utm' | 'referrer' | 'direct';
}

export function resolveTrafficSource(referrerString?: string, searchString?: string): AttributionResult;
