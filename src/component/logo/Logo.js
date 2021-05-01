import React from 'react';
import brain from './brain.png'
import Tilt from 'react-tilt'
import './Logo.css'

const Logo = () => {
    return (
        <div className="mt0 ma0">
            <Tilt className="Tilt  logo br2 shadow-2 centre" options={{ max: 50 }} style={{ height: 200, width: 200 }} >
                <div className="Tilt-inner pa3">
                    <img alt='logo' src={brain} />
                    <h3>Face Detector</h3>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;