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
          <h1>Welcome on CineApp !</h1>
          <div className="buttons">
            <a href="/login" className="btn btn-out">
              Log in
            </a>
            <a href="/register" className="btn btn-out">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
