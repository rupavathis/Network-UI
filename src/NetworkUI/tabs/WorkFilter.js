import React from 'react';
import { useEffect, useState } from "react";
import '../Network.scss';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

function WorkFilter({ nodes, setNodes }) {
    useEffect(() => { fetchFilters(); fetchNodeData() }, [])


    const [languages, setLanguages] = useState([])
    const [places, setPlaces] = useState([])
    const [wClassifications, setWClassifications] = useState([])

    const [selectedlanguage, setSelectedLanguage] = useState([])
    const [selectedplace, setSelectedPlace] = useState([])
    const [selectedwClassification, setSelectedWClassification] = useState([])

    const [nodeData, setNodeData] = useState([]);


    async function fetchFilters() {
        const res = await fetch("/languages");
        const languagesJson = await res.json();
        setLanguages(languagesJson);
        const placesRes = await fetch("/places");
        const placesJson = await placesRes.json();
        setPlaces(placesJson);
        const workClassRes = await fetch("/work_classifications");
        const workClassJson = await workClassRes.json();
        setWClassifications(workClassJson); 
    }

    async function fetchNodeData() {
        if (nodes != null) {
            const nodeIds = nodes.map((n) => n.work_id)
            const res = await fetch(`/filterWorkData/${nodeIds}`);
            const worksJson = await res.json();
            setNodeData(worksJson);
            console.log({ worksJson })
        }
    }


    const filterNodes = () => {
        let filteredNodes = []
        console.log({ nodes, nodeData })
        let count = 0;

        let filterLanguages = []
        let filterPlaces = []
        let filterWClassifications = []
        
        if (selectedlanguage.length != 0) {
            filterLanguages = nodeData.filter((n) => n.languages.some(b => b.id === selectedlanguage))
            console.log({filterLanguages})
            count++;
        }

        if (selectedplace.length != 0) {
            filterPlaces = nodeData.filter((n) => n.places.some(b => b.id === selectedplace))
            console.log({filterPlaces, selectedplace})
            count++;
        }

        if (selectedwClassification.length != 0) {
            filterWClassifications = nodeData.filter((n) => n.work_classification.some(b => b.id === selectedwClassification))
            console.log({filterWClassifications, selectedwClassification})
            count++;
        }

        const filteredNodes1 = nodes.filter(a => filterLanguages.some(b => a.id === b.display_title))
        const filteredNodes2 = nodes.filter(a => filterPlaces.some(b => a.id === b.display_title))
        const filteredNodes3 = nodes.filter(a => filterWClassifications.some(b => a.id === b.display_title));

        console.log({ filteredNodes1, filteredNodes2, filteredNodes3 })

        // Flat filtered nodes
        const flatNodes = [...filteredNodes1, ...filteredNodes2, ...filteredNodes3]
        flatNodes.flat()

        // // Get the count of duplicate nodes
        const countedNodes = flatNodes.reduce((allNames, name) => {
            const currCount = allNames[name.id] ?? 0;
            return {
                ...allNames,
                [name.id]: currCount + 1,
            };
        }, {});

        console.log({countedNodes})
        // Check if the nodes filtered satisfy all selected filter conditions 
        let a = []
        Object.entries(countedNodes).forEach(([key, value]) => {
            if (value === count) {
                a = [...a, key]
            }
        })

        console.log({a})
        filteredNodes = nodes.filter((e) => a.includes(e.id))
        nodes.map((n) => {
            if (filteredNodes.includes(n)) {
                return (n.size = 400, n.strokeColor = "black", n.strokeWidth = 3)
            }
            else return (n.size, n.strokeColor = "none", n.strokeWidth = 0)
        })
        console.log({ filteredNodes })
        setNodes([...nodes])
    }


    return (
        <div className='tab-wrapper'>
            {[{
                "name": "Language",
                "args": languages,
                "func": setSelectedLanguage
            },
            {
                "name": "Place",
                "args": places,
                "func": setSelectedPlace

            },
            {
                "name": "Work Classification",
                "args": wClassifications,
                "func": setSelectedWClassification

            }].map((f) =>
                <Autocomplete
                    options={f.args}
                    getOptionLabel={(option) => ` ${option.name}` || ""}
                    id="auto-complete-filter"
                    autoComplete
                    includeInputInList
                    renderInput={(params) => (
                        <TextField {...params} label={f.name} variant="standard" />
                    )}
                    onChange={(event, value) => { value === null ? f.func("") : f.func(value.id) }}
                />)}
            <Button className='filter-button' variant="outlined" onClick={() => filterNodes()}>Filter/Highlight</Button>
        </div>


    )
}

export default WorkFilter;
