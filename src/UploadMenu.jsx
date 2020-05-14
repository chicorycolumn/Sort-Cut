import React, { Component } from "react";
import styles from "./css/UploadMenu.module.css";
import Bucket from "./Bucket.jsx";

class UploadMenu extends Component {
  state = {
    separator: { label: "new lines", char: "\n" },
    showBucket: false,
    rawInput: "",
  };

  changeUploadMenuState = (newState) => {
    this.setState(newState);
  };

  formatRawInput = (string) => {
    console.log(string);
    let array = string.split(this.state.separator.char);
    return array;
  };

  gobbleRawInput = (txtFile) => {
    let input;

    if (txtFile) {
      input = txtFile;
    } else {
      input = this.state.rawInput;
    }

    let newState = {};
    let arrayFromInput = this.formatRawInput(input);

    newState.list = {
      yList: [],
      nList: [],
      wordlist: arrayFromInput,
      wordlistBackup: arrayFromInput,
    };

    newState.showUploadMenu = false;

    console.log(arrayFromInput);

    this.props.setAppState(newState);
  };

  uploadText = () => {
    //Creates a file upload dialog and returns text in promise, returns {Promise<any>}
    console.log("running uploadText fxn");
    return new Promise((resolve) => {
      // create file input

      const uploader = document.createElement("input");
      uploader.type = "file";
      uploader.style.display = "none";

      uploader.addEventListener("change", () => {
        // listen for files
        if (
          uploader.files.length === 1 &&
          uploader.files[0].type === "text/plain"
        ) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            uploader.parentNode.removeChild(uploader);
            resolve(reader.result);
          });
          reader.readAsText(uploader.files[0]);
        } else {
          alert(
            "Hey, just so you know, your uploaded file has to be a .txt type."
          );
        }
      });

      // trigger input
      document.body.appendChild(uploader);
      uploader.click();
    });
  };

  quitUpload = () => {
    let newState = {};
    newState.showUploadMenu = false;
    this.props.setAppState(newState);
  };

  render() {
    return (
      <div className={styles.uploadMenuHolder}>
        <div className={styles.superUploadOptionsHolder}>
          <div className={styles.uploadOptionsHolder}>
            <div className={styles.uploadTextHolder}>
              <div className={styles.left}>
                <p className={styles.separatorText}>
                  Your text items are separated by
                </p>
                <span className={styles.separatorLabel}>
                  {this.state.separator.label}
                </span>
                <br />
                <button className={styles.littleUploadButton}>Okay</button>
                <button className={styles.littleUploadButton}>Change</button>
              </div>

              <div className={styles.right}>
                <button
                  className={styles.uploadButton}
                  onClick={(e) => {
                    e.preventDefault();
                    this.uploadText().then((text) => {
                      this.gobbleRawInput(text);
                    });
                  }}
                >
                  Upload .txt file
                </button>

                {this.state.showBucket ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      this.gobbleRawInput();
                    }}
                    className={styles.uploadButton}
                    style={{ backgroundColor: "chartreuse" }}
                  >
                    Go!
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();

                      this.setState({ showBucket: true });
                    }}
                    className={styles.uploadButton}
                  >
                    Paste your list directly
                  </button>
                )}
              </div>
            </div>
            <button
              id="Quit Menu"
              onClick={(e) => {
                e.preventDefault();
                this.quitUpload();
              }}
              className={styles.uploadX}
            >
              <span role="img" aria-label="Red X">
                ❌
              </span>
            </button>
          </div>
        </div>
        {this.state.showBucket && (
          <Bucket
            rawInput={this.state.rawInput}
            changeUploadMenuState={this.changeUploadMenuState}
          />
        )}
      </div>
    );
  }
}

export default UploadMenu;
