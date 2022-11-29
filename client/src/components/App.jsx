import React, { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import Logo from "./Logo";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleInputChange = this.handleInputChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(e) {
        console.log(e);
        const text = e.currentTarget.value;
        this.setState({
            [e.currentTarget.name]: text,
        });
    }
    componentDidMount() {
        fetch("/profile")
            .then((result) => result.json())
            .then((userData) => {
                console.log(userData);
                this.setState(userData);
            });
    }
    render() {
        return (
            <div>
                <Logo />
                <ProfilePicture profilePictureUrl="this.state.user_picture_url" />
            </div>
        );
    }
}
