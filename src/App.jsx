import styles from "./css/App.module.css";
import React, { Component } from "react";
import { keys, animals } from "./utils.js";
import ConfigMenu from "./ConfigMenu.jsx";
import UploadMenu from "./UploadMenu.jsx";
import GearMenu from "./GearMenu.jsx";
import HelpMenu from "./HelpMenu.jsx";
import logo from "./images/sword-vertical-symmetrical-words8.png";

class App extends Component {
  state = {
    makeListShort: true, //dev switch
    showHelpMenu: false,
    showGearMenu: false,
    eggshellDepressed: "rgb(211, 255, 144)",
    offWhite: "#fbfbfb",
    shouldButtonBeActiveClass: {
      y: false,
      n: false,
      u: false,
    },
    depressionTimeout: 80,
    filename: "",
    hoverColor: { n: "#0000e6", y: "#0000e6" },
    userIsOnMobile: false,
    mobileListEditingMode: false,
    whichListToMakeFlashRightNow: null,
    invisibleTextarea: "",
    showConfigMenu: false,
    showUploadMenu: false,
    fontsizeOfBigtextBasedOnWhetherOverflowing: "8.35vh",
    paddingOfBigtextboxBasedOnWhetherOverflowing: "0.5px", // Deliberately 0.5 and not 0, as the 0.5 is unique to mounting, so can avoid endless loop in CDU for overflown check.
    colorOfBigtextBasedAsOverflowcheckFudge: "black",
    separator: "\n",
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
      this.wipeAppState();
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
      userIsOnMobile,
    } = this.state;
    let pressButtonColor = this.pressButtonColor;

    document.onkeyup = function (event) {
      event.preventDefault();
      if (!(showConfigMenu || showUploadMenu || userIsOnMobile)) {
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
        .join(this.formatSeparatorFromState()),
    });

    setTimeout(() => {
      let el = document.getElementById("invisibleTextarea");
      el.select();
      el.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");
    }, 500);
  };

  formatSeparatorFromState = () => {
    let arr = this.state.separator.split("");
    let splittr = "";

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== "\\") {
        splittr = splittr.concat(arr[i]);
      } else {
        if (arr[i + 1] === "t") {
          splittr = splittr.concat("\t");
        } else if (arr[i + 1] === "s") {
          splittr = splittr.concat(" ");
        } else if (arr[i + 1] === "n") {
          splittr = splittr.concat("\n");
        } else {
          splittr = splittr.concat("\\");
          splittr = splittr.concat(arr[i + 1]);
        }
        i++;
      }
    }
    return splittr;
  };

  downloadList = (labelWord) => {
    let stringFromWordArray = this.state.list[
      `${labelWord[0].toLowerCase()}List`
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
      random = Math.floor(Math.random() * 3); //screw
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
              z={this.state.z}
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
              userIsOnMobile={this.state.userIsOnMobile}
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
                  ? `Yes: ${this.state.list.yList.length} - No: ${this.state.list.nList.length}`
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
                    this.startAgain();
                  }}
                  id="Start Again"
                  className={`${styles.tinyButton} ${styles.startagainButton}`}
                >
                  Start again
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
            {!this.state.userIsOnMobile &&
              ["y", "n"].map((label) => {
                return (
                  <button
                    style={{
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
                    className={`


                    ${
                      this.state.shouldButtonBeActiveClass[label] &&
                      styles.fancyButton_active
                    } 

                    ${
                      this.state.shouldButtonBeActiveClass[label] &&
                      label === "y" &&
                      styles.yButton_active
                    } 

                    ${
                      this.state.shouldButtonBeActiveClass[label] &&
                      label === "n" &&
                      styles.nButton_active
                    } 

                



                    ${styles.fancyButton}
                    ${styles.button} ${
                      label === "y" ? styles.yButton : styles.nButton
                    }
                    
                    
                    `}
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
                          !this.state.userIsOnMobile ||
                          (this.state.userIsOnMobile &&
                            this.state.mobileListEditingMode)
                        ) {
                          this.switchToColumn(
                            `${label === "y" ? "n" : "y"}List`,
                            word
                          );
                        }
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
                key={`Download And Copy ${labelWord[0].toLowerCase()}Holder`}
                className={styles.copyAndDLButtonsHolder}
              >
                <button
                  style={{
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  key={`Copy ${labelWord[0].toLowerCase()}List`}
                  id={`Copy ${labelWord[0].toLowerCase()}List`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.copyList(labelWord);
                  }}
                  className={`${styles.fancyButton} ${
                    styles.littleHalfButton
                  } ${styles.topslice} ${
                    labelWord === "Yes"
                      ? styles.yListButton
                      : styles.nListButton
                  }
                  
                  
                  
                  `}
                >
                  Copy {labelWord}-List
                </button>

                <button
                  style={{
                    pointerEvents:
                      (this.state.showConfigMenu ||
                        this.state.showUploadMenu) &&
                      "none",
                  }}
                  key={`Download ${labelWord[0].toLowerCase()}List`}
                  id={`Download ${labelWord[0].toLowerCase()}List`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.downloadList(labelWord);
                  }}
                  className={`${styles.fancyButton}
                  
                  ${styles.littleHalfButton} ${styles.bottomslice} ${
                    labelWord === "Yes"
                      ? styles.yListButton
                      : styles.nListButton
                  }`}
                >
                  Download
                </button>
              </div>
            );
          })}

          <button
            id="uButton"
            style={{
              zIndex: this.state.z.u,
              pointerEvents:
                (this.state.showConfigMenu || this.state.showUploadMenu) &&
                "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              this.undo();
            }}
            className={`  ${styles.fancyButton} 
            
            ${
              this.state.shouldButtonBeActiveClass["u"] &&
              styles.fancyButton_active
            } 
            
            
            ${styles.littleButton} ${styles.uButton}`}
          >
            {this.state.userIsOnMobile
              ? "Undo"
              : `Undo ( ${keys[this.state.triggers.current.u.code] || ""} )`}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
