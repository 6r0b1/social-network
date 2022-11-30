import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import Bio from "./Bio";

export default class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("profile", this.props);
        return (
            <>
                <ProfilePicture
                    pictureClass={this.props.pictureClass}
                    userFirstName={this.props.userFirstName}
                    userLastName={this.props.userLastName}
                    profilePictureUrl={this.props.profilePictureUrl}
                    openPictureModal={this.props.openPictureModal}
                />
                <Bio
                    updateBio={this.props.updateBio}
                    userBio={this.props.userBio}
                />
            </>
        );
    }
}
