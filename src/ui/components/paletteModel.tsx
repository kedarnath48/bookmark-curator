import styles from "./paletteModel.module.css";

const PaletteModel = () => {

  const historyItems = [
    {
      name: "",
      icon: "",
      shortcut: ""
    }
  ]
  const searchItems = [
    {
      name: "",
      icon: "",
      shortcut: ""
    }
  ]
  return (
    <div style={{ width: "400px" }}>
      <div className={styles.inputContainer}>
        <input type="text" placeholder="Search for commands" />
      </div>
      <div className="palette-options">
        <ol className={`${styles.optionsContainer} ${styles.top} `}>
          <li className={`${styles.item}`}>
            <span className={`${styles.cmdTypeIcon} icon`}>icon</span>
            <span className={styles.cmdName}>Frame selection</span>
            <div className="cmdhint">
              <span className="txt">SHIFT</span>
              +
              <span className="txt">CTRL</span>
              +
              <span className="txt">F</span>
            </div>
          </li>
          <li className={`${styles.item}`}>
            <span className={`${styles.cmdTypeIcon} icon`}>icon</span>
            <span className={styles.cmdName}>Unlock all layers</span>
          </li>
        </ol>
        <ol className={`${styles.optionsContainer}`}>
          <li className={`${styles.item}`}>
            <span className={`${styles.cmdTypeIcon} icon`}>icon</span>
            <span className={styles.cmdName}>Run the last plugin</span>
            <div className="cmdhint">
              <span className="txt">CTRL</span>
              +
              <span className="txt">E</span>
            </div>
          </li>
          <li className={`${styles.item}`}>
            <span className={`${styles.cmdTypeIcon} icon`}>icon</span>
            <span className={styles.cmdName}>Show all activity</span>
          </li>
          <li className={`${styles.item}`}>
            <span className={`${styles.cmdTypeIcon} icon`}>icon</span>
            <span className={styles.cmdName}>Rename all the layers</span>
            <div className="cmdhint">
              <span className="txt">CTRL</span>
              +
              <span className="txt">R</span>
            </div>
          </li>
          <li className={`${styles.item}`}>
            <span className={`${styles.cmdTypeIcon} icon`}>icon</span>
            <span className={styles.cmdName}>Show unread comments</span>
          </li>
          <li className={`${styles.item}`}>
            <span className={`${styles.cmdTypeIcon} icon`}>icon</span>
            <span className={styles.cmdName}>Create New page</span>
            <div className="cmdhint">
              <span className="txt">CTRL</span>
              +
              <span className="txt">N</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default PaletteModel;







