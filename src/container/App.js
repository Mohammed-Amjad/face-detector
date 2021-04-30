import './App.css';
import Navigation from '../component/navigation/Navigation'
import Logo from '../component/logo/Logo'
import ImageLinkForm from '../component/imagelinkform/ImageLinkForm'
import Rank from '../component/rank/Rank'
import FaceRecognition from '../component/facerecognition/FaceRecognition'
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
      faceData: []
    }
  }

  render() {
    return (
      <div>
        <Particles className='particles' params={particleParams} />
        <Navigation />
        <div className='logorank'>
          <Logo />
          <Rank />
        </div>
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl} faceData={this.state.faceData} />
      </div>
    );
  }
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

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
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
      }));
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
