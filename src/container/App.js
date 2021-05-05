/**
 * backend server: https://face-detection-api-v1.herokuapp.com
 */
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
import { serverUrl } from '../constants/AppConstants';
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
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
            <Rank name={this.state.user.name} count={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} onEnter={this.onEnter} />
            <FaceRecognition imageUrl={this.state.imageUrl} faceData={this.state.faceData} />
          </div>
          : (this.state.route === 'signin' ?
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />)
        }
      </div>
    );
  }

  loadUser = (data) => {
    this.setState({ user: data });
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({
        isSignedIn: true
      });
    } else {
      this.setState(initialState);
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
    this.setState({ imageUrl: this.state.input }, () => {

      fetch(`${serverUrl}/use`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.state.user.id,
          imageUrl: this.state.imageUrl
        })
      })
        .then(res => res.json())
        .then(response => {
          if (response.responseCode === '04') {
            this.setFaceData(this.calculateFaceLoctions(response.data.apiResponse));
            this.setState({
              user: Object.assign(this.state.user, { entries: response.data.entries })
            })
          } else {
            console.log('Did not receieved proper response from server');
          }
        })
        .catch(err => console.log('server unavailable while incremeneting usage count', err))
    });
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

const initialState = {
  input: '',
  imageUrl: '',
  faceData: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

export default App;
