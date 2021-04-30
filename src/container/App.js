import './App.css';
import Navigation from '../component/navigation/Navigation'
import Logo from '../component/logo/Logo'
import ImageLinkForm from '../component/imagelinkform/ImageLinkForm'
import Rank from '../component/rank/Rank'
import FaceRecognition from '../component/facerecognition/FaceRecognition'
import Particles from 'react-particles-js';

const particleParams = {
  "particles": {
    "number": {
      "value": 50
    },
    "size": {
      "value": 2
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      }
    }
  }
};

function App() {
  return (
    <div>
      <Particles className='particles' params={particleParams} />
      <Navigation />
      <div className='logorank'>
        <Logo />
        <Rank />
      </div>
      <ImageLinkForm />
      <FaceRecognition />
    </div>
  );
}

export default App;
