import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Movies.css';
import MovieModal from './MovieModal';

const API_KEY = '7c6ba241ae896589000f37feed1efef7';
const MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-EN&page=1`;

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genres: Genre[]; // Ajout des genres
  trailerKey?: string; // Pour stocker la clé de la bande-annonce
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Movie>({
    id: 0,
    title: '',
    poster_path: '',
    overview: '',
    vote_average: 0,
    vote_count: 0,
    release_date: '',
    genres: [],
  });

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleDivClick = async (movie: Movie) => {
    try {
      // Récupérer les détails du film pour obtenir les genres et la bande-annonce
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`);
      const movieDetails = response.data;

      const trailerResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
      const trailers = trailerResponse.data.results;

      const trailerKey = trailers.find((trailer: any) => trailer.type === "Trailer")?.key; // Obtenir la première bande-annonce

      setModalContent({
        ...movieDetails,
        trailerKey, // Ajouter la clé de la bande-annonce au contenu de la modale
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du film :", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Fermer la modale
  };

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn) {
      const user = JSON.parse(userLoggedIn);
      setIsLoggedIn(true);
      setUsername(user.username);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(MOVIES_URL)
        .then((response) => {
          setMovies(response.data.results);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des films :", error);
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Filtrer les films en fonction du terme de recherche
    setFilteredMovies(
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, movies]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/login');
  };

  return (
    <div className="movies-container">
      <header className="header">
        <div className="sub-header">
          <div className="welcome-div">
            {isLoggedIn && <h1 className="welcome-message">Hello, {username} !</h1>}
          </div>
          <nav>
            <button className="btn-header" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button className="btn-header" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      <h2 className='movies-title'>Popular movies</h2>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="movies-grid">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => handleDivClick(movie)}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h2 className="movie-title">{movie.title}</h2>
            <div className='movie-votes'>
              <p className="movie-vote">{movie.vote_average.toFixed(1)} / 10</p>
              <p className="movie-count">{movie.vote_count} votes</p>
            </div>
            <p className="movie-release-date">Release date: {movie.release_date}</p>
          </div>
        ))}
      </div>
      <MovieModal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
    </div>
  );
};

export default Movies;
