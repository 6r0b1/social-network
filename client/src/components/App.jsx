import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import Logo from "./Logo";
import UploadModal from "./UploadModal";
import Profile from "./Profile";
import FindPpl from "./FindPpl/FindPpl";
import PublicProfile from "./PublicProfile/PublicProfile";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePictureUploadVisible: false,
            updateBio: true,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.openPictureModal = this.openPictureModal.bind(this);
        this.closePictureModal = this.closePictureModal.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }
    handleInputChange(e) {
        const text = e.currentTarget.value;
        this.setState({
            [e.currentTarget.name]: text,
        });
    }
    openPictureModal(e) {
        this.setState({
            profilePictureUploadVisible: true,
        });
    }
    closePictureModal() {
        this.setState({
            profilePictureUploadVisible: false,
        });
        location.reload();
    }
    uploadImage() {
        const file = document.querySelector("input[type=file]").files[0];

        const formData = new FormData();

        formData.append("file", file);

        //send formData instance in POST request
        fetch("/profilePicUpload", {
            method: "POST",
            body: formData,
        }).then((res) => {
            this.closePictureModal();
        });
    }

    componentDidMount() {
        fetch("/profile")
            .then((result) => result.json())
            .then((userData) => {
                this.setState(userData);

                if (userData.user_bio) {
                    this.setState({
                        updateBio: false,
                    });
                }
            });
    }
    render() {
        return (
            <BrowserRouter>
                <main className="logged_in_main">
                    <div className="logged_in_header">
                        <Logo />
                        <div>
                            <Link className="menu_item" to="/">
                                You (
                                {this.state.firstname +
                                    " " +
                                    this.state.lastname}
                                )
                            </Link>
                            <Link className="menu_item" to="/others">
                                Find Others
                            </Link>
                            <Link className="menu_item" to="/logout">
                                Log Out
                            </Link>
                        </div>
                        <ProfilePicture
                            pictureClass={"profile_picture_mini"}
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
                    <div className="divider"></div>
                    <div className="profile">
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={
                                    <Profile
                                        userBio={this.state.user_bio}
                                        pictureClass={"profile_picture_large"}
                                        userFirstName={this.state.firstname}
                                        userLastName={this.state.lastname}
                                        profilePictureUrl={
                                            this.state.user_picture_url
                                        }
                                        openPictureModal={this.openPictureModal}
                                    />
                                }
                            ></Route>
                            <Route path="/others" element={<FindPpl />}></Route>
                            <Route
                                path="/publicprofile/:id"
                                element={<PublicProfile />}
                            ></Route>
                        </Routes>
                    </div>
                </main>
            </BrowserRouter>
        );
    }
}
