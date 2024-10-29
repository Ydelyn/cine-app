import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css'; // Assurez-vous de créer ce fichier CSS pour les styles supplémentaires

const Profile: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [favoriteMovies, setFavoriteMovies] = useState<any[]>(JSON.parse(localStorage.getItem('favoriteMovies') || '[]'));

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<{ username: string; email: string; password: string }>({
        username: '',
        email: '',
        password: '',
    });

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
        const user = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');
        if (user) {
            setUserInfo({
                username: user.username || '',
                email: user.email || '',
                password: user.password || '',
            });
        } else {
            navigate('/login'); // Redirige si l'utilisateur n'est pas connecté
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRemoveFavorite = (movieId: number) => {
        const updatedFavorites = favoriteMovies.filter(movie => movie.id !== movieId);
        setFavoriteMovies(updatedFavorites);
        localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');
        user.username = userInfo.username;
        user.email = userInfo.email;
        user.password = userInfo.password;
        localStorage.setItem('userLoggedIn', JSON.stringify(user));
        alert('Informations mises à jour !');
    };

    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        navigate('/login');
    };

    return (
        <div className="profile-container">
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
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={userInfo.username}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button">Save Changes</button>
            </form>
            <h3 className="favorite-title">Favorites</h3>
            {favoriteMovies.length > 0 ? (
                <ul className="movie-list">
                    {favoriteMovies.map((movie: any) => (
                        <li key={movie.id} className="movie-item">
                            {movie.title}
                            <button className="remove-button" onClick={() => handleRemoveFavorite(movie.id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-favorites">No favorites</p>
            )}
            <button className="back-button" onClick={() => navigate(-1)}>
                Back to movies
            </button>
        </div>
    );
};

export default Profile;
