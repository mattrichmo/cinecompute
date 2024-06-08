import React from 'react';
import './comingSoon.scss';

const ComingSoon = () => {
    return (
<div className="fixed inset-0 z-50 flex absolute" style={{ backgroundColor: '#171DA8' }}>            
    <div className="text-center">
                <div className="vhs-message">
                    <span>
                        <h1 className="text-white">Cine Compute</h1>
                    </span>
                    <span>
                        <h2 className="text-white">Coming soon</h2>
                    </span>
                </div>
                <div className="screen-bottom mt-4">
                    <div className="line">
                        <div className="red"></div>
                        <div className="white"></div>
                        <div className="green"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon;