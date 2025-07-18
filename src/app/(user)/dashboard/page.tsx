import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()
  
  if (!session?.user) {
    // Not logged in
    return <div>Please log in</div>
  }
  
  // Access your custom properties
  return <div>Hello {session.user.name}, you are a {session.user.type}</div>
}