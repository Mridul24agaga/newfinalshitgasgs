import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utitls/supabase/server'; // Fixed typo: utitls -> utils

export async function GET(req: NextRequest) {
  const supabase = await createClient(); // Add await to resolve the promise
  const apiKey = req.headers.get('x-api-key'); // Retrieve API key from headers
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API Key is required' }, { status: 400 });
  }

  // Fetch the user ID associated with the API key from the 'api_keys' table
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('api_key', apiKey)
    .single();

  if (apiKeyError || !apiKeyData) {
    return NextResponse.json({ error: 'Invalid API Key' }, { status: 403 });
  }

  const user_id = apiKeyData.user_id;

  // Fetch the blogs related to this user
  const { data: blogs, error: blogsError } = await supabase
    .from('blogs')
    .select('id, user_id, blog_post')
    .eq('user_id', user_id);

  if (blogsError) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }

  // Return the fetched blogs
  return NextResponse.json({ blogs });
}