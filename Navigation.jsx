import React from 'react';
import { AuthProvider } from './context/authContext';
import ScreenMenu from './menus/ScreenMenu';

// Wraps app navigation with AuthProvider for global auth state
const Navigation = () => {
  return (
    <AuthProvider>
      <ScreenMenu /> {/* Handles screen routing/navigation */}
    </AuthProvider>
  );
};

export default Navigation;
