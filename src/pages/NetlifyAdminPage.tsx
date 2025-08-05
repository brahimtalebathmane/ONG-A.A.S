import React from 'react'
import { useParams } from 'react-router-dom'
import { NetlifyPasswordSetup } from '../components/NetlifyPasswordSetup'

export function NetlifyAdminPage() {
  // Get inviteToken from URL params
  const { inviteToken } = useParams<{ inviteToken?: string }>()

  // Pass inviteToken to password setup component
  return <NetlifyPasswordSetup inviteToken={inviteToken} />
}