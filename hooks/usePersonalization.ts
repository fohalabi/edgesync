'use client';

import { useState, useEffect } from 'react';
import { PersonalizationResult } from '@/lib/types';

export function usePersonalization() {
  const [data, setData] = useState<PersonalizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);

  useEffect(() => {
    async function fetchPersonalization() {
      try {
        // match the API route folder spelling ('personalise')
        const params = new URLSearchParams(window.location.search);
        const simulationParams = new URLSearchParams();
        for (const key of ['country', 'device', 'visitor']) {
          const value = params.get(key);
          if (value) simulationParams.set(key, value);
        }
        setSimulationActive(simulationParams.size > 0);
        const query = simulationParams.toString();
        const response = await fetch(`/api/personalise${query ? `?${query}` : ''}`);

        if (!response.ok) {
          const text = await response.text().catch(() => '<non-serializable response>');
          console.error('Personalization API returned non-OK', response.status, text);
          setError(`Personalization API error: ${response.status}`);
          return;
        }

        const result = await response.json();

        if (result && result.success) {
          setData(result.data);
        } else {
          setError(result?.error || 'Personalization API returned an error');
        }
      } catch (err) {
        setError('Failed to load personalization');
        console.error('Personalization fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPersonalization();
  }, []);

  return { data, loading, error, simulationActive };
}
