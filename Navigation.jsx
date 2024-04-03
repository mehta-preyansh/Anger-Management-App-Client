import React from 'react'
import { AuthProvider } from './context/authContext'
import ScreenMenu from './menus/ScreenMenu'

const Navigation = () => {
  return (
    <AuthProvider>
      <ScreenMenu/>
    </AuthProvider>
  )
}

export default Navigation