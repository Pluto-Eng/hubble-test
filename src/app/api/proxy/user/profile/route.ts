import { auth } from '@/auth';
import { charonClient } from '@/lib/charon-client/charon-client';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req) {
  if (req.auth) {
    const profileResponse = await charonClient.user.getProfile();

    if (profileResponse.error || !profileResponse.result?.data) {
      // No user found, so this is their first attempt to login
      // Optionally, this is also the place you could do a user registration
      log.warn('/proxy/user/profile', 'Unable to fetch user profile after login', profileResponse.error);
      return null; // or throw new Error("Invalid credentials.")
      return NextResponse.json({ error: profileResponse.error?.feedback }, { status: 500 });
    }

    const profile = profileResponse.result.data;

    const userProfile = {
      id: profile.id,
      email: profile.email,
      name: `${profile.nameGiven || ''} ${profile.nameFamily || ''}`.trim() || null,
      nameGiven: profile.nameGiven,
      nameFamily: profile.nameFamily,
      type: profile.type, // individual, manager, admin
      // Potentially: Fetch and add organizationId if user.type is 'manager'
      // e.g., if user.type === 'manager', fetch user's organization and add token.organizationId = userOrg.id;
      // Also, if Account is tightly linked to User, store accountId
      // e.g., if user.type === 'individual', fetch user's primary account and add token.accountId = userAccount.id;
    };

    return NextResponse.json(userProfile);
  }

  return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
});
