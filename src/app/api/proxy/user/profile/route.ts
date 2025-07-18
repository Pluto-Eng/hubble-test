import { auth } from "@/auth"
import { charonClient } from "@/lib/charon-client/charon-client"
import { NextResponse } from "next/server"

export const GET = auth(async function GET(req) {
    if (req.auth) {
        const userProfileResponse = await charonClient.getUser(req.auth.user.accessToken) //either id or get with access token
        
        if (!userProfileResponse.success || !userProfileResponse.user) {
            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            log.warn("Unable to fetch user profile after login")
            return null // or throw new Error("Invalid credentials.")
          }

          const { user } = userProfileResponse

          const userProfile = {
            id: user.id,
            email: user.email || user.username, // Fallback to username if email not present
            name: user.name || `${user.nameGiven || ''} ${user.nameFamily || ''}`.trim() || null,
            nameGiven: user.nameGiven,
            nameFamily: user.nameFamily,
            type: user.type || user.role || user["custom:role"] || "individual", // individual, manager, admin
            // Potentially: Fetch and add organizationId if user.type is 'manager'
            // e.g., if user.type === 'manager', fetch user's organization and add token.organizationId = userOrg.id;
            // Also, if Account is tightly linked to User, store accountId
            // e.g., if user.type === 'individual', fetch user's primary account and add token.accountId = userAccount.id;
          }

          return NextResponse.json(userProfile)
    }

    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})