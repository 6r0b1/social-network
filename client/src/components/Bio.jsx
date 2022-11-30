import { Component } from "react";

export default class Bio extends Component {
    constructor(props) {
        console.log("///////////constructor");
        super(props);
        this.state = {};
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
                })
                .catch(() => {
                    this.setState({
                        error: "There was a problem with your inputs!",
                    });
                });
        }
    }
    toggleUpdateBio() {
        console.log("klick");
        this.setState({
            updateBio: true,
        });
    }
    componentDidMount() {
        console.log("mount", this.props.userBio);
    }

    render() {
        // 2 times if:
        // first check if props.biotext => render accordingly
        // second check if state.editToggle => render accordingly

        console.log("render", this.props);
        if (this.props.updateBio === false) {
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
    //     );
    // } else {
    //     return (
    //         <div className="bio_area">
    //             <h3>What you wanted to tell others about yourself:</h3>
    //             <p>{this.state.userBio}</p>
    //             <button className="bio_save" onClick={this.handleSubmit}>
    //                 Update
    //             </button>
    //         </div>
    //     );
}
