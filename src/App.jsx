import styles from "./css/App.module.css";
import React, { Component } from "react";
import { animals } from "./utils.js";
import ConfigMenu from "./ConfigMenu.jsx";
import UploadMenu from "./UploadMenu.jsx";
import GearMenu from "./GearMenu.jsx";
import HelpMenu from "./HelpMenu.jsx";
import logo from "./images/sword-vertical-symmetrical-words8.png";

class App extends Component {
  state = {
    makeListShort: false,
    showHelpMenu: false,
    showGearMenu: false,
    showConfigMenu: false,
    showUploadMenu: false,
    eggshellDepressed: "rgb(21, 166, 233)",
    offWhite: "#fbfbfb",
    shouldButtonBeActiveClass: {
      yes: false,
      no: false,
      undo: false,
    },
    depressionTimeout: 120,
    filename: "",
    hoverColor: { no: "#0000e6", yes: "#0000e6" },
    isTouchscreen: false,
    mobileListEditingMode: false,
    whichListToMakeFlashRightNow: { label: null, timeout: null },
    invisibleTextarea: "",
    fontsizeOfBigtextBasedOnWhetherOverflowing: "8.35vh",
    paddingOfBigtextboxBasedOnWhetherOverflowing: "0.5px",
    colorOfBigtextBasedAsOverflowcheckFudge: "black",
    separator: "\n",
    weAreFinished: false,
    configLang: 0,
    i: 1,
    list: {
      yesList: [],
      noList: [],
      wordlist: [],
      wordlistBackup: [],
    },
    triggers: {
      current: {
        yes: { code: "." },
        no: { code: "/" },
        undo: { code: "Shift" },
      },
      backup: {
        yes: { code: "." },
        no: { code: "/" },
        undo: { code: "Shift" },
      },
    },
    zIndex: {
      yes: 0,
      no: 0,
      undo: 0,
    },

    colors: {
      reference: { yes: "chartreuse", no: "#cc0000", undo: "#ffffff" },
      depressed: { yes: "#59b300", no: "#990000", undo: "#e6e6e6" },
      display: { yes: null, no: null, undo: null },
    },

    mostRecentActions: [],
    mostRecentAction: { word: null, origin: null, destination: null },

    configureKeys: () => {
      console.log("configureKeys not set yet in App.jsx");
    },
  };

  setAppState = (newState) => {
    this.setState(newState);
  };

  wipeAppState = () => {
    this.setState((currState) => {
      let newState = {
        list: {
          yesList: [],
          noList: [],
          wordlist: [],
          wordlistBackup: [],
        },
        paddingOfBigtextboxBasedOnWhetherOverflowing: "0.5px",
        weAreFinished: false,
        i: 1,
        mostRecentActions: [],
      };
      return newState;
    });
  };

  checkIfTouchscreen = () => {
    return !!("ontouchstart" in window || navigator.maxTouchPoints);
  };

  componentDidMount() {
    this.setState({
      isTouchscreen: window.screen.width <= 568 || this.checkIfTouchscreen(),
    });
    this.setState((currState) => {
      let newState = { colors: currState.colors };
      Object.keys(newState.colors.display).forEach((key) => {
        newState.colors.display[key] = currState.colors.reference[key];
      });

      let initialList = animals;

      if (this.state.makeListShort) {
        initialList = animals.slice(0, 3);
      }

      newState.list = currState.list;
      newState.list.wordlist = initialList;
      newState.list.wordlistBackup = initialList;

      return newState;
    });
    setTimeout(this.keepListening, 50);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showConfigMenu && !this.state.showConfigMenu) {
      let keepListening = this.keepListening;
      this.setState({ configureKeys: null });
      document.onkeyup = function (event) {
        event.preventDefault();
        keepListening();
      };
    }

    if (this.state.showConfigMenu) {
      let configureKeys = this.state.configureKeys;
      let check = this.state.showConfigMenu;
      if (check) {
        document.onkeyup = function (event) {
          event.preventDefault();
          configureKeys(event, check);
        };
      }
    }

    if (prevState.showUploadMenu && !this.state.showUploadMenu) {
      this.keepListening();
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
  }

