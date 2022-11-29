import React, { useState, useEffect } from "react";
import { v4 } from 'uuid';
import { Crumb } from "./components/Crumb";
import styles from './styles.module.scss';

function App() {
  const [currentPath, setCurrentPath] = useState(['home']);
  const [crumbs, setCrumbs] = useState();
  const [contents, setContents] = useState();
  const [animateLastCrumb, setAnimateLastCrumb] = useState(true);

  useEffect(() => { fetchCrumbs(currentPath) }, [currentPath]);

  const fetchCrumbs = async (path) => {
    const pathFormatted = path.map(locationName => locationName).join('/');
    const response = await fetch(`https://breadcrumbs-backend.herokuapp.com/path/${pathFormatted}`, { method: 'GET' }).then(res => res.json());
    // const response = await fetch(`http://localhost:8080/path/${pathFormatted}`, { method: 'GET' }).then(res => res.json()); // local testing
    const crumbs = response.path.map(location => ({ locationName: location, crumbId: v4() }))
    setCrumbs(crumbs);
    setContents(response.contents);
  }
  
  const renderContents = () => {
    switch (contents?.type) {
      case 'file': {
        return <span>{`THIS IS FILE : ${contents.message}`}</span>;
      }
      case 'dir': {
        return contents.message.map((locationName) => <Crumb type="content" key={locationName + '-content'} locationName={locationName} onClick={onLocationChange} />);
      }
    }
  }

  const onLocationChange = (locationName, crumbType, crumbId) => {
    switch (crumbType) {
      case 'navigation': {
        const crumbIndex = crumbs.findIndex(crumb => crumb.crumbId === crumbId);
        const newPath = crumbs.slice(0, crumbIndex + 1).map(crumb => crumb.locationName);
        setAnimateLastCrumb(false);
        setCurrentPath(newPath);
        break;
      }
      case 'content': {
        setAnimateLastCrumb(true);
        setCurrentPath([...currentPath, locationName]);
        break;
      }
      default : {
        break;
      }
    }
  }

  return (crumbs ?
    <div className={styles.app}>
      <div className={styles.navigation + (animateLastCrumb ? ` ${styles.animate}` : '')}>{
        crumbs.map(({ locationName, crumbId }) => <Crumb type="navigation" key={crumbId} id={crumbId} locationName={locationName} onClick={onLocationChange} />)}
      </div>
      <div className={styles.contents}>{renderContents()}</div>
    </div> : '/'
  );
}

export default App;
