import { useCallback, useEffect, useState } from 'react';

export type ConsentChoice = 'accepted' | 'rejected' | 'dismissed';
export interface ConsentRecord {
  choice: ConsentChoice;
  timestamp: number;
  version: number; // bump when policy changes to re-prompt
}

const STORAGE_KEY = 'gardeshgary.cookie-consent.v1';
const CURRENT_VERSION = 1;

function readStored(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (!parsed || typeof parsed.choice !== 'string') return null;
    // If the policy version changed, treat as "needs re-prompt"
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * useCookieConsent — persistent GDPR-style cookie consent.
 *
 *  - `record` is null until the user makes a choice (so the banner shows)
 *  - accept/reject/dismiss are all persisted for CURRENT_VERSION
 *  - bumping CURRENT_VERSION re-prompts even if the user already chose
 *  - cross-tab sync via the `storage` event (one tab's choice hides the banner
 *    in all other open tabs)
 */
export function useCookieConsent() {
  const [record, setRecord] = useState<ConsentRecord | null>(readStored);

  const persist = useCallback((choice: ConsentChoice) => {
    const next: ConsentRecord = {
      choice,
      timestamp: Date.now(),
      version: CURRENT_VERSION,
    };
    setRecord(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, []);

  const accept = useCallback(() => persist('accepted'), [persist]);
  const reject = useCallback(() => persist('rejected'), [persist]);
  const dismiss = useCallback(() => persist('dismissed'), [persist]);

  // Cross-tab sync: another tab changed the consent → reflect here
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setRecord(e.newValue ? (JSON.parse(e.newValue) as ConsentRecord) : null);
      } catch {
        setRecord(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Has the user given explicit, in-version consent?
  const hasChosen = record !== null && record.version === CURRENT_VERSION;
  const isAccepted = record?.choice === 'accepted';

  return { record, hasChosen, isAccepted, accept, reject, dismiss };
}

export default useCookieConsent;
