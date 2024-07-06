import styles from "./Loading.module.css";


export const ContentLoading = () => {
  return <div className={styles.contentFrame} >
    <div className={styles.loader} />
  </div>;
};
