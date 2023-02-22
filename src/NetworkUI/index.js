import React from 'react';
import { useEffect, useState } from "react";
import PanelLeft from './panels/PanelLeft';
import PanelRight from './panels/PanelRight'
import PanelContent from './panels/PanelContent';
import PanelTop from './panels/PanelTop';

function Network() {

  const [networkData, setNetworkData] = useState([]);
  const [workNetworkData, setWorkNetworkData] = useState([]);
  const [selectedColor, setSelectedColor] = useState({ node1: "#F30A23", node2: "#6547BB", node3: "#F30B12" })
  const [selectedSize, setSelectedSize] = useState({ node1: 2, node2: 1, node3: 1 })
  const [selectedLabelSize, setSelectedLabelSize] = useState({ node1: 50, node2: 50, node3: 50 })
  const [show3DText, setShow3DText] = useState(false);
  const [tab, setTab] = useState("")
  const [selectContent, setSelectContent] = React.useState(0);
  const [displayNames, setDisplayNames] = React.useState([]);

  const settings = [{ ...selectedColor }, { ...selectedSize }, { ...selectedLabelSize }, { show3DText }]

  return (
    <div className='network-wrapper'>
      <div className='core-wrapper'>
        <PanelLeft setNetworkData={setNetworkData} setWorkNetworkData={setWorkNetworkData} setSelectedColor={setSelectedColor}
          setSelectedSize={setSelectedSize} selectedColor={selectedColor} setSelectedLabelSize={setSelectedLabelSize}
          setShow3DText={setShow3DText} show3DText={show3DText}
          tab={tab} setTab={setTab} setSelectContent={setSelectContent} setDisplayNames={setDisplayNames}
          displayNames={displayNames} />
        <PanelTop />
        <PanelContent networkData={networkData} workNetworkData={workNetworkData} selectedColor={selectedColor} selectedSize={selectedSize}
          settings={settings} tab={tab} setTab={setTab} selectContent={selectContent} show3DText={show3DText} 
          displayNames={displayNames}/>
      </div>
    </div>
  )
}

export default Network;
