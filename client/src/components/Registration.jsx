import { Component } from "react";

export default class Registration extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="register">
                <h2 className="register">
                    Afraid to miss out? Well, that's everybody and their mum!
                </h2>
                <p className="register">
                    {" "}
                    There's a lot going on every day aud it's to much for your
                    tiny human brain to keep up with. Don't worry though, we've
                    got you covered.
                </p>
                <p className="register">
                    F.ear O.f M.issing O.ut (see what we did there?) is here to
                    help you keep track of your favourite artists, clubs,
                    galleries [...] you name it.
                </p>
                <p className="register">
                    Register a free account now and never miss out on the fun
                    again.
                </p>
                <p className="register">
                    Already have an account? <a>>Log in</a> then!
                </p>
                <div className="inputs">
                    <input
                        className="register"
                        type="text"
                        name="firstname"
                        onChange={this.handleInputChange}
                        placeholder="First Name"
                    />
                    <input
                        className="register"
                        type="text"
                        name="lastname"
                        onChange={this.handleInputChange}
                        placeholder="Last Name"
                    />
                    <input
                        className="register"
                        type="email"
                        name="email"
                        onChange={this.handleInputChange}
                        placeholder="Email Address"
                    />
                    <input
                        className="register"
                        type="text"
                        name="password"
                        onChange={this.handleInputChange}
                        placeholder="Password"
                    />
                    <input
                        className="register"
                        type="text"
                        name="passwordrep"
                        onChange={this.handleInputChange}
                        placeholder="Repeat Password"
                    />
                    <button className="register" onClick={this.handleSubmit}>
                        Register now
                    </button>
                </div>
            </div>
        );
    }
}
