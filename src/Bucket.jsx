import React, { Component } from "react";
import styles from "./css/Bucket.module.css";
class Bucket extends Component {
  state = {
    cssTopPropertyOfTextareaBasedOnRectTopOfBigwordbox: "260px",
    cssMarginTopPropertyOfXBasedOnRectTopOfBigwordbox: "-270px",
  };

  componentDidMount() {
    let el = document.getElementById("uploadMenuHolder");
    var rect = el.getBoundingClientRect();
    console.log(rect.top);
    this.setState({
      cssTopPropertyOfTextareaBasedOnRectTopOfBigwordbox: `${rect.top + 180}px`,
      // cssMarginTopPropertyOfXBasedOnRectTopOfBigwordbox: `${rect.top - 270}px`,
    });
  }

  render() {
    return (
      <div className={styles.one}>
        <div
          style={{
            top: this.state.cssTopPropertyOfTextareaBasedOnRectTopOfBigwordbox,
          }}
          className={styles.textareaHolder}
        >
          <textarea
            className={styles.textarea}
            placeholder="Paste your raw text here.."
            value={this.props.rawInput}
            onChange={(e) => {
              this.props.changeUploadMenuState({ rawInput: e.target.value });
            }}
          ></textarea>
          <button
            // style={{
            //   marginTop: this.state
            //     .cssMarginTopPropertyOfXBasedOnRectTopOfBigwordbox,
            // }}
            id="Quit Bucket"
            onClick={(e) => {
              e.preventDefault();
              this.props.changeUploadMenuState({ showBucket: false });
            }}
            className={styles.uploadX}
          >
            <span role="img" aria-label="Red X">
              ❌
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default Bucket;
