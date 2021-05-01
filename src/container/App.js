import './App.css';
import Navigation from '../component/navigation/Navigation'
import Logo from '../component/logo/Logo'
import ImageLinkForm from '../component/imagelinkform/ImageLinkForm'
import Rank from '../component/rank/Rank'
import FaceRecognition from '../component/facerecognition/FaceRecognition'
import SignIn from '../component/signin/SignIn';
import Register from '../component/register/Register';
import Particles from 'react-particles-js';
import React, { Component } from 'react';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '7a4027fc12d2444097d3ff07dfdd6cae'
});
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      faceData: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  render() {
    return (
      <div>
        <Particles className='particles' params={particleParams} />
        <div className='logo-nav'>
          <Logo />
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        </div>
        { (this.state.route === 'home') ?
          <div>
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} onEnter={this.onEnter} />
            <FaceRecognition imageUrl={this.state.imageUrl} faceData={this.state.faceData} />
          </div>
          : (this.state.route === 'signin' ?
            <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />)
        }
      </div>
    );
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({isSignedIn : true});
    } else {
      this.setState({isSignedIn: false});
    }
    this.setState({ route: route });
  }

  calculateFaceLoctions = (data) => {
    const faceRegions = data.outputs[0].data.regions;
    const img = document.getElementById('inputimage');
    const width = Number(img.width);
    const height = Number(img.height);
    const faceData = faceRegions.map((faceRegion) => {
      let face = faceRegion.region_info.bounding_box;
      return (
        {
          bottomRow: height - face.bottom_row * height,
          leftColumn: face.left_col * width,
          rightColumn: width - face.right_col * width,
          topRow: face.top_row * height
        })
    });
    return faceData;
  }

  setFaceData = (faceData) => {
    this.setState({ faceData: faceData });
  }

  onEnter = (event) => {
    if (event.keyCode === 13) {
      if (event.target.value.length > 0) {
        this.onSubmit(event)
      } else {
        console.log('please enter a valid image url');
      }
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onSubmit = (event) => {
    console.log(this.state.input);
    this.setState({ imageUrl: this.state.input }, () => app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.imageUrl
      )
      .then((response) => {
        this.setFaceData(this.calculateFaceLoctions(response));
      }).catch((err) => {
        console.log(err);
        console.log('please enter a valid image url');
      }));
  }
}

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

export default App;
