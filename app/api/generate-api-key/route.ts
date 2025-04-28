import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utitls/supabase/server'; // Fixed typo in utils
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  // Await the createClient call since it returns a promise
  const supabase = await createClient(); // Add await here

  // Read the Authorization header to get the token
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  // Get the user based on the token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    console.error('Authentication failed:', authError?.message);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  const user_id = user.id;

  const newApiKey = randomUUID(); // Generate a new API key

  // Insert the new API key into the 'api_keys' table
  const { data, error } = await supabase
    .from('api_keys')
    .insert([{ user_id: user_id, api_key: newApiKey }])
    .select()
    .single();

  if (error) {
    console.error('Error inserting API key:', error.message);
    return NextResponse.json({ error: 'Failed to generate API Key' }, { status: 500 });
  }

  return NextResponse.json({ api_key: newApiKey });
}