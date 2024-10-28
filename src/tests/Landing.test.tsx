import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // pour utiliser des matchers comme toBeInTheDocument
import Landing from '../pages/Landing';

describe('Landing Component', () => {
  test('renders the main content with welcome text', () => {
    render(<Landing />);
    
    // Vérifie si le texte de bienvenue est présent
    expect(screen.getByText('Welcome on CineApp !')).toBeInTheDocument();
  });

  test('renders background video with correct attributes', () => {
    const { container } = render(<Landing />);
    
    // Sélectionne la balise video
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const video = container.querySelector('.background-video');
    
    // Vérifie si la balise vidéo est présente et ses attributs
    expect(video).toBeInTheDocument();

    // Vérifie la source vidéo
    // eslint-disable-next-line testing-library/no-node-access
    const source = video?.firstElementChild;
    expect(source).toHaveAttribute('src', '/popcorn.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  test('renders Log in and Sign up buttons with correct links', () => {
    render(<Landing />);
    
    // Vérifie si le bouton "Log in" est présent avec le bon lien
    const loginButton = screen.getByText('Log in');
    expect(loginButton).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(loginButton.closest('a')).toHaveAttribute('href', '/login');
    
    // Vérifie si le bouton "Sign up" est présent avec le bon lien
    const signupButton = screen.getByText('Sign up');
    expect(signupButton).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(signupButton.closest('a')).toHaveAttribute('href', '/register');
  });
});
