import React from 'react';
import brain from './brain.png'
import Tilt from 'react-tilt'
import './Logo.css'

const Logo = () => {
    return (
        <div className="mt0 ma4">
        <Tilt className="Tilt  logo br2 shadow-2 centre" options={{ max: 50 }} style={{ height: 200, width: 200 }} >
            <div className="Tilt-inner pa3"><img alt='logo' src={brain}/></div>
        </Tilt>
        </div>
    );
}

export default Logo;