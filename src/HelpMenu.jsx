import React from "react";
import styles from "./css/HelpMenu.module.css";

const HelpMenu = (props) => {
  return (
    <div className={styles.configMenuHolder}>
      <div className={styles.superConfigOptionsHolder}>
        <div className={styles.headingHolder}>
          <div className={styles.xGhost}></div>
          <h1 className={styles.heading}>HELP MENU</h1>
          <button
            id="Quit Menu"
            onClick={(e) => {
              e.preventDefault();
              props.setAppState({ showHelpMenu: false });
            }}
            className={styles.configX}
          >
            <span role="img" aria-label="Red X">
              ❌
            </span>
          </button>
        </div>
        <p className={styles.text}>
          SortCut lets you <b>upload, sort, and download</b> any list you want.
          <br /> <br />
          You can copy and paste your list as raw text, or upload a .txt file.
          Click the <b>Upload List </b> button at the top left.
          <br /> <br />
          Then get sorting! The app shows items one at a time, and you hit the
          big colourful buttons to lob them into the <b>Yes or No lists</b>. If
          you're on on a computer, you'll see keyboard shortcuts in brackets, so
          you can do it mouseless! For maximum comfort, set your own{" "}
          <b>keyboard shortcuts</b> using the <b>Set Keys</b> button at the
          bottom left.
          <br /> <br />
          If you're on a phone, just tap the lists themselves to sort items. If
          you're on a large touchscreen device but this isn't happening, enable
          this in the settings (gear icon).
          <br /> <br />
          Enjoy!
        </p>
      </div>
    </div>
  );
};

export default HelpMenu;
