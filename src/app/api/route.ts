// src/app/api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { extractInsuredNameFromText } from '@/lib/llm';

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'Missing text' }, { status: 400 });
  }

  const name = await extractInsuredNameFromText(text);
  return NextResponse.json({ name });
}

// had to move this to an api route because the LLM function is not a server component and cannot be used in a client component
// this is a server component and can be used in a client component
