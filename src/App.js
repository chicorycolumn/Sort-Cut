import styles from "./css/App.module.css";
import React, { Component } from "react";
import clippy from "./images/clippy.png";

class App extends Component {
  state = {
    wordlist: [
      "apple",
      "banana",
      "churry",
      "date",
      "effeg",
      "fugg",
      "hello",
      "imogen",
      "apple",
      "banana",
      "churry",
      "date",
      "effeg",
      "fugg",
      "hello",
      "imogen",
      "apple",
      "banana",
      "churry",
      "date",
      "effeg",
      "fugg",
      "hello",
      "imogen",
    ],
    i: 0,
    badlist: [],
    goodlist: [],
    yesTrigger: { which: 190, code: 190 },
    noTrigger: { which: 191, code: 191 },
    ycolorReference: "chartreuse",
    ncolorReference: "#e60000",
    ycolorDepressed: "#59b300",
    ncolorDepressed: "#990000",
    ycolor: "chartreuse",
    ncolor: "#e60000",
    mostRecentAction: { word: null, origin: null, destination: null },
    showConfigOverlay: false,
    configText: [
      "Bonjour! Je suis Monsieur Clippe, and I will aide vous through the configuration of les boutons. Press any touche to continue.",
      "Alors, first please press the touche, ah, I mean the key, that you want to mean OUI.",
      "Très bien! Now please choisir the key to mean NON.",
      "Et finalment, which touche voulez-vous for the bouton défaire? Ah, pardon! Je vais dire the UNDO button.",
      "Bien joué, et au revoir!",
    ],
  };

  componentDidMount() {
    let yesTrigger = this.state.yesTrigger;
    let noTrigger = this.state.noTrigger;

    const pressButtonColor = (key) => {
      let tempState = {};
      tempState[key] = this.state[`${key}Depressed`];
      this.setState(tempState);
      setTimeout(() => {
        let revertingState = {};
        revertingState[key] = this.state[`${key}Reference`];
        console.log(revertingState);
        this.setState(revertingState);
      }, 60);
    };

    document.onkeyup = function (event) {
      let which = event.which;
      let code = event.keyCode;
      console.log(which, code);
      if (which === yesTrigger.which || code === yesTrigger.code) {
        document.getElementById("ybutton").click();
        pressButtonColor("ycolor");
      } else if (which === noTrigger.which || code === noTrigger.code) {
        document.getElementById("nbutton").click();
        pressButtonColor("ncolor");
      }
    };
  }

  switchToColumn = (destination, word) => {
    this.setState((currState) => {
      let goodlist = null;
      let badlist = null;
      if (destination === "badlist") {
        goodlist = currState.goodlist.filter((x) => x !== word);
        badlist = currState.badlist.slice(0);
        badlist.push(word);
      } else if (destination === "goodlist") {
        badlist = currState.badlist.filter((x) => x !== word);
        goodlist = currState.goodlist.slice(0);
        goodlist.push(word);
      }
      return {
        goodlist,
        badlist,
        mostRecentAction: {
          word,
          destination,
          origin: destination === "goodlist" ? "badlist" : "goodlist",
        },
      };
    });
    this.updateScroll(destination);
  };

  configKeys = (x) => {
    this.setState({ showConfigOverlay: true });
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
      console.log(word, destination);
      let redactedDestination = this.state[destination].filter(
        (x) => x !== word
      );
      let revertedOrigin = this.state[origin].slice(0);
      if (origin === "wordlist") {
        revertedOrigin.unshift(word);
      } else {
        revertedOrigin.push(word);
      }
      let newState = {};
      newState[origin] = revertedOrigin;
      newState[destination] = redactedDestination;
      newState.mostRecentAction = {};
      this.setState(newState);

      this.updateScroll(destination);
    }
  };

  render() {
    return (
      <div id="grossuberbox" className={styles.grossuberbox}>
        {this.state.showConfigOverlay ? (
          <>
            <div className={styles.obscurus}></div>
            <div className={styles.configOptionsHolder}>
              <img
                className={styles.clippy}
                src={clippy}
                alt="paperclip cartoon character"
              />
              <p className={styles.configText}>{this.state.configText[i]}</p>
            </div>
          </>
        ) : (
          ""
        )}

        <div className={styles.uberbox}>
          <div className={styles.bigwordbox}>
            {this.state.wordlist[this.state.i]}
          </div>

          <div className={styles.buttonbox}>
            <button
              style={{ backgroundColor: this.state.ycolor }}
              id="ybutton"
              onClick={(e) => {
                e.preventDefault();
                let destination = "goodlist";
                let newI = this.state.i + 1;
                let newgoodlist = this.state.goodlist;
                let word = this.state.wordlist[this.state.i];
                newgoodlist.push(word);
                this.setState({
                  i: newI,
                  goodlist: newgoodlist,
                  mostRecentAction: {
                    word,
                    destination,
                    origin: "wordlist",
                  },
                });
                this.updateScroll(destination);
              }}
              className={`${styles.button} ${styles.ybutton}`}
            >
              Y
            </button>
            <button
              style={{ backgroundColor: this.state.ncolor }}
              id="nbutton"
              onClick={(e) => {
                e.preventDefault();
                let destination = "badlist";
                let newI = this.state.i + 1;
                let newbadlist = this.state.badlist;
                let word = this.state.wordlist[this.state.i];
                newbadlist.push(word);
                this.setState({
                  i: newI,
                  badlist: newbadlist,
                  mostRecentAction: {
                    word,
                    destination,
                    origin: "wordlist",
                  },
                });
                this.updateScroll(destination);
              }}
              className={`${styles.button} ${styles.nbutton}`}
            >
              N
            </button>
          </div>
          <div className={styles.listContainer}>
            <div id="goodlist" className={`${styles.list} ${styles.goodlist}`}>
              {this.state.goodlist.map((x) => (
                <p
                  onClick={(e) => {
                    this.switchToColumn("badlist", x);
                  }}
                  className={styles.wordinlist}
                >
                  {x}
                </p>
              ))}
            </div>
            <div id="badlist" className={`${styles.list} ${styles.badlist}`}>
              {this.state.badlist.map((x) => (
                <p
                  onClick={(e) => {
                    this.switchToColumn("goodlist", x);
                  }}
                  className={styles.wordinlist}
                >
                  {x}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.littleButtonsContainer}>
          <button
            onClick={(e) => {
              console.log(e.target);
              this.configKeys(e);
            }}
            className={`${styles.littleButton} ${styles.configButton}`}
          >
            Set keys
          </button>

          <button
            onClick={(e) => {
              console.log("undo!");
              this.undo();
            }}
            className={`${styles.littleButton} ${styles.undoButton}`}
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}

export default App;
