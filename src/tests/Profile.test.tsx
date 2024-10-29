import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Profile from '../pages/Profile';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Profile Component', () => {
  const mockNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('displays username and email from localStorage when user is logged in', () => {
    localStorage.setItem(
      'userLoggedIn',
      JSON.stringify({ username: 'JohnDoe', email: 'john@example.com', password: 'password123' })
    );

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('Hello, JohnDoe !')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JohnDoe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  test('updates user info when the form is submitted', () => {
    localStorage.setItem(
      'userLoggedIn',
      JSON.stringify({ username: 'JohnDoe', email: 'john@example.com', password: 'password123' })
    );

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'JaneDoe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });

    fireEvent.submit(screen.getByRole('button', { name: /save changes/i }));

    const updatedUser = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');
    expect(updatedUser.username).toBe('JaneDoe');
    expect(updatedUser.email).toBe('jane@example.com');
    expect(updatedUser.password).toBe('newpassword123');
  });

  test('displays favorite movies from localStorage', () => {
    localStorage.setItem(
      'favoriteMovies',
      JSON.stringify([{ id: 1, title: 'Inception' }, { id: 2, title: 'The Matrix' }])
    );
    localStorage.setItem(
      'userLoggedIn',
      JSON.stringify({ username: 'JohnDoe', email: 'john@example.com', password: 'password123' })
    );

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('The Matrix')).toBeInTheDocument();
  });

  test('removes a favorite movie when the remove button is clicked', () => {
    localStorage.setItem(
      'favoriteMovies',
      JSON.stringify([{ id: 1, title: 'Inception' }, { id: 2, title: 'The Matrix' }])
    );
    localStorage.setItem(
      'userLoggedIn',
      JSON.stringify({ username: 'JohnDoe', email: 'john@example.com', password: 'password123' })
    );

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByText(/remove/i);
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText('Inception')).not.toBeInTheDocument();
    const updatedFavorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    expect(updatedFavorites).toEqual([{ id: 2, title: 'The Matrix' }]);
  });
});
