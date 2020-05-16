import styles from "./css/App.module.css";
import React, { Component } from "react";
import { keys, animals } from "./utils.js";
import words from "./words.txt";
import ConfigMenu from "./ConfigMenu.jsx";
import UploadMenu from "./UploadMenu.jsx";

class App extends Component {
  state = {
    userIsOnMobile: false,
    mobileListEditingMode: false,
    whichListToMakeFlashRightNow: null,
    invisibleTextarea: "",
    showConfigMenu: false,
    showUploadMenu: false,
    fontsizeOfBigtextBasedOnWhetherOverflowing: "8.35vh",
    paddingOfBigtextboxBasedOnWhetherOverflowing: "0.5px", // Deliberately 0.5 and not 0, as the 0.5 is unique to mounting, so can avoid endless loop in CDU for overflown check.
    colorOfBigtextBasedAsOverflowcheckFudge: "black",
    separator: "\t",
    weAreFinished: false,
    configLang: 0,
    i: 1,
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

    configureKeys: () => {
      console.log("configureKeys not set yet in App.jsx");
    },
  };

  setAppState = (newState) => {
    this.setState(newState);
  };

  wipeAppState = () => {
    this.setState({
      paddingOfBigtextboxBasedOnWhetherOverflowing: "0.5px",
      weAreFinished: false,
      i: 1,
      mostRecentAction: { word: null, origin: null, destination: null },
    });
  };

  componentDidMount() {
    this.setState({ userIsOnMobile: window.screen.width <= 568 });

    // let observer = new MutationObserver(function (mutations) {
    //   mutations.forEach(function (mutationRecord) {
    //     console.log("style changed!");
    //   });
    // });

    // observer.observe(bwb, {
    //   attributes: true,
    //   attributeFilter: [rect.top, rect.right, rect.bottom, rect.left],
    // });

    this.setState((currState) => {
      let newState = { colors: currState.colors };
      Object.keys(newState.colors.display).forEach((key) => {
        newState.colors.display[key] = currState.colors.reference[key];
      });

      newState.list = currState.list;
      newState.list.wordlist = animals;
      newState.list.wordlistBackup = animals;

      return newState;
    });
    setTimeout(this.keepListening, 50);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showUploadMenu && !this.state.showUploadMenu) {
      this.keepListening();
      this.wipeAppState();
      console.log("Let's play!");
      this.setState((currState) => {
        let newState = { list: {} };
        newState.list.yList = [];
        newState.list.nList = [];
        newState.list.wordlist = currState.list.wordlist.filter(
          (x) => x !== ""
        );
        newState.list.wordlistBackup = currState.list.wordlist.filter(
          (x) => x !== ""
        );

        return { newState };
      });

      this.isOverflown(document.getElementById(`bigText${this.state.i}`));
    }
    if (!prevState.showUploadMenu && this.state.showUploadMenu) {
      document.onkeyup = function (event) {};
    }
    if (!prevState.weAreFinished && this.state.weAreFinished) {
      this.keepListening(true);
    }
    if (prevState.weAreFinished && !this.state.weAreFinished) {
      this.keepListening();
    }

    if (
      this.state.i === 1 &&
      document.getElementById(`bigText${this.state.i}`) &&
      this.state.paddingOfBigtextboxBasedOnWhetherOverflowing === "0.5px"
    ) {
      this.isOverflown(document.getElementById(`bigText${this.state.i}`));
    }

    if (prevState.i !== this.state.i) {
      let el = document.getElementById(`bigText${this.state.i}`);

      this.isOverflown(el);

      this.setState({
        weAreFinished: this.state.i > this.state.list.wordlistBackup.length,
      });
    }

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

