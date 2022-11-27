import styles from './crumb.module.scss';

function Crumb({ displayType, locationName, onClick }) {

    const onclickHandle = () => {
        onClick(locationName);
    }

    return <div className={styles.crumb + ' ' + (displayType === 'navigation' ? styles.nav : styles.content)} onClick={onclickHandle}>{locationName}</div>
}

export { Crumb }