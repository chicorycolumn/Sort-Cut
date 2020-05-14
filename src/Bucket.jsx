import React, { Component } from "react";
import styles from "./css/Bucket.module.css";
class Bucket extends Component {
  state = {};
  render() {
    return (
      <div className={styles.one}>
        <textarea
          className={styles.two}
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
