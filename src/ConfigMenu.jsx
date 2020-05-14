import React, { Component } from "react";
import styles from "./css/ConfigMenu.module.css";
import clippy0 from "./images/clippy0.png";
import clippy1 from "./images/clippy1.png";
import clippy2 from "./images/clippy2.png";
import clippy3 from "./images/clippy3.png";
import clippy4 from "./images/clippy4.png";

class ConfigMenu extends Component {
  state = {
    clippy: [clippy0, clippy1, clippy2, clippy3, clippy4],
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
        "Fantastisch! Please choose the Taste you want to mean NEIN.",
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
    configIterator: 0,
  };

  componentDidMount() {
    this.props.setAppState({ configureKeys: this.configureKeys });
    this.setState({
      configIterator: 0,
    });
  }

  saveConfigAndExitMenu = () => {
    let { triggers } = this.props;

    Object.keys(triggers.backup).forEach((t) => {
      triggers.backup[t] = triggers.current[t];
    });

    this.setState({
      configIterator: 0,
    });

    this.props.setAppState({
      triggers,
      showConfigMenu: false,
      z: { y: 0, n: 0, u: 0 },
    });

    setTimeout(this.props.keepListening, 100);
  };

  quitConfig = () => {
    let { triggers } = this.props;

    let newState = {
      showConfigMenu: false,
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
    this.props.setAppState(newState);
    this.setState({ configIterator: 0 });
  };

  configureKeys = (event) => {
    event.preventDefault();
    let i = this.state.configIterator;

    if (i === 0) {
      let newState = {};
      newState.triggers = this.props.triggers;
      newState.triggers.current = { y: {}, n: {}, u: {} };
      this.props.setAppState(newState);
    }

    let which = event.which;
    let code = event.keyCode;

    if (i >= 4) {
      this.saveConfigAndExitMenu();
    } else if (
      Object.keys(this.props.triggers.current).every((key) =>
        Object.values(this.props.triggers.current[key]).every(
          (val) => val !== which && val !== code
        )
      )
    ) {
      let newState = {
        triggers: this.props.triggers,
        z: this.props.z,
      };

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
      this.setState({ configIterator: i + 1 });
      this.props.setAppState({ newState });
    }
  };

  render() {
    return (
      <div className={styles.configMenuHolder}>
        <div className={styles.superConfigOptionsHolder}>
          <div className={styles.configOptionsHolder}>
            <img
              className={styles.clippy}
              src={this.state.clippy[this.props.configLang]}
              alt="paperclip cartoon character"
            />
            <div className={styles.configTextHolder}>
              <p className={styles.configText}>
                {
                  this.state.configText[this.props.configLang][
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
                  {this.state.configText[this.props.configLang][6]}
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
                  {this.state.configText[this.props.configLang][5]}
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
      </div>
    );
  }
}

export default ConfigMenu;
