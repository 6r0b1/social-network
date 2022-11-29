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
    uploadImage() {
        const file = document.querySelector("input[type=file]").files[0];
        console.log(file);

        const formData = new FormData();

        formData.append("file", file);

        //send formData instance in POST request
        fetch("/profilePicUpload", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                return res.json(); //json from "/images" post in server
            })
            .then((result) => {
                console.log("imgobject", result);
                this.setState(
                    {
                        userData: {
                            ...this.state.userData,
                            profilePicUrl: result.url,
                        },
                    },
                    () => {
                        console.log(this.state);
                    }
                );
                // this.images.unshift(result);

                // this.username = result.username;
                // this.title = ""; //result.file contains title
                // this.description = "";
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
                <ProfilePicture
                    profilePictureUrl="this.state.user_picture_url"
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
