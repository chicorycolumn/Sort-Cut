import styles from "./css/App.module.css";
import React, { Component } from "react";
import { keys, animals } from "./utils.js";
import words from "./words.txt";
import ConfigMenu from "./ConfigMenu.jsx";
import UploadMenu from "./UploadMenu.jsx";

class App extends Component {
  state = {
    configLang: 0,
    i: 0,
    list: {
      yList: [],
      nList: [],
      wordlist: [],
      wordlistBackup: [],
    },
    triggers: {
      current: {
        y: { which: 190, code: 190 },
        n: { which: 191, code: 191 },
        u: { which: 16, code: 16 },
      },
      backup: {
        y: { which: 190, code: 190 },
        n: { which: 191, code: 191 },
        u: { which: 16, code: 16 },
      },
    },
    z: {
      y: 0,
      n: 0,
      u: 0,
    },

    colors: {
      reference: { y: "chartreuse", n: "#cc0000", u: "#ffffff" },
      depressed: { y: "#59b300", n: "#990000", u: "#e6e6e6" },
      display: { y: null, n: null, u: null },
    },

    mostRecentAction: { word: null, origin: null, destination: null },
    showConfigMenu: false,
    showUploadMenu: true,

    configureKeys: () => {
      console.log("configureKeys not set yet in App.jsx");
    },
  };

  setAppState = (newState) => {
    this.setState(newState);
  };

  componentDidMount() {
    this.setState((currState) => {
      let newState = { colors: currState.colors };
      Object.keys(newState.colors.display).forEach((key) => {
        newState.colors.display[key] = currState.colors.reference[key];
      });

      newState.list = currState.list;
      newState.list.wordlist = animals;
      newState.list.wordlistBackup = animals;
      // if (currState.list.wordlist.length) {
      //   newState.list = currState.list;
      //   newState.list.wordlistBackup = currState.list.wordlist.slice(0);
      // }

      return newState;
    });
    this.keepListening();
  }

  componentDidUpdate() {
    let configureKeys = this.state.configureKeys;
    if (this.state.showConfigMenu) {
      document.onkeyup = function (event) {
        event.preventDefault();
        configureKeys(event);
      };
    }
  }

  pressButtonColor = (key) => {
    let tempState = { colors: this.state.colors };
    tempState.colors.display[key] = tempState.colors.depressed[key];
    this.setState(tempState);
    setTimeout(() => {
      let revertingState = { colors: this.state.colors };
      revertingState.colors.display[key] = this.state.colors.reference[key];
      this.setState(revertingState);
    }, 60);
  };

  keepListening = () => {
    let { showConfigMenu, triggers } = this.state;
    let pressButtonColor = this.pressButtonColor;

    document.onkeyup = function (event) {
      if (!showConfigMenu) {
        let which = event.which;
        let code = event.keyCode;

        Object.keys(triggers.current).forEach((label) => {
          if (
            which === triggers.current[label].which ||
            code === triggers.current[label].code
          ) {
            document.getElementById(`${label}Button`).click();
            pressButtonColor(label);
          }
        });
      }
    };
  };

  switchToColumn = (destination, word) => {
    const switcheroo = { nList: "yList", yList: "nList" };

    this.setState((currState) => {
      let list = {};

      Object.keys(currState.list).forEach((key) => {
        list[key] = currState.list[key].slice(0);
      });

      list[switcheroo[destination]] = currState.list[
        switcheroo[destination]
      ].filter((x) => x !== word);

      list[destination] = currState.list[destination].slice(0);
      list[destination].push(word);

      return {
        list,
        mostRecentAction: {
          word,
          destination,
          origin: switcheroo[destination],
        },
      };
    });
    this.updateScroll(destination);
  };

  showConfigMenu = () => {
    let random = this.state.configLang;

    while (random === this.state.configLang) {
      random = Math.floor(Math.random() * 3); //SCREW
    }

    this.setState({
      showConfigMenu: true,
      configLang: random,
    });
  };

  updateScroll = (id) => {
    setTimeout(() => {
      let element = document.getElementById(id);
      element.scrollTop = element.scrollHeight;
    }, 50);
  };

  undo = () => {
    let { word, destination, origin } = this.state.mostRecentAction;
    if (word && destination) {
      let redactedDestination = this.state.list[destination].filter(
        (x) => x !== word
      );
      let revertedOrigin = this.state.list[origin].slice(0);
      if (origin === "wordlist") {
        revertedOrigin.unshift(word);
      } else {
        revertedOrigin.push(word);
      }
      let newState = {};
      newState.list = this.state.list;
      newState.list[origin] = revertedOrigin;
      newState.list[destination] = redactedDestination;
      newState.mostRecentAction = {};
      this.setState(newState);

      this.updateScroll(destination);
    }
  };

