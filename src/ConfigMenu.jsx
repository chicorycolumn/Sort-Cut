import React, { Component } from "react";
import styles from "./css/ConfigMenu.module.css";
import menuStyles from "./css/Menu.module.css";
import clippy0 from "./images/clippy0.png";
import clippy1 from "./images/clippy1.png";
import clippy2 from "./images/clippy2.png";
import clippy3 from "./images/clippy3.png";
import clippy4 from "./images/clippy4.png";
import { configText } from "./utils.js";

class ConfigMenu extends Component {
  state = {
    showConfigMenu: null,
    clippy: [clippy0, clippy1, clippy2, clippy3, clippy4],
    configIterator: 0,
    cssTopPropertyOfMenuBasedOnRectTopOfBigwordbox: "75px",
  };

  componentDidMount() {
    this.props.setAppState({ configureKeys: this.configureKeys });
    this.setState({
      configIterator: 0,
      showConfigMenu: true,
    });
    document.getElementById("superConfigOptionsHolder").focus();

    let bwb = document.getElementById("bigwordbox");
    var rect = bwb.getBoundingClientRect();
    this.setState({
      cssTopPropertyOfMenuBasedOnRectTopOfBigwordbox: `${rect.top + 10}px`,
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
      zIndex: { yes: 0, no: 0, undo: 0 },
    });

    setTimeout(this.props.keepListening, 100);
  };

  quitConfig = () => {
    let { triggers } = this.props;

    let newStateForApp = {
      showConfigMenu: false,
      triggers,
      zIndex: { yes: 0, no: 0, undo: 0 },
    };
    newStateForApp.triggers.current = { yes: {}, no: {}, undo: {} };

    Object.keys(triggers.backup).forEach((triggerName) =>
      Object.keys(triggers.backup[triggerName]).forEach((codeType) => {
        newStateForApp.triggers.current[triggerName][codeType] =
          triggers.backup[triggerName][codeType];
      })
    );

    this.setState({ configIterator: 0, showConfigMenu: false });
    this.props.setAppState(newStateForApp);
  };

  configureKeys = (event, check) => {
    event.preventDefault();
    let i = this.state.configIterator;
    let code = event.key;
    if (i === 0) {
      let newState = {};
      newState.triggers = this.props.triggers;
      newState.triggers.current = { yes: {}, no: {}, undo: {} };
      this.props.setAppState(newState);
    }
    if (i >= 4) {
      this.saveConfigAndExitMenu();
    } else if (
      Object.keys(this.props.triggers.current).every((key) =>
        Object.values(this.props.triggers.current[key]).every(
          (val) => val !== code
        )
      )
    ) {
      let newState = {
        triggers: this.props.triggers,
        zIndex: this.props.zIndex,
      };

      if (i === 0) {
        newState.zIndex.yes = 2;
      } else if (i === 1) {
        newState.zIndex.no = 2;
        newState.triggers.current.yes = { code };
      } else if (i === 2) {
        newState.zIndex.undo = 2;
        newState.triggers.current.no = { code };
      } else if (i === 3) {
        newState.triggers.current.undo = { code };
      }
      this.setState({ configIterator: i + 1 });
      this.props.setAppState({ newState });
    }
  };

  render() {
    return (
      <div className={styles.configMenuHolder}>
        <div
          style={{
            top: this.state.cssTopPropertyOfMenuBasedOnRectTopOfBigwordbox,
          }}
          className={styles.superConfigOptionsHolder}
          id="superConfigOptionsHolder"
        >
          <div className={styles.configOptionsHolder}>
            <img
              className={styles.clippy}
              src={this.state.clippy[this.props.configLang]}
              alt="paperclip cartoon"
            />
            <div className={styles.configTextHolder}>
              <p className={styles.configText}>
                {configText[this.props.configLang][this.state.configIterator]}
              </p>
              {this.state.configIterator === 0 && (
                <button
                  id="Initial OK"
                  onClick={(e) => {
                    e.preventDefault();

                    if (this.state.showConfigMenu) {
                      this.configureKeys(e);
                    }
                  }}
                  className={`${styles.configOK} ${styles.OKnomargin}`}
                >
                  {configText[this.props.configLang][6]}
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
                  {configText[this.props.configLang][5]}
                </button>
              )}
            </div>
          </div>
          <button
            id="Quit Menu"
            onClick={(e) => {
              e.preventDefault();
              this.quitConfig();
            }}
            className={styles.configX}
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
    );
  }
}

export default ConfigMenu;
