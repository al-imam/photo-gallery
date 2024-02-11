'use client'

import { ProfileForm } from './form'

export default function ProfilePage() {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] gap-y-8 gap-x-4">
      <ProfileForm />
    </div>
  )
}
