import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const navigate = useNavigate();

    // Récupérer les informations de l'utilisateur et les films favoris depuis localStorage
    const userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');
    const [favoriteMovies, setFavoriteMovies] = React.useState<any[]>(JSON.parse(localStorage.getItem('favoriteMovies') || '[]'));

    // Fonction pour supprimer un film des favoris
    const handleRemoveFavorite = (movieId: number) => {
        const updatedFavorites = favoriteMovies.filter(movie => movie.id !== movieId);
        setFavoriteMovies(updatedFavorites);
        localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    };

    return (
        <div style={styles.profileContainer}>
            <h1 style={styles.title}>Profile</h1>
            <h2 style={styles.username}>Username: {userLoggedIn.username || 'N/A'}</h2>
            <h3 style={styles.favoriteTitle}>Favorite Movies</h3>
            {favoriteMovies.length > 0 ? (
                <ul style={styles.movieList}>
                    {favoriteMovies.map((movie: any) => (
                        <li key={movie.id} style={styles.movieItem}>
                            {movie.title}
                            <button
                                style={styles.removeButton}
                                onClick={() => handleRemoveFavorite(movie.id)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={styles.noFavorites}>No favorite movies added yet.</p>
            )}
            <button style={styles.backButton} onClick={() => navigate(-1)}>
                Go Back
            </button>
        </div>
    );
};

// Styles pour la page de profil
const styles = {
    profileContainer: {
        padding: '20px',
        textAlign: 'center' as 'center',
        backgroundColor: '#221f1f',
        height: '100vh',
    },
    title: {
        color: '#fff',
    },
    username: {
        color: '#fff',
    },
    favoriteTitle: {
        color: '#fff',
    },
    movieList: {
        listStyleType: 'none' as 'none',
        padding: 0,
    },
    movieItem: {
        color: '#fff',
        margin: '5px 0',
    },
    noFavorites: {
        color: '#fff',
    },
    removeButton: {
        marginLeft: '10px',
        padding: '5px 10px',
        cursor: 'pointer',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
    },
    backButton: {
        marginTop: '20px',
        padding: '10px 20px',
        cursor: 'pointer',
    },
};

export default Profile;
