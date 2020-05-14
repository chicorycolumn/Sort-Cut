import styles from "./css/App.module.css";
import React, { Component } from "react";
import clippy from "./images/clippy.png";
import { keys } from "./utils.js";
import words from "./words.txt";

class App extends Component {
  state = {
    i: 0,
    list: {
      yList: [],
      nList: [],
      wordlist: [
        "alligator",
        "bear",
        "cat",
        "dog",
        "elephant",
        "fox",
        "goat",
        "horse",
        "iguana",
        "jackrabbit",
        "kangfaroo",
        "lemur",
        "moray eel",
        "narhwal",
        "orangutan",
        "pangolin",
        "quietus",
        "ram",
        "snake",
      ],
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
    showConfigOverlay: false,
    configText: [
      [
        "Bonjour! Je suis Monsieur Clippe, and I will aide vous to configure les boutons. Press any touche to continue.",
        "Alors, first please press the touche, ah, I mean the key, that you want to mean OUI.",
        "Très bien! Now please choisir the key to mean NON.",
        "Et finalment, which touche voulez-vous for the bouton défaire? Ah, pardon! Je vais dire the UNDO button.",
        "Bien joué, et au revoir!",
        "Merci!",
        "D'accord",
      ],
      [
        "Guten tag! Ich bin Herr Klip, and I will help you zu konfigurieren the buttons. Drücken Sie any key to continue.",
        "Lasst uns beginnen! First please drücken, ah, I mean press - the key that you want to mean JA.",
        "Fantastisch! Und jetzt please choose the Taste to mean NEIN.",
        "Und endlich, which Taste do you want as the Rückgängig? Ach, entschuldige! Ich meine the UNDO button.",
        "Gut gemacht, und auf Wiedersehen!",
        "Danke!",
        "Gut",
      ],
      [
        "Hola! Yo soy Señor Clipedro, and I will help you configurar los botones. Press any tecla to continue.",
        "Pues, to start please press the tecla, ay, quiero decir the key, that you want to mean SÍ.",
        "Genial! Ahora please elige the key to mean NO.",
        "Y al fin, which tecla quieres for the botón deshacer? Aj, disculpe! Eso es the UNDO button.",
        "Bien hecho, y adios!",
        "Gracias!",
        "Vale",
      ],
    ],
    configLang: 0,
    configIterator: 0,
  };

  componentDidMount() {
    this.setState((currState) => {
      let newState = { colors: currState.colors };
      Object.keys(newState.colors.display).forEach((key) => {
        newState.colors.display[key] = currState.colors.reference[key];
      });

      if (currState.list.wordlist.length) {
        newState.list = currState.list;
        newState.list.wordlistBackup = currState.list.wordlist.slice(0);
      }

      return newState;
    });
    this.keepListening();
  }

  componentDidUpdate() {
    let configureKeys = this.configureKeys;
    if (this.state.showConfigOverlay) {
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
    let { showConfigOverlay, triggers } = this.state;
    let pressButtonColor = this.pressButtonColor;

    document.onkeyup = function (event) {
      if (!showConfigOverlay) {
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

  saveConfigAndExitMenu = () => {
    let { triggers } = this.state;

    Object.keys(triggers.backup).forEach((t) => {
      triggers.backup[t] = triggers.current[t];
    });

    this.setState({
      triggers,
      configIterator: 0,
      showConfigOverlay: false,
      z: { y: 0, n: 0, u: 0 },
    });

    setTimeout(this.keepListening, 100);
  };

  configureKeys = (event) => {
    event.preventDefault();
    let i = this.state.configIterator;

    if (i === 0) {
      this.setState((currState) => {
        let newState = {};
        newState.triggers = currState.triggers;
        newState.triggers.current = { y: {}, n: {}, u: {} };
        return newState;
      });
    }

    let which = event.which;
    let code = event.keyCode;

    if (i >= 4) {
      this.saveConfigAndExitMenu();
    } else if (
      Object.keys(this.state.triggers.current).every((key) =>
        Object.values(this.state.triggers.current[key]).every(
          (val) => val !== which && val !== code
        )
      )
    ) {
      let newState = {
        triggers: this.state.triggers,
        z: this.state.z,
      };
      newState["configIterator"] = i + 1;

      if (i === 0) {
        newState.z.y = 2;
      } else if (i === 1) {
        newState.z.n = 2;
        newState.triggers.current.y = { which, code };
      } else if (i === 2) {
        newState.z.u = 2;
        newState.triggers.current.n = { which, code };
      } else if (i === 3) {
        newState.triggers.current.u = { which, code };
      }
      this.setState(newState);
    }
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
    this.setState({
      showConfigOverlay: true,
      configLang: Math.floor(Math.random() * this.state.configText.length),
      configIterator: 0,
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

  quitConfig = () => {
    let { triggers } = this.state;

    let newState = {
      showConfigOverlay: false,
      triggers,
      z: { y: 0, n: 0, u: 0 },
    };
    newState.triggers.current = { y: {}, n: {}, u: {} };

    Object.keys(triggers.backup).forEach((triggerName) =>
      Object.keys(triggers.backup[triggerName]).forEach((codeType) => {
        newState.triggers.current[triggerName][codeType] =
          triggers.backup[triggerName][codeType];
      })
    );
    this.setState(newState);
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
    alert("upload a list");
  };

  render() {
    return (
      <div id="grossuberbox" className={styles.grossuberbox}>
        <a href={words} target="_blank">
          Visit W3Schools.com!
        </a>
        {this.state.showConfigOverlay ? (
          <>
            <div className={styles.obscurus}></div>

            <div className={styles.superConfigOptionsHolder}>
              <div className={styles.configOptionsHolder}>
                <img
                  className={styles.clippy}
                  src={clippy}
                  alt="paperclip cartoon character"
                />
                <div className={styles.configTextHolder}>
                  <p className={styles.configText}>
                    {
                      this.state.configText[this.state.configLang][
                        this.state.configIterator
                      ]
                    }
                  </p>
                  {this.state.configIterator === 0 && (
                    <button
                      id="Initial OK"
                      onClick={(e) => {
                        e.preventDefault();
                        this.configureKeys(e);
                      }}
                      className={`${styles.configOK} ${styles.OKnomargin}`}
                    >
                      {this.state.configText[this.state.configLang][6]}
                    </button>
                  )}
                  {this.state.configIterator === 4 && (
                    <button
                      id="Final OK"
                      onClick={(e) => {
                        e.preventDefault();
                        this.saveConfigAndExitMenu();
                      }}
                      className={`${styles.configOK} ${styles.OKmargin}`}
                    >
                      {this.state.configText[this.state.configLang][5]}
                    </button>
                  )}
                </div>
              </div>
              {this.state.configIterator !== 4 && (
                <button
                  id="Quit Menu"
                  onClick={(e) => {
                    e.preventDefault();
                    this.quitConfig();
                  }}
                  className={styles.configX}
                >
                  <span role="img" aria-label="Red X">
                    ❌
                  </span>
                </button>
              )}
            </div>
          </>
        ) : (
          ""
        )}

        <div className={styles.uberbox}>
          <div className={styles.bigwordbox}>
            <div className={styles.tinyButtonHolder}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  this.uploadList();
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
                  className={`${styles.list} ${
                    label === "y" ? styles.yList : styles.nList
                  }`}
                >
                  {this.state.list[`${label}List`].map((x) => (
                    <p
                      onClick={(e) => {
                        e.preventDefault();
                        this.switchToColumn(
                          `${label === "y" ? "n" : "y"}List`,
                          x
                        );
                      }}
                      className={styles.wordinlist}
                    >
                      {x}
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
