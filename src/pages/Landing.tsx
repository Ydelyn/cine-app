import React from 'react';
import '../styles/Landing.css';

const Landing: React.FC = () => {
  const videoPath = "/popcorn.mp4";

  return (
    <div className="app">
      <video className="background-video" autoPlay muted loop>
        <source src={videoPath} type='video/mp4'/>
      </video>
      <div className="main">
        <div className="content">
          <h1>Bienvenue sur CineApp !</h1>
          <div className="buttons">
            <a href="/login" className="btn btn-out">
              Se connecter
            </a>
            <a href="/register" className="btn btn-out">
              S'inscrire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
