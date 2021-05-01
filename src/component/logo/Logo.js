import React from 'react';
import brain from './brain.png'
import Tilt from 'react-tilt'
import './Logo.css'

const Logo = () => {
    return (
        <div className="mt0 ma0">
            <Tilt className="Tilt logo br2 shadow-2 centre" options={{ max: 50 }} style={{ height: 100, width: 100 }} >
                <div className="Tilt-inner pa3">
                    <img className='mt2' alt='logo' src={brain} height='40' width='40' />
                    <p className='f7'>Face Detector</p>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;