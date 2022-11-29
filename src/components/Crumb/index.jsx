import styles from './crumb.module.scss';

function Crumb({ type, id, locationName, onClick }) {

    const onclickHandle = () => {
        onClick(locationName, type, id);
    }

    return <div className={styles.crumb + ' ' + (type === 'navigation' ? styles.nav : styles.content)} onClick={onclickHandle}>{locationName}</div>
}

export { Crumb }