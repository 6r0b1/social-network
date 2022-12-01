import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import Bio from "./Bio";

export default class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <ProfilePicture
                    pictureClass={this.props.pictureClass}
                    userFirstName={this.props.userFirstName}
                    userLastName={this.props.userLastName}
                    profilePictureUrl={this.props.profilePictureUrl}
                    openPictureModal={this.props.openPictureModal}
                />
                <Bio userBio={this.props.userBio} />
            </>
        );
    }
}