  keepListening = (shouldIOnlyAllowPressOfUndoButton) => {
    let {
      showConfigMenu,
      triggers,
      showUploadMenu,
      userIsOnMobile,
    } = this.state;
    let pressButtonColor = this.pressButtonColor;

    document.onkeyup = function (event) {
      event.preventDefault();
      if (!(showConfigMenu || showUploadMenu || userIsOnMobile)) {
        console.log("in doc on keyup", userIsOnMobile);

        let which = event.which;
        let code = event.keyCode;

        Object.keys(triggers.current).forEach((label) => {
          if (
            which === triggers.current[label].which ||
            code === triggers.current[label].code
          ) {
            if (shouldIOnlyAllowPressOfUndoButton) {
              if (label === "u") {
                document.getElementById(`${label}Button`).click();
                pressButtonColor(label);
              }
            } else {
              document.getElementById(`${label}Button`).click();
              pressButtonColor(label);
            }
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

  copyList = (labelWord) => {
    this.setState({
      whichListToMakeFlashRightNow: labelWord.toLowerCase()[0],
      invisibleTextarea: this.state.list[`${labelWord.toLowerCase()[0]}List`]
        .slice(0)
        .join(this.state.separator),
    });

    setTimeout(() => {
      let el = document.getElementById("invisibleTextarea");
      el.select();
      el.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");
    }, 500);
  };

  downloadList = (labelWord) => {
    let splitter;
    splitter = this.state.separator;

    let arr = splitter.split("");

    console.log("arr", arr);
    let splittr = "";

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== "\\") {
        console.log("a");
        splittr = splittr.concat(arr[i]);
      } else {
        console.log("b");

        if (arr[i + 1] === "t") {
          splittr = splittr.concat("\t");
        } else if (arr[i + 1] === "s") {
          splittr = splittr.concat(" ");
        } else if (arr[i + 1] === "n") {
          splittr = splittr.concat("\n");
        } else {
          // splittr = splittr.concat(`\\${arr[i + 1]}`);

          splittr = splittr.concat("\\");
          splittr = splittr.concat(arr[i + 1]);
        }
        i++;
      }
    }

    console.log(`..${splittr}..`, splittr.length);
    // splitter = new RegExp(this.state.separator);
    // if (this.state.separator.split("").includes("\\")) {
    //   splitter = new RegExp("\\" + this.state.separator[1]);
    // }
    // splitter = "\n";
    let stringFromWordArray = this.state.list[
      `${labelWord[0].toLowerCase()}List`
    ].join(splittr);
    let myblob = new Blob([stringFromWordArray], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(myblob);
    const link = document.createElement("a");
    link.download = `${labelWord}-List-${Date.now()}.txt`;
    link.href = url;
    link.click();
  };

  showConfigMenu = () => {
    document.getElementById("Show Config").blur();

    let random = this.state.configLang;

    while (random === this.state.configLang) {
      random = Math.floor(Math.random() * 3); //SCREW
    }
    // this.checkCoordinatesOfBigwordboxAndAdjustMenuAccordingly();

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

  // checkCoordinatesOfBigwordboxAndAdjustMenuAccordingly = () => {
  //   let bwb = document.getElementById("bigwordbox");
  //   var rect = bwb.getBoundingClientRect();
  //   console.log(
  //     "bigwordbox",
  //     `top:${Math.round(rect.top)}, bottom:${Math.round(rect.bottom)}`
  //   );
  // };

  undo = () => {
    let { word, destination, origin } = this.state.mostRecentAction;
    if (word && destination) {
      let redactedDestination = this.state.list[destination].filter(
        (x) => x !== word
      );
      let newState = {};
      newState.list = this.state.list;
      newState.list[destination] = redactedDestination;
      newState.mostRecentAction = {};
      if (origin === "wordlist") {
        newState.i = this.state.i - 1;
        this.updateScroll(destination);
      } else {
        let revertedOrigin = this.state.list[origin].slice(0);
        revertedOrigin.push(word);
        newState.list[origin] = revertedOrigin;
      }
      this.setState(newState);
      if (origin === "yList" || origin === "nList") {
        this.updateScroll(origin);
      }
      // if (destination === "yList" || destination === "nList") {
      //   this.updateScroll(destination);
      // }
    }
  };

  isOverflown = (element) => {
    const isOverflownInnerFxn = (element) => {
      if (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      ) {
        console.log("overflown");
        this.setState({
          paddingOfBigtextboxBasedOnWhetherOverflowing: "21.5px",
          fontsizeOfBigtextBasedOnWhetherOverflowing: "5.35vh",
          colorOfBigtextBasedAsOverflowcheckFudge: "black",
        });
      } else {
        console.log("not overflown");
        this.setState({
          paddingOfBigtextboxBasedOnWhetherOverflowing: "0px",
          fontsizeOfBigtextBasedOnWhetherOverflowing: "8.35vh",
          colorOfBigtextBasedAsOverflowcheckFudge: "black",
        });
      }
    };

    if (
      this.state.list.wordlist[this.state.i - 1] &&
      this.state.list.wordlist[this.state.i - 1].length > 9
    ) {
      this.setState({
        paddingOfBigtextboxBasedOnWhetherOverflowing: "0px",
        fontsizeOfBigtextBasedOnWhetherOverflowing: "8.35vh",
        colorOfBigtextBasedAsOverflowcheckFudge: "#fbfbfb", //var(--off-white)
      });
      setTimeout(() => {
        isOverflownInnerFxn(element);
      }, 1);
    } else {
      isOverflownInnerFxn(element);
    }
  };

  putWordInList = (label) => {
    if (!(this.state.weAreFinished || this.state.showConfigMenu)) {
      let destination = `${label}List`;
      let newI = this.state.i + 1;
      let newList = this.state.list;
      let word = this.state.list.wordlist[this.state.i - 1];
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
    }
  };

  startAgain = () => {
    this.setState((currState) => {
      let newState = { list: {} };

      newState.list.yList = [];
      newState.list.nList = [];
      newState.list.wordlist = currState.list.wordlistBackup.slice(0);
      newState.list.wordlistBackup = currState.list.wordlistBackup.slice(0);
      newState.i = 1;
      newState.mostRecentAction = {
        word: null,
        origin: null,
        destination: null,
      };

      return newState;
    });
  };

  render() {
    if (this.state.whichListToMakeFlashRightNow) {
      setTimeout(() => {
        this.setState({ whichListToMakeFlashRightNow: false });
      }, 4000);
    }

    return (
      <div id="grossuberbox" className={styles.grossuberbox}>
        {/* <a href={words} target="_blank" rel="noopener noreferrer">
          Visit W3Schools.com!
        </a> */}

        <textarea
          value={this.state.invisibleTextarea}
          className={styles.invisibleTextarea}
          id="invisibleTextarea"
        ></textarea>

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
          <div
            id="bigwordbox"
            className={styles.bigwordbox}
            style={{
              backgroundColor: this.state.weAreFinished && "#eeeeee",
            }}
          >
            <div className={styles.tinyButtonHolder}>
              <button
                style={{
                  color: this.state.weAreFinished && "black",
                  fontWeight: this.state.weAreFinished && "550",
                  pointerEvents:
                    (this.state.showConfigMenu || this.state.showUploadMenu) &&
                    "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  // this.checkCoordinatesOfBigwordboxAndAdjustMenuAccordingly();
                  this.setState({ showUploadMenu: true });
                }}
                id="Upload List"
                className={`${styles.tinyButton} ${styles.uploadButton}`}
              >
                Upload list
              </button>

              <p className={styles.counter}>
                {this.state.weAreFinished
                  ? `Yes: ${this.state.list.yList.length} - No: ${this.state.list.nList.length}`
                  : `${this.state.i} of ${this.state.list.wordlist.length}`}
              </p>

              <button
                style={{
                  color: this.state.weAreFinished && "black",
                  fontWeight: this.state.weAreFinished && "550",
                  pointerEvents:
                    (this.state.showConfigMenu || this.state.showUploadMenu) &&
                    "none",
                }}
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
              <p
                style={{
                  paddingTop: this.state
                    .paddingOfBigtextboxBasedOnWhetherOverflowing,
                  fontSize: this.state
                    .fontsizeOfBigtextBasedOnWhetherOverflowing,
                  color: this.state.colorOfBigtextBasedAsOverflowcheckFudge,
                }}
                className={styles.bigText}
                id={`bigText${this.state.i}`}
              >
                {this.state.list.wordlist[this.state.i - 1]}
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
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
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
                  onClick={(e) => {
                    e.preventDefault();

                    if (
                      this.state.userIsOnMobile &&
                      !this.state.mobileListEditingMode
                    ) {
                      this.putWordInList(label);
                    }
                  }}
                  id={`${label}List`}
                  key={`${label}List`}
                  className={`${styles.list} 
                  
                  
                  ${
                    this.state.whichListToMakeFlashRightNow === label &&
                    (label === "y" ? styles.flashingY : styles.flashingN)
                  }
                  
                  ${label === "y" ? styles.yList : styles.nList}`}
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
          {this.state.userIsOnMobile ? (
            <button
              style={{
                backgroundColor: this.state.mobileListEditingMode && "#ccffff",

                pointerEvents:
                  (this.state.showConfigMenu || this.state.showUploadMenu) &&
                  "none",
              }}
              id="Edit Lists"
              onClick={(e) => {
                e.preventDefault();
                this.setState((currState) => {
                  return {
                    mobileListEditingMode: !currState.mobileListEditingMode,
                  };
                });
              }}
              className={`${styles.littleButton} ${styles.configButton}`}
            >
              {this.state.mobileListEditingMode ? "Stop editing" : "Edit lists"}
            </button>
          ) : (
            <button
              style={{
                pointerEvents:
                  (this.state.showConfigMenu || this.state.showUploadMenu) &&
                  "none",
              }}
              id="Show Config"
              onClick={(e) => {
                e.preventDefault();
                this.showConfigMenu();
              }}
              className={`${styles.littleButton} ${styles.configButton}`}
            >
              Set keys
            </button>
          )}

          {["Yes", "No"].map((labelWord) => {
            return (
              <div className={styles.copyAndDLButtonsHolder}>
                <button
                  style={{
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  id={`Download ${labelWord[0].toLowerCase()}List`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.copyList(labelWord);
                  }}
                  className={`${styles.littleHalfButton} ${styles.topslice} ${
                    labelWord === "Yes"
                      ? styles.yListButton
                      : styles.nListButton
                  }
                  
                  
                  
                  `}
                >
                  Copy {labelWord}
                </button>

                <button
                  style={{
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  id={`Download ${labelWord[0].toLowerCase()}List`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.downloadList(labelWord);
                  }}
                  className={`${styles.littleHalfButton} ${
                    styles.bottomslice
                  } ${
                    labelWord === "Yes"
                      ? styles.yListButton
                      : styles.nListButton
                  }`}
                >
                  Download {labelWord}
                </button>
              </div>
            );
          })}

          <button
            id="uButton"
            style={{
              backgroundColor: this.state.colors.display.u,
              zIndex: this.state.z.u,
              pointerEvents:
                (this.state.showConfigMenu || this.state.showUploadMenu) &&
                "none",
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
