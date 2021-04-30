import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, faceData }) => {
    const identifyAllFaces = faceData.map((face,i) => 
    <div key={i} className='bounding-box' style={{top: face.topRow, bottom: face.bottomRow, right: face.rightColumn, left: face.leftColumn}}></div>);
    return (
        <div className='ma pic-display'>
            <div className='absolute mt2'>
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
                {identifyAllFaces}
            </div>
        </div>
    );
}

export default FaceRecognition;