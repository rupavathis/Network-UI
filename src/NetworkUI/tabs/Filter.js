import React from 'react';
import { useEffect, useState } from "react";
import '../Network.scss';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

function Filter({ nodes, setNodes }) {
    useEffect(() => { fetchFilters(); fetchNodeData() }, [])


    const [attribs, setAttribs] = useState([])
    const [rDesignations, setRDesignations] = useState([])
    const [genders, setGenders] = useState([])
    const [roles, setRoles] = useState([])
    const [rOrders, setROrders] = useState([])


    const [selectedAttribs, setSelectedAttribs] = useState([])
    const [selectedRDesignations, setSelectedRDesignations] = useState([])
    const [selectedGenders, setSelectedGenders] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    const [selectedROrders, setSelectedROrders] = useState([])

    const [nodeData, setNodeData] = useState([]);


    async function fetchFilters() {
        const res = await fetch("/genders");
        const gendersJson = await res.json();
        setGenders(gendersJson);
        const rolesRes = await fetch("/roles");
        const rolesJson = await rolesRes.json();
        setRoles(rolesJson);
        const attribsRes = await fetch("/attribs");
        const attribsJson = await attribsRes.json();
        setAttribs(attribsJson);
        const rDesignationRes = await fetch("/religious_designations");
        const rDesignationJson = await rDesignationRes.json();
        setRDesignations(rDesignationJson);
        const rOrderRes = await fetch("/religious_orders");
        const rOrderJson = await rOrderRes.json();
        setROrders(rOrderJson);
    }

    async function fetchNodeData() {
        if (nodes != null) {
            const nodeIds = nodes.map((n) => n.people_id)
            const res = await fetch(`/filterData/${nodeIds}`);
            const peopleJson = await res.json();
            setNodeData(peopleJson);
            console.log({ peopleJson })
        }
    }


    const filterNodes = () => {
        let filteredNodes = []
        console.log({ nodes, nodeData })
        let count = 0;

        let filterAttribs = []
        let filterRDesignations = []
        let filterGenders = []
        let filterROrder = []
        if (selectedAttribs.length != 0) {
            filterAttribs = nodeData.filter((n) => n.attribs.some(b => b.id === selectedAttribs))
            count++;
        }

        if (selectedGenders.length != 0) {
            filterGenders = nodeData.filter((n) => n.gender.id === selectedGenders)
            count++;
        }

        if (selectedRoles.length != 0) {
            console.log({selectedRoles})
            count++;
        }

        if (selectedROrders.length != 0) {
            filterROrder = nodeData.filter((n) => n.religious_order_id === selectedROrders)
            count++;
        }

        if (selectedRDesignations.length != 0) {
            filterRDesignations = nodeData.filter((n) =>
                n.religious_designations.some(b => b.id === selectedRDesignations))
            count++;
        }

        const filteredNodes1 = nodes.filter(a => filterAttribs.some(b => a.id === b.name))
        const filteredNodes2 = nodes.filter(a => filterGenders.some(b => a.id === b.name))
        const filteredNodes3 = nodes.filter(a => filterRDesignations.some(b => a.id === b.name));
        const filteredNodes4 = nodes.filter(a => filterROrder.some(b => a.id === b.name));

        console.log({ filteredNodes1, filteredNodes2, filteredNodes3, filteredNodes4 })
        // Flat filtered nodes
        const flatNodes = [...filteredNodes1, ...filteredNodes2, ...filteredNodes3, ...filteredNodes4]
        flatNodes.flat()
        // Get the count of duplicate nodes
        const countedNodes = flatNodes.reduce((allNames, name) => {
            const currCount = allNames[name.people_id] ?? 0;
            return {
                ...allNames,
                [name.people_id]: currCount + 1,
            };
        }, {});

        // Check if the nodes filtered satisfy all selected filter conditions 
        let a = []
        Object.entries(countedNodes).forEach(([key, value]) => {
            if (value === count) {
                a = [...a, parseInt(key)]
            }
        })

        filteredNodes = nodes.filter((e) => a.includes(e.people_id))
        nodes.map((n) => {
            if (filteredNodes.includes(n)) {
                return (n.nodeVal = 2, n.strokeColor = "black", n.strokeWidth = 3)
            }
            else return (n.nodeVal, n.strokeColor = "none", n.strokeWidth = 0)
        })
        console.log({ filteredNodes })
        setNodes([...nodes])
    }


    return (
        <div className='tab-wrapper'>
            {[{
                "name": "Gender",
                "args": genders,
                "func": setSelectedGenders
            },
            {
                "name": "Roles",
                "args": roles,
                "func": setSelectedRoles

            },
            {
                "name": "Attributes",
                "args": attribs,
                "func": setSelectedAttribs

            },
            {
                "name": "Religious Order",
                "args": rOrders,
                "func": setSelectedROrders

            },
            {
                "name": "Religious Designation",
                "args": rDesignations,
                "func": setSelectedRDesignations
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

export default Filter;
