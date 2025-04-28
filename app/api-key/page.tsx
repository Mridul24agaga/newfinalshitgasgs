'use client';

import { useState } from 'react';
import { createClient } from '@/utitls/supabase/client'; // your supabase client setup

export default function GenerateApiKeyPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setApiKey(null);
    setError(null);

    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      setError('You must be logged in to generate API key.');
      return;
    }

    try {
      const response = await fetch('/api/generate-api-key', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`, // 🧠 pass token properly
        }
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Something went wrong');
      } else {
        setApiKey(result.api_key);
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <button 
        onClick={handleGenerate} 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Generate API Key
      </button>

      {apiKey && (
        <div className="mt-4 text-green-600 text-center">
          <strong>Generated API Key:</strong> {apiKey}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
