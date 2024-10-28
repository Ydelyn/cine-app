import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MovieModal from '../pages/MovieModal';

describe('MovieModal component', () => {
  const movie = {
    id: 1,
    title: 'Inception',
    overview: 'A mind-bending thriller.',
    poster_path: '/path/to/poster.jpg',
    vote_average: 8.8,
    vote_count: 12000,
    release_date: '2010-07-16',
    trailerKey: 'YoHD9XEInc0', // YouTube trailer key
  };

  const setup = (isOpen = true) => {
    const onClose = jest.fn();
    render(<MovieModal isOpen={isOpen} onClose={onClose} content={movie} />);
    return { onClose };
  };

  it('renders the modal when isOpen is true', () => {
    setup();

    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/A mind-bending thriller./i)).toBeInTheDocument();
    expect(screen.getByText(/8.8 \/ 10/i)).toBeInTheDocument();
    expect(screen.getByText(/12000 votes/i)).toBeInTheDocument();
    expect(screen.getByText(/2010-07-16/i)).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    setup(false);

    expect(screen.queryByText(/Inception/i)).not.toBeInTheDocument();
  });

  it('toggles the favorite status when the favorite button is clicked', () => {
    // Reset le localStorage avant chaque test
    localStorage.setItem('favoriteMovies', JSON.stringify([]));
    setup();

    const favoriteButton = screen.getByRole('button');

    // Ajouter aux favoris
    fireEvent.click(favoriteButton);
    expect(localStorage.getItem('favoriteMovies')).toContain(movie.title);

    // Supprimer des favoris
    fireEvent.click(favoriteButton);
    expect(localStorage.getItem('favoriteMovies')).not.toContain(movie.title);
  });

  it('displays the YouTube trailer if the trailerKey is provided', () => {
    setup();

    const trailer = screen.getByTitle(/Bande-annonce/i);
    expect(trailer).toBeInTheDocument();
    expect(trailer).toHaveAttribute('src', expect.stringContaining('YoHD9XEInc0'));
  });
});
