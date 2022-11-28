import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
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
                <h2 className="register">Glad to see You again.</h2>
                <p className="register">
                    Since it's beenm a while, please provide your Username and
                    Password again.
                </p>
                <p className="register">
                    Don't have an account yet?{" "}
                    <Link className="link" to="/">
                        >register
                    </Link>{" "}
                    already!
                </p>
                <div className="inputs">
                    <p className="form_error">{this.state.error}</p>
                    <input
                        className="register"
                        type="text"
                        name="email"
                        onChange={this.handleInputChange}
                        placeholder="Email"
                    />
                    <input
                        className="register"
                        type="text"
                        name="password"
                        onChange={this.handleInputChange}
                        placeholder="Password"
                    />
                    <button className="register" onClick={this.handleSubmit}>
                        Log in!
                    </button>
                    <p className="register">
                        Forgot your password? You may{" "}
                        <Link className="link" to="/reset">
                            >reset
                        </Link>{" "}
                        it.
                    </p>
                </div>
            </div>
        );
    }
}
