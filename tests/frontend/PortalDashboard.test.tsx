import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PortalDashboard from '../../src/components/portal/PortalDashboard';
import '@testing-library/jest-dom';

describe('PortalDashboard Component', () => {
  const mockUser = {
    uid: '123',
    email: 'admin@nexoratech.com',
    role: 'admin',
    fullName: 'Admin User'
  };
  
  const mockLogout = jest.fn();
  const mockTerminal = jest.fn();

  it('renders correct user role in sidebar', () => {
    render(
      <PortalDashboard 
        isDarkMode={true} 
        user={mockUser} 
        token="mock_token" 
        onLogout={mockLogout} 
        onTerminalRequest={mockTerminal} 
      />
    );
    
    // Using string matching due to potential case transformations
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('calls onLogout when Sign Out is clicked', () => {
    render(
      <PortalDashboard 
        isDarkMode={true} 
        user={mockUser} 
        token="mock_token" 
        onLogout={mockLogout} 
        onTerminalRequest={mockTerminal} 
      />
    );
    
    const signOutButtons = screen.getAllByText(/Sign Out/i);
    fireEvent.click(signOutButtons[0]);
    expect(mockLogout).toHaveBeenCalled();
  });
});
