import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  const mockNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('displays error message with invalid credentials', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.submit(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect.')).toBeInTheDocument();
    });
  });

  test('does not navigate if login fails', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.submit(screen.getByRole('button', { name: /log in/i }));

    // Wait to ensure navigation doesn't happen
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith('/movies');
    });

    // Check for error message
    expect(screen.getByText('Email ou mot de passe incorrect.')).toBeInTheDocument();
  });
});
