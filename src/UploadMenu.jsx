import React, { Component } from "react";
import styles from "./css/UploadMenu.module.css";
import Bucket from "./Bucket.jsx";
import screenshot from "./images/text screenshots a.png";
const egSeps = [
  { label: "space", char: "\\s" },
  { label: "comma, space", char: ",\\s" },
  { label: "new line", char: "\\n" },
  { label: "tab", char: "\\t" },
];

class UploadMenu extends Component {
  state = {
    showFileConfirmation: false,
    newStateForApp: null,
    filename: "",
    separator: { label: "new line", char: "\n" },
    showBucket: false,
    showSeparatorInput: false,
    rawInput: "",
  };

  submitText = () => {
    this.props.setAppState(this.state.newStateForApp);
  };

  changeUploadMenuState = (newState) => {
    this.setState(newState);
  };

  formatRawInput = (string) => {
    let splitter = new RegExp(this.state.separator.char);
    if (this.state.separator.char.split("").includes("\\")) {
      splitter = new RegExp("\\" + this.state.separator.char[1]);
    }
    let array = string.split(splitter);
    return array;
  };

  gobbleInput = (txtFile) => {
    let input;
    let newState = {};

    if (txtFile) {
      input = txtFile;
    } else {
      newState.filename = "";
      input = this.state.rawInput;
    }

    let newStateForApp = {};
    let arrayFromInput = this.formatRawInput(input);

    newStateForApp.list = {
      yList: [],
      nList: [],
      wordlist: arrayFromInput,
      wordlistBackup: arrayFromInput,
    };

    newStateForApp.separator = this.state.separator.char;

    newStateForApp.showUploadMenu = false;

    this.setState({ newStateForApp });

    if (!this.state.filename.length) {
      this.props.setAppState(newStateForApp);
    }
  };

  uploadText = () => {
    return new Promise((resolve) => {
      const uploader = document.createElement("input");
      uploader.type = "file";
      uploader.style.display = "none";
      uploader.addEventListener("change", () => {
        if (uploader.files.length === 1) {
          let filesizeinMB = uploader.files[0].size / 1024 / 1024;
          if (filesizeinMB > 2) {
            alert("Sorry, only .txt files smaller than 2MB are allowed.");
          } else if (uploader.files[0].type !== "text/plain") {
            alert("Your uploaded file has to be a .txt type.");
          } else {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              uploader.parentNode.removeChild(uploader);
              resolve(reader.result);
            });
            reader.readAsText(uploader.files[0]);
            this.setState({ filename: uploader.files[0].name });
          }
        }
      });
      document.body.appendChild(uploader);
      uploader.click();
    });
  };

  checkForBackslash = () => {
    if (this.state.separator.char === "\\") {
      alert("Please choose a different separator.");
    } else {
      return true;
    }
  };

  quitUpload = () => {
    let newStateForApp = { showUploadMenu: false };
    this.props.setAppState(newStateForApp);
  };

  render() {
    return (
      <div className={styles.uploadMenuHolder}>
        <div className={styles.superUploadOptionsHolder}>
          <div className={styles.uploadOptionsHolder}>
            <div className={styles.uploadTextHolder}>
              <div className={styles.left}>
                <p className={styles.separatorText}>
                  Each list item is separated by a
                </p>
                <span className={styles.separatorLabel}>
                  {this.state.separator.label}
                </span>
                <br />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ showSeparatorInput: false });
                  }}
                  className={styles.littleUploadButton}
                  style={{
                    backgroundColor:
                      this.state.showSeparatorInput && "chartreuse",
                  }}
                >
                  Okay
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({
                      showSeparatorInput: true,
                      showBucket: false,
                    });
                  }}
                  className={styles.littleUploadButton}
                >
                  Change
                </button>
              </div>

              <div className={styles.right}>
                <button
                  className={styles.uploadButton}
                  onClick={(e) => {
                    e.preventDefault();

                    this.setState({
                      showSeparatorInput: false,
                      showBucket: false,
                    });

                    this.uploadText().then((text) => {
                      this.gobbleInput(text);
                    });
                  }}
                >
                  Upload .txt file
                </button>

                {this.state.showBucket ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();

                      if (this.checkForBackslash()) {
                        this.gobbleInput();
                      }
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

                      this.setState({
                        showBucket: true,
                        showSeparatorInput: false,
                        filename: "",
                        newStateForApp: null,
                      });
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

        {this.state.showSeparatorInput && (
          <div className={styles.sep1}>
            <div className={styles.sep2}>
              <div className={styles.sep3}>
                <div className={styles.sep4}>
                  <div className={styles.sepLeft}>
                    {egSeps.map((sepObj) => {
                      return (
                        <button
                          onClick={(e) => {
                            this.setState({
                              separator: {
                                label: sepObj.label,
                                char: sepObj.char,
                              },
                            });
                          }}
                          className={styles.littleUploadButton2}
                        >
                          {sepObj.label[0].toUpperCase() +
                            sepObj.label.slice(1)}
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.sepRight}>
                    <p className={styles.sepRightInstructions}>
                      {" "}
                      Type the character(s) that separate each item in your .txt
                      file, or in the list you will manually paste.
                    </p>
                    <input
                      className={styles.sepRightInput}
                      value={this.state.separator.char}
                      onChange={(e) => {
                        e.preventDefault();
                        this.setState({
                          separator: {
                            label: e.target.value,
                            char: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>

                  <button
                    id="Quit Bucket"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ showSeparatorInput: false });
                    }}
                    className={styles.uploadX2}
                  >
                    <span role="img" aria-label="Red X">
                      ❌
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <img
              className={styles.screenshot}
              src={screenshot}
              alt="An example .txt file with new line or comma space separators."
            />
          </div>
        )}
        {this.state.filename.length && (
          <button
            className={styles.fileConfirmationButton}
            onClick={(e) => {
              e.preventDefault();
              if (this.checkForBackslash()) {
                this.submitText();
              }
            }}
          >
            Let's go with '{this.state.filename}'
          </button>
        )}
      </div>
    );
  }
}

export default UploadMenu;
