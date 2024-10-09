import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const videoPath = "/popcorn.mp4";

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const users = Object.keys(localStorage)
      .filter((key) => key.startsWith('user_'))
      .map((key) => JSON.parse(localStorage.getItem(key) || '{}'));

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem('userLoggedIn', JSON.stringify(user));
      navigate('/movies');
    } else {
      setErrorMessage('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-container">
      <video className="background-video-filter" autoPlay muted loop>
        <source src={videoPath} type='video/mp4'/>
      </video>
      <div className="main">

        <h2>Log in</h2>
        <form className="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="btn btn-out">Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
