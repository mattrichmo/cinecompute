// HeroBackground.jsx
"use client"

import React from 'react';
import './Background.css'; // Ensure the path matches where you store your CSS

const Background = () => {
    return (
        <div className="hero__background-container">
            <div className="hero__background-video">
                <div className="hero__background-video-inner">
                    <video title="bg-video" autoPlay loop muted>
                        <source src="./1.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
            <span className="hero__background-container--bg" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></span>
        </div>
    );
};

export default Background;
