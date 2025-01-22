import styles from "./Spinner.module.css";

function Spinner () {
    return (
        <div className={styles.container}>
            <span className={styles.loader}/>
        </div>
    )
}

export default Spinner;