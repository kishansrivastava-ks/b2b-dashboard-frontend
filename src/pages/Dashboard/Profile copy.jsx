import { useAuth } from '@/context/AuthContext'
import React from 'react'
import styled from 'styled-components'
import toast from 'react-hot-toast'

const ProfileContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  /* max-width: 1200px; */
  margin: 0 auto;
`

const InfoRow = styled.div`
  margin-bottom: 12px;
`

const Label = styled.span`
  font-weight: 600;
  color: #475569;
`

const Value = styled.span`
  margin-left: 8px;
  color: #1e293b;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`

const ActionButton = styled.button`
  padding: 10px 16px;
  background-color: #3b82f6;
  border: none;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`

const formatDate = (iso) => new Date(iso).toLocaleDateString()

const Profile = () => {
  const { user } = useAuth()

  if (!user) {
    toast.error('No user found')
    return null
  }

  return (
    <ProfileContainer>
      <h2>Hello, {user.name}</h2>

      <InfoRow>
        <Label>Email:</Label>
        <Value>{user.email}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Contact:</Label>
        <Value>{user.contact}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Customer Type:</Label>
        <Value>{user.customerType}</Value>
      </InfoRow>

      <InfoRow>
        <Label>GST Number:</Label>
        <Value>{user.gstNumber || 'Not Provided'}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Representative Name:</Label>
        <Value>{user.representativeName || 'Not Provided'}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Representative Contact:</Label>
        <Value>{user.representativeContact || 'Not Provided'}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Created At:</Label>
        <Value>{formatDate(user.createdAt)}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Last Updated:</Label>
        <Value>{formatDate(user.updatedAt)}</Value>
      </InfoRow>

      <ButtonGroup>
        <ActionButton onClick={() => toast('Change Password clicked')}>
          Change Password
        </ActionButton>
        <ActionButton onClick={() => toast('Update Profile clicked')}>Update Profile</ActionButton>
      </ButtonGroup>
    </ProfileContainer>
  )
}

export default Profile
