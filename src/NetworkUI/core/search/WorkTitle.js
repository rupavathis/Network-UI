/* eslint-disable no-use-before-define */
import React from 'react';
import { useEffect, useState, useMemo } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import '../../Network.scss';

export default function SearchTitle({ workNetworkData, setWorkNetworkData, setSelectContent }) {

    const [displayTitles, setDisplayTitles] = useState([]);
    const [workClassifications, setWorkClassifications] = useState([]);

    useEffect(() => { fetchWorkTitles();
    console.log("In search title") }, [])

    async function fetchWorkTitles() {
        const worksRes = await fetch("/titles");
        const worksJson = await worksRes.json();
        setDisplayTitles(worksJson);
        console.log({ worksJson })
        const workClassicationsRes = await fetch("/work_classifications");
        const workClassicationsJson = await workClassicationsRes.json();
        setWorkClassifications(workClassicationsJson)
    }

    async function fetchWorkNetWorkData(value) {
        if (value != null) {
            let url = `showWorkTitleConnections/${value.id}`;
            console.log(url)
            const worksRes = await fetch(url);
            const worksJson = await worksRes.json();
            setWorkNetworkData(worksJson);
            console.log("workNetworkData in Search", worksJson)
        }
        setSelectContent(1)
    }

    async function fetchWorkClassificationData(value) {
        if (value != null) {
            let url = `advancedWorkSearch?wClassification=${value.id}`;
            console.log(url)
            const worksRes = await fetch(url);
            const worksJson = await worksRes.json();
            setWorkNetworkData(worksJson);
            console.log("workNetworkData in Search", worksJson)
        }
        setSelectContent(1)
    }

    return (
        <div className='searchTitle-wrapper'>        
            <Autocomplete
                options={displayTitles}
                getOptionLabel={(option) => ` ${option.id} ${option.display_title}` || ""}
                id="auto-complete"
                autoComplete
                includeInputInList
                renderInput={(params) => (
                    <TextField {...params} label="Works Title" variant="standard" />
                )}
                onChange={(event, value) =>  fetchWorkNetWorkData(value) }
            />
            <div>or</div>
            <Autocomplete
                options={workClassifications}
                getOptionLabel={(option) => ` ${option.name}` || ""}
                id="auto-complete"
                autoComplete
                includeInputInList
                renderInput={(params) => (
                    <TextField {...params} label="Work Classifications" variant="standard" />
                )}
                onChange={(event, value) => fetchWorkClassificationData(value)}
            />
        </div>
    );
}
