import React, { Component } from "react";
import styles from "./css/Bucket.module.css";
import menuStyles from "./css/Menu.module.css";

class Bucket extends Component {
  state = {
    cssTopPropertyOfTextareaBasedOnRectTopOfBigwordbox: "260px",
    cssMarginTopPropertyOfXBasedOnRectTopOfBigwordbox: "-270px",
  };

  componentDidMount() {
    let el = document.getElementById("uploadMenuHolder");
    var rect = el.getBoundingClientRect();
    this.setState({
      cssTopPropertyOfTextareaBasedOnRectTopOfBigwordbox: `${rect.top + 180}px`,
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
            id="Quit Bucket"
            onClick={(e) => {
              e.preventDefault();
              this.props.changeUploadMenuState({ showBucket: false });
            }}
            className={styles.uploadX}
          >
            <span
              role="img"
              aria-label="Red X"
              className={menuStyles.exitSymbol}
            >
              &times;
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default Bucket;