  pressButtonColor = (key) => {
    let depressedState = {
      shouldButtonBeActiveClass: this.state.shouldButtonBeActiveClass,
    };
    depressedState.shouldButtonBeActiveClass[key] = true;
    this.setState(depressedState);
    setTimeout(() => {
      let normalState = {
        shouldButtonBeActiveClass: this.state.shouldButtonBeActiveClass,
      };
      normalState.shouldButtonBeActiveClass[key] = false;
      this.setState(normalState);
    }, this.state.depressionTimeout);
  };

  keepListening = (shouldIOnlyAllowPressOfUndoButton) => {
    let {
      showConfigMenu,
      triggers,
      showUploadMenu,
      isTouchscreen,
      mostRecentActions,
    } = this.state;
    let pressButtonColor = this.pressButtonColor;

    document.onkeyup = function (event) {
      event.preventDefault();
      if (!(showConfigMenu || showUploadMenu || isTouchscreen)) {
        let code = event.key;
        Object.keys(triggers.current).forEach((label) => {
          if (code === triggers.current[label].code) {
            if (shouldIOnlyAllowPressOfUndoButton) {
              if (label === "undo" && mostRecentActions.length) {
                document.getElementById(`${label}Button`).click();
                pressButtonColor(label);
              }
            } else {
              if (label !== "undo" || mostRecentActions.length) {
                document.getElementById(`${label}Button`).click();
                pressButtonColor(label);
              }
            }
          }
        });
      }
    };
  };

  switchToColumn = (destination, word) => {
    const invert = { noList: "yesList", yesList: "noList" };
    let mostRecentActions = this.state.mostRecentActions;
    let check1 = mostRecentActions.length;

    this.setState((currState) => {
      let list = {};

      Object.keys(currState.list).forEach((key) => {
        list[key] = currState.list[key].slice(0);
      });

      list[invert[destination]] = currState.list[invert[destination]].filter(
        (x) => x !== word
      );

      list[destination] = currState.list[destination].slice(0);
      list[destination].push(word);

      let check2 = this.state.mostRecentActions.length;

      if (check2 === check1) {
        mostRecentActions.unshift({
          word,
          destination,
          origin: invert[destination],
        });
      }

      return {
        list,
        mostRecentActions,
      };
    });
    this.updateScroll(destination);
  };

  copyTheList = (labelWord) => {
    this.setState({
      whichListToMakeFlashRightNow: {
        label: labelWord.toLowerCase(),
        timeout: 4000,
      },
      invisibleTextarea: this.state.list[`${labelWord.toLowerCase()}List`]
        .slice(0)
        .join(this.formatSeparatorFromState()),
    });

    setTimeout(() => {
      let el = document.getElementById("invisibleTextarea");
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand("copy");
    }, 500);
  };

  formatSeparatorFromState = () => {
    let arr = this.state.separator.split("");
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
    return splitter;
  };

