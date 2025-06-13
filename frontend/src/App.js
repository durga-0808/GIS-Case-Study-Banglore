import React, { useState } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';

function App() {
  const [treeData, setTreeData] = useState([]);
  const [schoolData, setSchoolData] = useState(0); 
  const [elevationData, setElevationData] = useState(null);

  return (
   <div style={styles.mainContainer}>
    <h1 style={{paddingLeft:"16px",paddingTop:"16px"}}>GIS CASE STUDY</h1>
     <div style={styles.container}>
      <div style={styles.mapContainer}>
        <MapView setTreeData={setTreeData} setSchoolData={setSchoolData} setElevationData={setElevationData} /> 
      </div>
      {
      (treeData.length>0 || schoolData !== 0  || elevationData !== null )? <div style={styles.sidebar}>
       <Sidebar treeData={treeData} schoolData={schoolData} elevationData={elevationData}/> 
     </div>:null
      }
    </div>
   </div>
  );
}


const styles = {
  mainContainer:{
    backgroundColor: "rgb(245,245,245)",
    marginTop:"-1.25rem"
   
  },
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
  },
  mapContainer: {
    flex: 4,
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: '20px',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
    overflowY: 'auto',
  },
};

export default App;
