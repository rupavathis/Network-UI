/* eslint-disable no-use-before-define */
import React from 'react';
import { useEffect, useState, useMemo } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// import { Button } from 'bloomer/lib/elements/Button';
import Button from '@mui/material/Button';

export default function SearchWorkNetwork({ workNetworkData, setWorkNetworkData, setSelectContent}) {

    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState([]);

    const [patrons, setPatrons] = useState([]);
    const [selectedPatrons, setSelectedPatrons] = useState([]);
    const [printers, setPrinters] = useState([]);
    const [selectedPrinters, setSelectedPrinters] = useState([]);
    const [booksellers, setBooksellers] = useState([]);
    const [selectedBooksellers, setSelectedBooksellers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [selectedPublishers, setSelectedPublishers] = useState([]);

    useEffect(() => { fetchWorkTitles(); }, [])

    async function fetchWorkTitles() {
        const res = await fetch("/authorship_types");
        const peopleJson = await res.json();

        // const authors = unique(worksJson.map((m) => { return { id: m.author_id_id, display_name: m.author_id.display_name } }))
        // setAuthors(authors)

        // const patrons = unique(worksJson.reduce(
        //     (accumulator, currentValue) => [...accumulator, ...currentValue.patron_id],
        //     []))
        // setPatrons(patrons)
        // const booksellers = unique(worksJson.reduce(
        //     (accumulator, currentValue) => [...accumulator, ...currentValue.bookseller_id],
        //     []))
        // setBooksellers(booksellers)
        // const printers = unique(worksJson.reduce(
        //     (accumulator, currentValue) => [...accumulator, ...currentValue.printer_id],
        //     []))
        // setPrinters(printers)
        // const publishers = unique(worksJson.reduce(
        //     (accumulator, currentValue) => [...accumulator, ...currentValue.publisher_id],
        //     []))
        // setPublishers(publishers)

        setAuthors(peopleJson[0].people)
        setPrinters(peopleJson[1].people)
        setPublishers(peopleJson[2].people)
        setBooksellers(peopleJson[3].people)
        setPatrons(peopleJson[4].people)
    }

    // const unique = (arr) =>
    //     arr.reduce((a, name) => {
    //         if (!a.some(e => e.id === name.id)) {
    //             return [...a, name]
    //         }
    //         return a;
    //     }, [])


    async function searchPeople() {
        let url = `worksPeopleSearch?authors=${selectedAuthor}&patrons=${selectedPatrons}&
                printers=${selectedPrinters}&publishers=${selectedPublishers}&booksellers=${selectedBooksellers}`
        console.log(url)
        const worksRes = await fetch(url);
        const worksJson = await worksRes.json();
        setWorkNetworkData(worksJson);
        console.log("workNetworkData in Search", worksJson)
        setSelectContent(1)

    }

    return (
        <div className='advanced-search-list'>
            {[{
                "type": "Authors",
                "args": authors,
                "func": setSelectedAuthor
            },
            {
                "type": "Patrons",
                "args": patrons,
                "func": setSelectedPatrons
            },
            {
                "type": "Printers",
                "args": printers,
                "func": setSelectedPrinters
            },
            {
                "type": "Booksellers",
                "args": booksellers,
                "func": setSelectedBooksellers
            },
            {
                "type": "Publishers",
                "args": publishers,
                "func": setSelectedPublishers
            }].map((type) => (
                <Autocomplete
                    options={type.args}
                    getOptionLabel={(option) => ` ${option.macmorris_id} - ${option.display_name}` || ""}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    renderInput={(params) => (
                        <TextField {...params} label={`${type.type}`} variant="standard" />
                    )}
                    onChange={(event, value) => { type.func(value.id) }}
                />))}
            <Button onClick={() => searchPeople()}>Search</Button>
        </div>

    );
}
