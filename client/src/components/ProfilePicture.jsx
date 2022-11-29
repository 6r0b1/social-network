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
        if (this.profilePictureUrl) {
            return <div>{this.props.profilePictureUrl}</div>;
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
