import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import Logo from "./Logo";
import UploadModal from "./UploadModal";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePictureUploadVisible: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.openPictureModal = this.openPictureModal.bind(this);
        this.closePictureModal = this.closePictureModal.bind(this);
    }
    handleInputChange(e) {
        console.log(e);
        const text = e.currentTarget.value;
        this.setState({
            [e.currentTarget.name]: text,
        });
    }
    openPictureModal(e) {
        console.log("klick");
        this.setState({
            profilePictureUploadVisible: true,
        });
    }
    closePictureModal(e) {
        console.log("klick");
        this.setState({
            profilePictureUploadVisible: false,
        });
    }
    uploadImage() {
        const file = document.querySelector("input[type=file]").files[0];
        console.log(file);

        const formData = new FormData();

        formData.append("file", file);

        //send formData instance in POST request
        fetch("/profilePicUpload", {
            method: "POST",
            body: formData,
        }).then((res) => {
            // ---------------------------------------------------- why no closePictureModal???
            location.reload();
        });
    }

    // ------------------------------------------------------------ want before mount? to get rid of flash of default
    componentDidMount() {
        fetch("/profile")
            .then((result) => result.json())
            .then((userData) => {
                console.log(userData);
                this.setState(userData);
            });
    }
    render() {
        console.log(this.state);
        return (
            <div>
                <Logo />
                <ProfilePicture
                    userFirstName={this.state.firstname}
                    userLastName={this.state.lastname}
                    profilePictureUrl={this.state.user_picture_url}
                    openPictureModal={this.openPictureModal}
                />
                {this.state.profilePictureUploadVisible === true && (
                    <UploadModal
                        uploadImage={this.uploadImage}
                        closePictureModal={this.closePictureModal}
                    />
                )}
            </div>
        );
    }
}