  putWordInList = (label) => {
    let destination = `${label}List`;
    let newI = this.state.i + 1;
    let newList = this.state.list;
    let word = this.state.list.wordlist[this.state.i];
    newList[`${label}List`].push(word);
    this.setState({
      i: newI,
      list: newList,
      mostRecentAction: {
        word,
        destination,
        origin: "wordlist",
      },
    });
    this.updateScroll(destination);
  };

  startAgain = () => {
    this.setState((currState) => {
      let newState = { list: {} };

      newState.list.yList = [];
      newState.list.nList = [];
      newState.list.wordlist = currState.list.wordlistBackup.slice(0);
      newState.list.wordlistBackup = currState.list.wordlistBackup.slice(0);
      newState.i = 0;
      newState.mostRecentAction = {
        word: null,
        origin: null,
        destination: null,
      };

      return newState;
    });
  };

  uploadList = () => {
    this.uploadText().then((text) => {
      console.log(text);
    });
    // alert("upload a list");
  };

  render() {
    return (
      <div id="grossuberbox" className={styles.grossuberbox}>
        <a href={words} target="_blank" rel="noopener noreferrer">
          Visit W3Schools.com!
        </a>

        {this.state.showConfigMenu && (
          <div className={styles.obscurus}>
            <ConfigMenu
              triggers={this.state.triggers}
              z={this.state.z}
              configLang={this.state.configLang}
              keepListening={this.keepListening}
              setAppState={this.setAppState}
            />
          </div>
        )}

        {this.state.showUploadMenu && (
          <div className={styles.obscurus}>
            <UploadMenu setAppState={this.setAppState} />
          </div>
        )}

        <div className={styles.uberbox}>
          <div className={styles.bigwordbox}>
            <div className={styles.tinyButtonHolder}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ showUploadMenu: true });
                }}
                id="Upload List"
                className={`${styles.tinyButton} ${styles.uploadButton}`}
              >
                Upload list
              </button>

              <p className={styles.counter}>
                {`${this.state.i} of ${this.state.list.wordlist.length}`}
              </p>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  this.startAgain();
                }}
                id="Start Again"
                className={`${styles.tinyButton} ${styles.startagainButton}`}
              >
                Start again
              </button>
            </div>

            <div className={styles.bigtextbox}>
              <p className={styles.bigText}>
                {this.state.list.wordlist[this.state.i]}
              </p>
            </div>
          </div>

          <div className={styles.buttonbox}>
            {["y", "n"].map((label) => {
              return (
                <button
                  style={{
                    backgroundColor: this.state.colors.display[label],
                    zIndex: this.state.z[label],
                  }}
                  id={`${label}Button`}
                  key={`${label}Button`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.putWordInList(label);
                  }}
                  className={`${styles.button} ${
                    label === "y" ? styles.yButton : styles.nButton
                  }`}
                >
                  {`${label.toUpperCase()} ( ${
                    keys[this.state.triggers.current[label].code] || ""
                  } )`}
                </button>
              );
            })}
          </div>
          <div className={styles.listContainer}>
            {["y", "n"].map((label) => {
              return (
                <div
                  id={`${label}List`}
                  key={`${label}List`}
                  className={`${styles.list} ${
                    label === "y" ? styles.yList : styles.nList
                  }`}
                >
                  {this.state.list[`${label}List`].map((word) => (
                    <p
                      id={`${word}-${(Math.random() * 1000)
                        .toString()
                        .slice(0, 3)}`}
                      key={`${word}-${(Math.random() * 1000)
                        .toString()
                        .slice(0, 3)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        this.switchToColumn(
                          `${label === "y" ? "n" : "y"}List`,
                          word
                        );
                      }}
                      className={styles.wordinlist}
                    >
                      {word}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.littleButtonsContainer}>
          <button
            onClick={(e) => {
              e.preventDefault();
              this.showConfigMenu();
            }}
            className={`${styles.littleButton} ${styles.configButton}`}
          >
            Set keys
          </button>

          <button
            id="Download yList"
            onClick={(e) => {
              e.preventDefault();
              // this.showConfigMenu();
            }}
            className={`${styles.littleButton} ${styles.yListButton}`}
          >
            Download Yes
          </button>

          <button
            id="Download nList"
            onClick={(e) => {
              e.preventDefault();
              // this.showConfigMenu();
            }}
            className={`${styles.littleButton} ${styles.nListButton}`}
          >
            Download No
          </button>

          <button
            id="uButton"
            style={{
              backgroundColor: this.state.colors.display.u,
              zIndex: this.state.z.u,
            }}
            onClick={(e) => {
              e.preventDefault();
              this.undo();
            }}
            className={`${styles.littleButton} ${styles.uButton}`}
          >
            {`Undo ( ${keys[this.state.triggers.current.u.code] || ""} )`}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
