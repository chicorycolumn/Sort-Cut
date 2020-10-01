import React, { Component } from "react";
import styles from "./css/UploadMenu.module.css";
import menuStyles from "./css/Menu.module.css";
import Bucket from "./Bucket.jsx";
import { filterBlankLines } from "./utils";
import screenshot from "./images/text screenshots a.png";
const egSeps = [
  { label: "space", char: "\\s" },
  { label: "comma, space", char: ",\\s" },
  { label: "new line", char: "\\n" },
  { label: "comma, new line", char: ",\\n" },
  { label: "tab", char: "\\t" },
];

class UploadMenu extends Component {
  state = {
    unformattedTextFile: null,
    cssTopPropertyOfMenuBasedOnRectTopOfBigwordbox: "80px",
    showFileConfirmation: false,
    newStateForApp: null,
    filename: "",
    separator: { label: "new line", char: "\n" },
    showBucket: false,
    showSeparatorInput: false,
    rawInput: "",
  };

  changeUploadMenuState = (newState) => {
    this.setState(newState);
  };

  formatRawInput = (string) => {
    let arr = this.state.separator.char.split("");
    let splitter = "";

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== "\\") {
        splitter = splitter.concat(arr[i]);
      } else {
        if (arr[i + 1] === "t") {
          splitter = splitter.concat("\t");
        } else if (arr[i + 1] === "s") {
          splitter = splitter.concat(" ");
        } else if (arr[i + 1] === "n") {
          splitter = splitter.concat("\n");
        } else {
          splitter = splitter.concat("\\");
          splitter = splitter.concat(arr[i + 1]);
        }
        i++;
      }
    }
    let array = string.split(splitter);

    return filterBlankLines(array);
  };

  componentDidMount() {
    let bwb = document.getElementById("bigwordbox");
    var rect = bwb.getBoundingClientRect();
    this.setState({
      cssTopPropertyOfMenuBasedOnRectTopOfBigwordbox: `${rect.top + 15}px`,
    });
  }

  gobbleInput = (txtFile) => {
    let input;
    let newStateForApp = {};

    if (txtFile) {
      input = txtFile;
      newStateForApp.filename = this.state.filename;
    } else {
      newStateForApp.filename = "";
      input = this.state.rawInput;
    }

    let arrayFromInput = this.formatRawInput(input);

    newStateForApp.list = {
      yesList: [],
      noList: [],
      wordlist: arrayFromInput,
      wordlistBackup: arrayFromInput,
    };

    newStateForApp.separator = this.state.separator.char;
    newStateForApp.showUploadMenu = false;

    this.props.wipeAppState();

    this.props.setAppState(newStateForApp);
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
    this.props.setAppState({ showUploadMenu: false });
  };

  render() {
    return (
      <div
        id="uploadMenuHolder"
        style={{
          top: this.state.cssTopPropertyOfMenuBasedOnRectTopOfBigwordbox,
        }}
        className={styles.uploadMenuHolder}
      >
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
                      this.setState({ unformattedTextFile: text });
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
                        this.setState({ unformattedTextFile: null });
                        this.gobbleInput();
                      }
                    }}
                    className={styles.uploadButton}
                    style={{ backgroundColor: "chartreuse" }}
                  >
                    Let's go!
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
                          key={`${sepObj.label}Button`}
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
                          {sepObj.label[0].toLowerCase() +
                            sepObj.label.slice(1)}
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.sepRight}>
                    <p className={styles.sepRightInstructions}>
                      {" "}
                      Type the character(s) that separate each item in your .txt
                      file, or pasted list.
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
            </div>

            <img
              className={styles.screenshot}
              src={screenshot}
              alt="An example .txt file with new line or comma space separators."
            />
          </div>
        )}
        {!!this.state.filename.length &&
          !this.state.showBucket &&
          !this.state.showSeparatorInput && (
            <button
              className={styles.fileConfirmationButton}
              onClick={(e) => {
                e.preventDefault();
                if (this.checkForBackslash()) {
                  this.gobbleInput(this.state.unformattedTextFile);
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
