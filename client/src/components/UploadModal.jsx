import { Component } from "react";

export default class UploadModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(e) {
        console.log(e.currentTarget.value);
        const text = e.currentTarget.value;
        this.setState({
            pictureSrc: text,
        });
        console.log(this.state);
    }
    render() {
        return (
            <div>
                <div className="modal">
                    <img
                        onClick={this.props.closePictureModal}
                        src="./close.png"
                        alt="close"
                    />
                    <input type="file" accept="image/png, image/jpeg" />
                    <input
                        type="button"
                        onClick={this.props.uploadImage}
                        value="Upload"
                    />
                </div>
            </div>
        );
    }
}
