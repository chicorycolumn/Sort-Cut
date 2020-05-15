import React, { Component } from "react";
import styles from "./css/Bucket.module.css";
class Bucket extends Component {
  state = {};
  render() {
    return (
      <div className={styles.one}>
        <button
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
        <textarea
          className={styles.textarea}
          placeholder="Paste your raw text here.."
          value={this.props.rawInput}
          onChange={(e) => {
            this.props.changeUploadMenuState({ rawInput: e.target.value });
          }}
        ></textarea>
      </div>
    );
  }
}

export default Bucket;
