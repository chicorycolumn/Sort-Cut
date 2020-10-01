import React from "react";
import styles from "./css/GearMenu.module.css";
import menuStyles from "./css/Menu.module.css";

const GearMenu = (props) => {
  return (
    <div className={styles.configMenuHolder}>
      <div className={styles.superConfigOptionsHolder}>
        <div className={styles.headingHolder}>
          <div className={styles.xGhost}></div>
          <h1 className={styles.heading}>OPTIONS</h1>
          <button
            id="Quit Menu"
            onClick={(e) => {
              e.preventDefault();
              props.setAppState({ showGearMenu: false });
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
        <button
          onClick={(e) => {
            e.preventDefault();
            props.setAppState({ isTouchscreen: !props.isTouchscreen });
          }}
          className={styles.uploadButton}
        >
          {props.isTouchscreen
            ? "Switch to desktop mode"
            : "Switch to touchscreen mode"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            window.open("mailto:c.matus.contact@gmail.com", "_blank");
          }}
          className={styles.uploadButton}
        >
          Submit feedback
        </button>
      </div>
    </div>
  );
};

export default GearMenu;
