import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register: React.FC = () => {
  const [id, setId] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const videoPath = "/popcorn.mp4";


  useEffect(() => {
    const users = Object.keys(localStorage)
      .filter((key) => key.startsWith('user_'))
      .map((key) => JSON.parse(localStorage.getItem(key) || '{}'));

    const lastId = users.length > 0 ? Math.max(...users.map((user) => parseInt(user.id))) : 0;

    setId(lastId + 1);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newUser = {
      id: id.toString(),
      username,
      email,
      password,
    };

    localStorage.setItem('user_' + newUser.id, JSON.stringify(newUser));

    setUsername('');
    setEmail('');
    setPassword('');

    navigate('/login');
  };

  return (
    <div className="register-container">
      <video className="background-video-filter" autoPlay muted loop>
        <source src={videoPath} type='video/mp4' />
      </video>
      <div className="main">
        <h2>Sign up</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <button type="submit" className="btn btn-out">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
