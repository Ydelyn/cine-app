import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Movies.css';
import MovieModal from './MovieModal';

const API_KEY = '7c6ba241ae896589000f37feed1efef7';
const MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-EN&page=1`;
const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-EN`;
const LANGUAGES_URL = `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
  original_language?: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Language {
  iso_639_1: string;
  english_name: string;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Movie | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleDivClick = async (movie: Movie) => {
    const movieDetails = await fetchMovieDetails(movie.id);
    if (movieDetails) {
      setModalContent(movieDetails);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Récupération des genres et des langues
  useEffect(() => {
    const fetchGenresAndLanguages = async () => {
      try {
        const [genresResponse, languagesResponse] = await Promise.all([
          axios.get(GENRES_URL),
          axios.get(LANGUAGES_URL),
        ]);

        setGenres(genresResponse.data.genres);
        setLanguages(languagesResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des genres ou des langues :", error);
      }
    };

    fetchGenresAndLanguages();
  }, []);

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

  // Fonction pour récupérer les films avec tous les filtres
  const fetchMovies = async () => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-EN&sort_by=popularity.desc`;

    // Ajouter les filtres à l'URL
    if (selectedGenre) {
      url += `&with_genres=${selectedGenre}`;
    }

    // Ajouter l'année si elle est sélectionnée
    if (selectedYear) {
      const yearAsNumber = Number(selectedYear);
      if (!isNaN(yearAsNumber)) {
        url += `&primary_release_year=${yearAsNumber}`;
      }
    }

    // Ajouter la langue si elle est sélectionnée
    if (selectedLanguage) {
      url += `&with_original_language=${selectedLanguage}`;
    }

    try {
      const response = await axios.get(url);
      setMovies(response.data.results);
      setFilteredMovies(response.data.results);
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMovies(); // Appel initial sans filtres
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMovies(); // Mettre à jour les films à chaque changement de filtre
    }
  }, [selectedYear, selectedGenre, selectedLanguage, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/login');
  };

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos`);
      const movieData = response.data;

      const trailerKey = movieData.videos.results.length > 0 ? movieData.videos.results[0].key : undefined;

      return {
        id: movieData.id,
        title: movieData.title,
        overview: movieData.overview,
        poster_path: movieData.poster_path,
        vote_average: movieData.vote_average,
        vote_count: movieData.vote_count,
        release_date: movieData.release_date,
        genres: movieData.genres,
        trailerKey,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du film :", error);
      return null;
    }
  };

  return (
    <div className="movies-container">
      <header className="header">
        <div className="sub-header">
          <div className="welcome-div">
            {isLoggedIn && <h1 className="welcome-message">Hello, {username} !</h1>}
          </div>
          <nav>
            <button className="btn-header" onClick={() => navigate('/profile')}>Profile</button>
            <button className="btn-header" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      <main className='movies-main'>
        <h2 className='movies-title'>Popular movies</h2>

        {/* Filtres avancés */}
        <div className="filters">
          <label>
            Title:
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </label>
          <label>
            Year:
            <input
              type="text"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              placeholder="Enter year"
              className="search-input"
            />
          </label>

          <label>
            Genre:
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="search-input">
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </label>

          <label>
            Language:
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="search-input">
              <option value="">All Languages</option>
              {languages.map((language) => (
                <option key={language.iso_639_1} value={language.iso_639_1}>{language.english_name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className='movies-grid'>
          {filteredMovies
            .filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(movie => (
              <div key={movie.id} className='movie-card' onClick={() => handleDivClick(movie)}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className='movie-poster'
                />
                <h3 className='movie-title'>{movie.title}</h3>
              </div>
            ))}
        </div>

        {/* Modale pour afficher les détails du film */}
        {isModalOpen && modalContent && (
          <MovieModal 
            isOpen={isModalOpen}
            content={modalContent}
            onClose={closeModal} 
          />
        )}
      </main>
    </div>
  );
};

export default Movies;
