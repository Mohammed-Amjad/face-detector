import React from 'react';
import { serverUrl, secret } from '../../constants/AppConstants'
import CryptoJS from 'crypto-js';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            signInFailed: false,
            responseMessage: '',
            serverUnavailable: false
        }
    }

    onEmailChange = (event) => {
        this.setState({ email: event.target.value });
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    onNameChange = (event) => {
        this.setState({ name: event.target.value });
    }

    onSubmit = () => {

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(this.state.password, secret).toString();
        fetch(`${serverUrl}/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: ciphertext
                })
            }).then(response => response.json())
            .then(res => {
                if (res.responseCode === '01') {
                    this.setState({
                        signInFailed: false,
                        serverUnavailable: false
                    });
                    this.props.loadUser(res.data);
                    this.props.onRouteChange('home');
                } else {
                    this.setState({
                        signInFailed: true,
                        responseMessage: res.responseMessage
                    });
                    console.log(res);
                }
            }).catch(err => {
                console.log('Error while connecting to server while registering user.');
                this.setState({
                    serverUnavailable: true,
                    responseMessage: 'server unavailable'
                });
            });
    }

    onEnter = (event) => {
        if (event.keyCode === 13) {
            this.onSubmit();
        }
    }

    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f3 fw6 ph0 mh0 tc">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" htmlFor="name">Name</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={this.onNameChange} />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" htmlFor="email-address">Email</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={this.onEmailChange} />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f5" htmlFor="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={this.onPasswordChange}
                                    onKeyUp={this.onEnter} />
                            </div>
                        </fieldset>
                        <div className="centre">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Register"
                                onClick={this.onSubmit} />
                        </div>
                        {(this.state.signInFailed) ?
                            <div
                                className="lh-copy tc dark-red hover-dark-pink ">
                                <p>{this.state.responseMessage}</p>
                                <p>Please Retry with correct values. Do sign in if already registered</p>
                            </div>
                            : (this.state.serverUnavailable) ?
                                <div className="lh-copy tc dark-red hover-dark-pink ">
                                    <p>Server unavailable, Please try again later!</p>
                                </div>
                                : <div></div>}
                    </div>
                </main>
            </article>
        );
    }
}

export default Register;