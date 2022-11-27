import React, { useState, useEffect } from "react";
import { Crumb } from "./components/Crumb";
import styles from './styles.module.scss';

function App() {
  const [currentPath, setCurrentPath] = useState(['home']);
  const [crumbs, setCrumbs] = useState();

  useEffect(() => { fetchCrumbs(currentPath) }, [currentPath]);

  const fetchCrumbs = async (path) => {
    const pathFormatted = path.map(locationName => locationName).join('/');
    const response = await fetch(`https://breadcrumbs-backend.herokuapp.com/path/${pathFormatted}`, { method: 'GET' }).then(res => res.json());
    setCrumbs(response);
  }

  const renderContents = () => {
    switch (crumbs.contents?.type) {
      case 'file': {
        return <span>{`THIS IS FILE : ${crumbs.contents.message}`}</span>;
      }
      case 'dir': {
        return crumbs.contents.message.map((locationName) => <Crumb key={locationName + '-content'} locationName={locationName} onClick={onLocationChange} />);
      }
    }
  }

  const onLocationChange = (locationName) => {
    if (currentPath.includes(locationName)) {
      const requestedLocationIndex = currentPath.indexOf(locationName);
      setCurrentPath(currentPath.slice(0, requestedLocationIndex + 1));
    } else {
      setCurrentPath([...currentPath, locationName]);
    }
  }

  return (crumbs ?
    <div className={styles.app}>
      <div className={styles.navigation}>{
        crumbs.path.map((locationName) => <Crumb displayType={'navigation'} key={locationName + '-nav'} locationName={locationName} onClick={onLocationChange} />)}
      </div>
      <div className={styles.contents}>{renderContents()}</div>
    </div> : '/'
  );
}

export default App;