  downloadList = (labelWord) => {
    let stringFromWordArray = this.state.list[
      `${labelWord.toLowerCase()}List`
    ].join(this.formatSeparatorFromState());
    let myblob = new Blob([stringFromWordArray], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(myblob);
    const link = document.createElement("a");
    link.download = `${
      this.state.filename.split(".txt").join("") || "Raw"
    }-${labelWord}-List-${Date.now()}.txt`;
    link.href = url;
    link.click();
  };

  showConfigMenu = () => {
    document.getElementById("Show Config").blur();

    let random = this.state.configLang;

    while (random === this.state.configLang) {
      random = Math.floor(Math.random() * 5);
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
    let { word, destination, origin } = this.state.mostRecentActions[0];
    if (word && destination) {
      let redactedDestination = this.state.list[destination].filter(
        (x) => x !== word
      );
      let newState = {};
      newState.list = this.state.list;
      newState.list[destination] = redactedDestination;
      newState.mostRecentActions = this.state.mostRecentActions;
      newState.mostRecentActions.shift();

      if (origin === "wordlist") {
        newState.i = this.state.i - 1;
        this.updateScroll(destination);
      } else {
        let revertedOrigin = this.state.list[origin].slice(0);
        revertedOrigin.push(word);
        newState.list[origin] = revertedOrigin;
      }
      this.setState(newState);
      if (origin === "yesList" || origin === "noList") {
        this.updateScroll(origin);
      }
    }
  };

  isOverflown = (element) => {
    const isOverflownInnerFxn = (element) => {
      if (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      ) {
        this.setState({
          paddingOfBigtextboxBasedOnWhetherOverflowing: "21.5px",
          fontsizeOfBigtextBasedOnWhetherOverflowing: "5.35vh",
          colorOfBigtextBasedAsOverflowcheckFudge: "black",
        });
      } else {
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
        colorOfBigtextBasedAsOverflowcheckFudge: this.state.offWhite,
      });
      setTimeout(() => {
        isOverflownInnerFxn(element);
      }, 1);
    } else {
      isOverflownInnerFxn(element);
    }
  };

  putWordInTheList = (label) => {
    if (!(this.state.weAreFinished || this.state.showConfigMenu)) {
      let destination = `${label}List`;
      let newI = this.state.i + 1;
      let newList = this.state.list;
      let word = this.state.list.wordlist[this.state.i - 1];
      newList[`${label}List`].push(word);
      let mostRecentActions = this.state.mostRecentActions;
      mostRecentActions.unshift({
        word,
        destination,
        origin: "wordlist",
      });
      this.setState({
        i: newI,
        list: newList,
        mostRecentActions,
      });
      this.updateScroll(destination);
    }
  };

  startAgain = () => {
    this.setState((currState) => {
      let newState = { list: {} };

      newState.list.yesList = [];
      newState.list.noList = [];
      newState.list.wordlist = currState.list.wordlistBackup.slice(0);
      newState.list.wordlistBackup = currState.list.wordlistBackup.slice(0);
      newState.i = 1;
      newState.mostRecentActions = [];

      return newState;
    });
  };

  render() {
    if (this.state.whichListToMakeFlashRightNow.label) {
      setTimeout(() => {
        this.setState({
          whichListToMakeFlashRightNow: { label: null, timeout: null },
        });
      }, this.state.whichListToMakeFlashRightNow.timeout);
    }

    return (
      <div id="grossuberbox" className={styles.grossuberbox}>
        <div id="background" className={styles.background}></div>
        <div id="backgroundShroud" className={styles.backgroundShroud}></div>
        <textarea
          readOnly
          value={this.state.invisibleTextarea}
          className={styles.invisibleTextarea}
          id="invisibleTextarea"
        ></textarea>

        {this.state.showConfigMenu && (
          <div className={styles.obscurus}>
            <ConfigMenu
              triggers={this.state.triggers}
              zIndex={this.state.zIndex}
              configLang={this.state.configLang}
              keepListening={this.keepListening}
              setAppState={this.setAppState}
              showConfigMenu={this.state.showConfigMenu}
            />
          </div>
        )}

        {this.state.showHelpMenu && (
          <div className={styles.obscurus}>
            <HelpMenu setAppState={this.setAppState} />
          </div>
        )}

        {this.state.showGearMenu && (
          <div className={styles.obscurus}>
            <GearMenu
              setAppState={this.setAppState}
              isTouchscreen={this.state.isTouchscreen}
            />
          </div>
        )}

        {this.state.showUploadMenu && (
          <div className={styles.obscurus}>
            <UploadMenu
              setAppState={this.setAppState}
              wipeAppState={this.wipeAppState}
            />
          </div>
        )}

        <div className={styles.uberbox}>
          <div
            id="bigwordbox"
            className={`${styles.bigwordbox}
              ${
                this.state.whichListToMakeFlashRightNow.label === "bwb" &&
                styles.flashingBWB
              }
              ${
                this.state.whichListToMakeFlashRightNow.label === "bwb2" &&
                styles.flashingBWB2
              }
            `}
            style={{
              backgroundColor: this.state.weAreFinished && this.state.offWhite,
            }}
          >
            {this.state.weAreFinished && (
              <div className={styles.logoHolder}>
                <img className={styles.logo} src={logo} alt="SortCut logo" />
              </div>
            )}
            <div className={styles.tinyButtonHolder}>
              <div className={styles.tinyButtonHolderInner}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ showHelpMenu: true });
                  }}
                  className={`${styles.iconButton} ${styles.iconButtonHelp}`}
                >
                  ?
                </button>
                <button
                  style={{
                    color: this.state.weAreFinished && "black",
                    fontWeight: this.state.weAreFinished && "550",
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ showUploadMenu: true });
                  }}
                  id="Upload List"
                  className={`${styles.tinyButton} ${styles.uploadButton}`}
                >
                  Upload a list
                </button>
              </div>

              <p className={styles.counter}>
                {this.state.weAreFinished
                  ? `Yes: ${this.state.list.yesList.length} - No: ${this.state.list.noList.length}`
                  : `${this.state.i} of ${this.state.list.wordlist.length}`}
              </p>
              <div className={styles.tinyButtonHolderInner}>
                <button
                  style={{
                    color: this.state.weAreFinished && "black",
                    fontWeight: this.state.weAreFinished && "550",
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  onClick={(e) => {
                    e.preventDefault();

                    if (this.state.i === 1) {
                      let newState = {};

                      newState.list = this.state.list;

                      let array = newState.list.wordlist.slice(0);

                      for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * i);
                        const temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                      }

                      newState.list.wordlistBackup = newState.list.wordlist.slice(
                        0
                      );

                      let preNewState = {
                        whichListToMakeFlashRightNow: {
                          label: "bwb",
                          timeout: 500,
                        },
                      };

                      this.setState(preNewState);
                      setTimeout(() => {
                        newState.list.wordlist = array;
                        newState.paddingOfBigtextboxBasedOnWhetherOverflowing =
                          "0.5px";
                        this.setState(newState);
                      }, 125);
                    } else {
                      let preNewState = {
                        whichListToMakeFlashRightNow: {
                          label: "bwb2",
                          timeout: 500,
                        },
                      };

                      this.setState(preNewState);

                      setTimeout(this.startAgain, 125);
                    }
                  }}
                  id="Start Again"
                  className={`${styles.tinyButton} ${styles.startagainButton}`}
                >
                  {this.state.i === 1 ? "Randomise" : "Start again"}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ showGearMenu: true });
                  }}
                  className={`${styles.iconButton} ${styles.iconButtonGear}`}
                >
                  ⚙
                </button>
              </div>
            </div>

            <div
              className={styles.bigtextbox}
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "http://google.com/search?q=define+" +
                    this.state.list.wordlist[this.state.i - 1]
                );
              }}
            >
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
            {!this.state.isTouchscreen &&
              ["yes", "no"].map((label) => {
                return (
                  <button
                    disabled={this.state.weAreFinished}
                    style={{
                      zIndex: this.state.zIndex[label],
                      pointerEvents:
                        (this.state.showConfigMenu ||
                          this.state.showUploadMenu) &&
                        "none",
                    }}
                    id={`${label}Button`}
                    key={`${label}Button`}
                    onClick={(e) => {
                      e.preventDefault();
                      this.putWordInTheList(label);
                    }}
                    className={`
                      ${
                        this.state.shouldButtonBeActiveClass[label] &&
                        styles.fancyButton_active
                      } 

                      ${
                        this.state.shouldButtonBeActiveClass[label] &&
                        label === "yes" &&
                        styles.yesButton_active
                      } 

                      ${
                        this.state.shouldButtonBeActiveClass[label] &&
                        label === "no" &&
                        styles.noButton_active
                      } 

                      ${styles.fancyButton}
                      
                      ${styles.button} ${
                      label === "yes" ? styles.yesButton : styles.noButton
                    } 
                   `}
                  >
                    {`${
                      label[0].toUpperCase() + label.slice(1).toLowerCase()
                    } ( ${this.state.triggers.current[label].code || ""} )`}
                  </button>
                );
              })}
          </div>

          <div className={styles.listContainer}>
            {["yes", "no"].map((label) => {
              return (
                <div
                  onClick={(e) => {
                    e.preventDefault();

                    if (
                      this.state.isTouchscreen &&
                      !this.state.mobileListEditingMode
                    ) {
                      this.putWordInTheList(label);
                    }
                  }}
                  id={`${label}List`}
                  key={`${label}List`}
                  className={`${styles.list} 
                    ${
                      this.state.whichListToMakeFlashRightNow.label === label &&
                      (label === "yes" ? styles.flashingY : styles.flashingN)
                    }
                    
                    ${label === "yes" ? styles.yesList : styles.noList}`}
                >
                  {this.state.list[`${label}List`].map((word) => (
                    <p
                      style={{
                        color:
                          this.state.mobileListEditingMode &&
                          this.state.hoverColor[label],
                      }}
                      id={`${word}-${(Math.random() * 1000)
                        .toString()
                        .slice(0, 3)}`}
                      key={`${word}-${(Math.random() * 1000)
                        .toString()
                        .slice(0, 3)}`}
                      onClick={(e) => {
                        e.preventDefault();

                        if (
                          !this.state.isTouchscreen ||
                          (this.state.isTouchscreen &&
                            this.state.mobileListEditingMode)
                        ) {
                          this.switchToColumn(
                            `${label === "yes" ? "no" : "yes"}List`,
                            word
                          );
                        }
                      }}
                      className={styles.wordinthelist}
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
          {this.state.isTouchscreen ? (
            <button
              style={{
                backgroundColor:
                  this.state.mobileListEditingMode &&
                  this.state.eggshellDepressed,

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
              className={` ${styles.fancyButton} ${styles.littleButton} ${styles.configButton}`}
            >
              {this.state.mobileListEditingMode ? "Stop editing" : "Edit lists"}
            </button>
          ) : (
            <button
              style={{
                pointerEvents:
                  (this.state.showConfigMenu || this.state.showUploadMenu) &&
                  "none",
                zIndex: "0",
              }}
              id="Show Config"
              onClick={(e) => {
                e.preventDefault();
                this.showConfigMenu();
              }}
              className={`${styles.fancyButton} ${styles.littleButton} ${styles.configButton}`}
            >
              Set keys
            </button>
          )}

          {["Yes", "No"].map((labelWord) => {
            return (
              <div
                key={`Download And Copy ${labelWord.toLowerCase()}Holder`}
                className={styles.copyAndDLButtonsHolder}
              >
                <button
                  style={{
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  key={`Copy ${labelWord.toLowerCase()}List`}
                  id={`Copy ${labelWord.toLowerCase()}List`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.copyTheList(labelWord);
                  }}
                  className={`${styles.fancyButton} ${
                    styles.littleHalfButton
                  } ${styles.topslice} ${
                    labelWord === "Yes"
                      ? styles.yesListButton
                      : styles.noListButton
                  }
                  `}
                >
                  {this.state.isTouchscreen ? (
                    <p className={styles.textInsideButton}>
                      Copy
                      <br />
                      {labelWord}-List
                    </p>
                  ) : (
                    <p className={styles.textInsideButton}>
                      Copy {labelWord}-List
                    </p>
                  )}
                </button>

                <button
                  style={{
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  key={`Download ${labelWord.toLowerCase()}List`}
                  id={`Download ${labelWord.toLowerCase()}List`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.downloadList(labelWord);
                  }}
                  className={`${styles.fancyButton}
                    ${styles.littleHalfButton} ${styles.bottomslice} ${
                    labelWord === "Yes"
                      ? styles.yesListButton
                      : styles.noListButton
                  }`}
                >
                  Download
                </button>
              </div>
            );
          })}

          <button
            id="undoButton"
            disabled={!this.state.mostRecentActions.length}
            style={{
              zIndex: this.state.zIndex.undo,
              pointerEvents:
                (this.state.showConfigMenu || this.state.showUploadMenu) &&
                "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              if (this.state.mostRecentActions.length) {
                this.undo();
              }
            }}
            className={`  ${styles.fancyButton} 
              ${
                this.state.shouldButtonBeActiveClass["undo"] &&
                styles.fancyButton_active
              } 
              ${styles.littleButton} ${styles.undoButton}`}
          >
            {this.state.isTouchscreen
              ? "Undo"
              : `Undo ( ${this.state.triggers.current.undo.code || ""} )`}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
