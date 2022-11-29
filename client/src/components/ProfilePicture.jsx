import { Component } from "react";

export default class ProfilePicture extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(e) {
        console.log(e);
        const text = e.currentTarget.value;
        this.setState({
            [e.currentTarget.name]: text,
        });
    }

    render() {
        if (this.props.profilePictureUrl) {
            console.log(this.props);
            return (
                <div>
                    <img
                        onClick={this.props.openPictureModal}
                        src={this.props.profilePictureUrl}
                        // ------------------------------------------------------------ why no space??
                        alt={this.props.userFirstName + this.props.userLastName}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    <img
                        onClick={this.props.openPictureModal}
                        src="./default_profile.png"
                        alt=""
                    />
                </div>
            );
        }
    }
}
