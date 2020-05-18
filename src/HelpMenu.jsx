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
          SortCut is a nifty app to help you <b>sort any list</b> into two
          categories with rapidity and alacrity.
          <br /> <br />
          First, upload your list, either from a .txt file or just copying and
          pasting raw text into the box provided. The <b>Upload List </b> button
          is at the top left of the screen.
          <br /> <br />
          Remember to choose which <b>punctuation</b> your list items are
          separated by, so I know how to display your items. You'll see the
          instructions and examples in that menu.
          <br /> <br />
          Then get sorting! The app shows items one at a time, and you hit the
          big colourful buttons to lob them into the Yes or No lists. If you're
          on on a computer, you'll see the keyboard shortcuts in brackets on
          those buttons. For maximal velocity, set your own{" "}
          <b>keyboard shortcuts</b>. using the <b>Set Keys</b> button at the
          bottom left of the screen.
          <br /> <br />
          If you're on a phone, just tap the lists to whang items into them. If
          you're on a large touchscreen device but this isn't happening, you can
          enable this in settings (gear icon).
          <br /> <br />
          Enjoy!
        </p>
      </div>
    </div>
  );
};

export default HelpMenu;
