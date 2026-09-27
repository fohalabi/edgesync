'use client';

import { useEffect, useState } from 'react';
import type { PersonalizationResult } from '@/lib/types';
import { readAnalyticsConsent } from '@/app/components/ConsentBanner';

const simulationKeys = ['country', 'device', 'visitor', 'language', 'hour', 'referrer', 'network'];

function detectedReferrer() {
  const value = document.referrer.toLowerCase();
  if (!value) return 'direct';
  if (/google|bing|duckduckgo|yahoo/.test(value)) return 'search';
  if (/facebook|instagram|linkedin|twitter|x\.com|tiktok/.test(value)) return 'social';
  return 'campaign';
}

function detectedNetwork() {
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  if (!connection?.effectiveType) return 'standard';
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return 'slow';
  if (connection.effectiveType === '4g') return 'fast';
  return 'standard';
}

export function usePersonalization() {
  const [data, setData] = useState<PersonalizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPersonalization(initial = false) {
      if (!initial) setUpdating(true);
      setError(null);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestParams = new URLSearchParams();
        for (const key of simulationKeys) {
          const value = urlParams.get(key);
          if (value) requestParams.set(key, value);
        }
        setSimulationActive(simulationKeys.some((key) => urlParams.has(key)));
        if (!requestParams.has('language')) requestParams.set('language', navigator.language.split('-')[0].toLowerCase());
        if (!requestParams.has('hour')) requestParams.set('hour', String(new Date().getHours()));
        if (!requestParams.has('referrer')) requestParams.set('referrer', detectedReferrer());
        if (!requestParams.has('network')) requestParams.set('network', detectedNetwork());
        requestParams.set('analytics', readAnalyticsConsent() === 'granted' ? 'granted' : 'denied');

        const response = await fetch(`/api/personalise?${requestParams.toString()}`);
        if (!response.ok) throw new Error(`Personalization API error: ${response.status}`);
        const result = await response.json();
        if (!result?.success) throw new Error(result?.error || 'Personalization API returned an error');
        if (!cancelled) setData(result.data);
      } catch (caught) {
        console.error('Personalization fetch error:', caught);
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Failed to load personalization');
      } finally {
        if (!cancelled) { setLoading(false); setUpdating(false); }
      }
    }

    const refresh = () => void fetchPersonalization(false);
    void fetchPersonalization(true);
    window.addEventListener('popstate', refresh);
    window.addEventListener('edgesync:simulation', refresh);
    window.addEventListener('edgesync:consent', refresh);
    return () => { cancelled = true; window.removeEventListener('popstate', refresh); window.removeEventListener('edgesync:simulation', refresh); window.removeEventListener('edgesync:consent', refresh); };
  }, []);

  return { data, loading, updating, error, simulationActive };
}
