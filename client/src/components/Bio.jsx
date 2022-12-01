import { Component } from "react";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateBio: false,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleUpdateBio = this.toggleUpdateBio.bind(this);
    }
    handleInputChange(e) {
        const text = e.currentTarget.value;
        this.setState({
            [e.currentTarget.name]: text,
        });
    }
    handleSubmit() {
        if (this.state.userBioUpdate) {
            fetch("/bioupdate", {
                method: "POST",
                body: JSON.stringify(this.state),
                headers: { "Content-Type": "application/json" },
            })
                .then((result) => result.json())
                .then((userData) => {
                    this.setState({
                        userBio: userData,
                        updateBio: false,
                    });
                    location.reload();
                })
                .catch(() => {
                    this.setState({
                        error: "There was a problem with your inputs!",
                    });
                });
        }
    }
    toggleUpdateBio() {
        this.setState({
            updateBio: true,
        });
    }

    render() {
        if (this.props.userBio && !this.state.updateBio) {
            return (
                <div className="bio_area">
                    <h3>What you wanted to tell others about yourself:</h3>
                    <p className="user_bio">{this.props.userBio}</p>
                    <button className="bio_save" onClick={this.toggleUpdateBio}>
                        Update
                    </button>
                </div>
            );
        } else {
            return (
                <div className="bio_area">
                    <h3>Say somethin about yourself:</h3>
                    <textarea
                        className="user_bio_edit"
                        value={this.props.userBio}
                        name="userBioUpdate"
                        id="userBio"
                        onChange={this.handleInputChange}
                    ></textarea>
                    <button className="bio_save" onClick={this.handleSubmit}>
                        Save!
                    </button>
                </div>
            );
        }
    }
}
