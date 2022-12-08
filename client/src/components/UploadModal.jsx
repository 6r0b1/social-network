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
                    <div className="lightbox">
                        <div className="controle">
                            <img
                                className="close"
                                onClick={this.props.closePictureModal}
                                src="./close.png"
                                alt="close"
                            />
                        </div>
                        <div>
                            <h3 className="legend">
                                Choose a new representation of yourself
                            </h3>
                            <input type="file" accept="image/png, image/jpeg" />
                            <input
                                type="button"
                                onClick={this.props.uploadImage}
                                value="Upload"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
