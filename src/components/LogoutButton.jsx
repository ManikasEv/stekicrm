import { useClerk } from '@clerk/clerk-react'

export default function LogoutButton({ className = 'secondary-button' }) {
  const { signOut } = useClerk()

  return (
    <button className={className} type="button" onClick={() => signOut()}>
      Abmelden
    </button>
  )
}
