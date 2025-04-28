// /app/generate-api/page.tsx

'use client';

import { useState } from 'react';
import { createClient } from '@/utitls/supabase/client'; // Make sure the import is correct

export default function GenerateApiKeyButton() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const generateApiKey = async () => {
    const { data, error } = await createClient().auth.getSession(); // Corrected method

    if (error || !data?.session) {
      console.error('User not logged in');
      alert('You are not logged in.');
      return;
    }

    const userId = data.session.user.id; // Get the logged-in user's ID

    const response = await fetch('http://localhost:3000/api/generate-api-key', {
      method: 'POST',
      headers: {
        'x-user-id': userId,
      },
    });

    if (!response.ok) {
      // If the response is not OK, log the response status and body for debugging
      const errorMessage = await response.text();
      console.error('Failed to generate API key:', response.status, errorMessage);
      alert('Failed to generate API key');
      return;
    }

    const json = await response.json();

    if (json.apiKey) {
      setApiKey(json.apiKey);
      localStorage.setItem('apiKey', json.apiKey); // Store the API key in localStorage for future requests
    } else {
      console.error('Unexpected response format:', json);
      alert('Failed to generate API key');
    }
  };

  return (
    <div>
      <button onClick={generateApiKey}>Generate API Key</button>
      {apiKey && <p>Your API Key: {apiKey}</p>}
    </div>
  );
}
