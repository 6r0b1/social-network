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
            return (
                <>
                    <img
                        className={this.props.pictureClass}
                        onClick={this.props.openPictureModal}
                        src={this.props.profilePictureUrl}
                        // ------------------------------------------------------------ why no space??
                        alt={this.props.userFirstName + this.props.userLastName}
                    />
                </>
            );
        } else {
            return (
                <div>
                    <img
                        className={this.props.pictureClass}
                        onClick={this.props.openPictureModal}
                        src="./default_profile.png"
                        alt={this.props.userFirstName + this.props.userLastName}
                    />
                </div>
            );
        }
    }
}
