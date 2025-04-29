// app/api/generate-api-key/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utitls/supabase/server';
import { randomUUID } from 'crypto';

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const authHeader = req.headers.get('authorization');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!authHeader) {
    console.error('Authorization header missing');
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401, headers }
    );
  }

  const token = authHeader.replace('Bearer ', '').trim();
  console.log('Validating token:', token);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    console.error('Authentication failed:', authError?.message || 'No user found');
    return NextResponse.json(
      { error: 'Authentication failed', details: authError?.message || 'Invalid token' },
      { status: 401, headers }
    );
  }

  const user_id = user.id;
  console.log('Authenticated user_id:', user_id);

  const newApiKey = randomUUID();
  console.log('Generated new API key:', newApiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .insert([{ user_id: user_id, api_key: newApiKey }])
    .select()
    .single();

  if (error) {
    console.error('Error inserting API key:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate API Key', details: error.message },
      { status: 500, headers }
    );
  }

  console.log('API key inserted successfully for user_id:', user_id);
  return NextResponse.json({ api_key: newApiKey }, { status: 200, headers });
}