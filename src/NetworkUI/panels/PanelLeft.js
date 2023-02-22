import React from 'react';
import { useEffect, useState } from "react";
import '../Network.scss';
import Search from '../tabs/Search';
import Filter from '../tabs/Filter';
import Setting from '../tabs/Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

function PanelLeft({ networkData, setNetworkData, setSelectedColor, setSelectedSize, selectedColor, setSelectedLabelSize,
    setShow3DText, show3DText, tab, setTab, setWorkNetworkData, setSelectContent, setDisplayNames, displayNames}) {
    library.add(fas)

    return (
        <div className='panel-left'>
            <div className='icons-wrapper'>
                <div className='icon-items' onClick={() => setTab((tab) => tab === "show-search" ? "hide-search" :
                    "show-search")}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <div className='icon-items' onClick={() => setTab((tab) => tab === "show-filter" ? "hide-filter" :
                    "show-filter")}>
                    <FontAwesomeIcon icon={["fas", "filter"]} />
                </div>
                <div className='icon-items' onClick={() => setTab((tab) => tab === "show-settings" ? "hide-settings" :
                    "show-settings")}>
                    <FontAwesomeIcon icon={["fas", "gear"]} />
                </div>
            </div>
            {tab === "show-search" && <Search setNetworkData={setNetworkData} setWorkNetworkData={setWorkNetworkData} 
            setSelectContent={setSelectContent} setDisplayNames={setDisplayNames} displayNames={displayNames}/>}
            {tab === "show-settings" && <Setting setSelectedColor={setSelectedColor}
                setSelectedSize={setSelectedSize} selectedColor={selectedColor}
                setSelectedLabelSize={setSelectedLabelSize} setShow3DText={setShow3DText} show3DText={show3DText} />}
        </div>
    )
}

export default PanelLeft;
