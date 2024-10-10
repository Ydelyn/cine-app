import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons'; // Bookmark fill
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons'; // Bookmark outline

interface Genre {
    id: number;
    name: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: {
        id: number; // Ajout de l'ID pour gérer les favoris
        title: string;
        overview: string;
        poster_path: string;
        vote_average: number;
        vote_count: number;
        release_date: string;
        genres: Genre[]; // Ajout des genres
        trailerKey?: string; // Clé de la bande-annonce
    };
}

const MovieModal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null; // Ne pas afficher la modale si elle est fermée

    // Gérer le clic en dehors de la modale
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            onClose(); // Fermer la modale si l'utilisateur clique en dehors du contenu
        }
    };

    // Fonction pour ajouter/supprimer un film des favoris
    const handleFavoriteClick = () => {
        const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');

        // Vérifier si le film est déjà dans les favoris
        const isFavorite = favoriteMovies.some((movie: any) => movie.id === content.id);

        if (isFavorite) {
            // Supprimer le film des favoris
            const updatedFavorites = favoriteMovies.filter((movie: any) => movie.id !== content.id);
            localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
            alert(`${content.title} removed from favorites.`);
        } else {
            // Ajouter le film aux favoris
            favoriteMovies.push(content);
            localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
            alert(`${content.title} added to favorites.`);
        }
    };

    // Vérification si le film est un favori
    const isFavorite = JSON.parse(localStorage.getItem('favoriteMovies') || '[]').some((movie: any) => movie.id === content.id);

    return (
        <div style={styles.modalOverlay} onClick={handleOverlayClick}>
            <div style={styles.modalContent}>
                <h2 style={styles.title}>{content.title}</h2>
                {/* Affichage de la bande-annonce */}
                {content.trailerKey && (
                    <div>
                        <iframe
                            width="100%"
                            height="300"
                            src={`https://www.youtube.com/embed/${content.trailerKey}`}
                            title="Bande-annonce"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
                <p>{content.overview}</p>
                <div style={styles.modalFlex}>
                    <p>{content.vote_average.toFixed(1)} / 10</p>
                    <p>{content.vote_count} votes</p>
                    <p>{content.release_date}</p>
                </div>

                {/* Affichage des genres */}
                <p>Genres: {content.genres.map(genre => genre.name).join(', ')}</p>

                {/* Icône Ajouter aux favoris */}
                <button onClick={handleFavoriteClick} style={styles.favoriteButton}>
                    <FontAwesomeIcon icon={isFavorite ? solidBookmark : regularBookmark} size="2x" />
                </button>
            </div>
        </div>
    );
};

// Styles spécifiques à la modale
const styles = {
    modalOverlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '20px',
        maxWidth: '600px',
        maxHeight: '80%',
        overflow: 'auto',
        textAlign: 'center' as 'center',
    },
    title: {
        color: 'white',
    },
    modalFlex: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    favoriteButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
        position: 'absolute' as 'absolute',
        top: 10,
        right: 10,
        color: '#e50914',
    },
};

export default MovieModal;
