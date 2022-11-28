import { Component } from "react";
import { Link } from "react-router-dom";

export default class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        console.log(e);
        const text = e.currentTarget.value;
        this.setState({
            [e.currentTarget.name]: text,
        });
    }

    handleSubmit() {
        fetch("/login", {
            method: "post",
            body: JSON.stringify(this.state),
            headers: { "Content-Type": "application/json" },
        })
            .then((result) => result.json())
            .then((userData) => {
                this.state = {};
                if (!userData.id) {
                    this.setState({
                        error: "There was a problem with your inputs!",
                    });
                } else {
                    location.reload();
                }
            })
            .catch(() => {
                this.setState({
                    error: "There was a problem with your inputs!",
                });
            });
    }

    render() {
        return (
            <div className="register">
                <h2 className="register">So you forgot your Password ...</h2>
                <p className="register">
                    Well, it can happen to anyone. It shouldn't though, so use a
                    password manager in the future, okay?
                </p>
                <p className="register">
                    Meanwhile let's work on resetting that thing. Give us your
                    mail address first.
                </p>
                <div className="inputs">
                    <input
                        className="register"
                        type="text"
                        name="email"
                        onChange={this.handleInputChange}
                        placeholder="Email"
                    />
                    <button className="register" onClick={this.handleSubmit}>
                        Reset password!
                    </button>
                </div>
            </div>
        );
    }
}
