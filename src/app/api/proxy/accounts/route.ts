import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { charonClient } from '@/lib/charon-client';

export async function GET() {
  const session = await auth();
  const token = session?.accessToken;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // This assumes charonClient is set up to handle auth via the passed token
    // and can fetch accounts associated with the user identity in the token.
    const response = await charonClient.accounts.getAll({
      // any specific query params for the backend can go here
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching accounts from Charon:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
