import React from 'react';
import CryptoJS from 'crypto-js';
import { serverUrl, secret } from '../../constants/AppConstants'
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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

    onSubmit = () => {

        if (!this.state.password || !this.state.email) {
            this.setState({
                signInFailed: true,
                responseMessage: 'enter email and password',
            });
            return;
        }

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(this.state.password, secret).toString();

        fetch(`${serverUrl}/signin`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: ciphertext
                })
            }).then(response => response.json())
            .then(res => {
                if (res.responseCode === '00') {
                    fetch(`${serverUrl}/profile/${res.data.email}`)
                        .then(res => res.json())
                        .then(response => {
                            if (response.responseCode === '00') {
                                this.props.loadUser(response.data);
                                this.setState({
                                    signInFailed: false,
                                    serverUnavailable: false,
                                    responseMessage: ''
                                });
                                this.props.onRouteChange('home');
                            } else {
                                this.setState({
                                    signInFailed: true,
                                    responseMessage: response.responseMessage,
                                });
                            }
                        }).catch(err => {
                            console.log('Error while connecting to server while signing in.');
                            this.setState({
                                serverUnavailable: true,
                                responseMessage: 'server unavailable'
                            });
                        });
                } else {
                    this.setState({
                        signInFailed: true,
                        responseMessage: res.responseMessage
                    });
                    console.log(res);
                }
            }).catch(err => {
                console.log('Error while connecting to server while signing in.');
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
                            <legend className="f3 fw6 ph0 mh0 tc">Sign In</legend>
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
                                value="Sign in"
                                onClick={this.onSubmit} />
                        </div>
                        <div className="lh-copy mt3 centre grow pointer">
                            <p onClick={() => this.props.onRouteChange('register')} className="f4 link dim black db pointer grow">Register</p>
                        </div>
                        {(this.state.signInFailed) ?
                            <div
                                className="lh-copy tc dark-red hover-dark-pink ">
                                <p>{this.state.responseMessage}</p>
                                <p>Please Retry with correct values or Register yourself!</p>
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

export default SignIn;