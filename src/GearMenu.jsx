import React from "react";
import styles from "./css/GearMenu.module.css";

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
            <span role="img" aria-label="Red X">
              ❌
            </span>
          </button>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            props.setAppState({ userIsOnMobile: !props.userIsOnMobile });
          }}
          className={styles.uploadButton}
        >
          {props.userIsOnMobile
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
