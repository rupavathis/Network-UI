/* eslint-disable no-use-before-define */
import React from 'react';
import { useEffect } from "react";
import AsyncSelect from 'react-select/async';
import '../../Network.scss';


export default function SearchName({ setNetworkData, setSelectContent, setDisplayNames, displayNames }) {


    const [searchData, setSearchData] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const fetchData = async () => {
        const displayNamesRes = await fetch("/names");
        var displayNamesJson = await displayNamesRes.json();
        console.log("displayNamesJson", displayNamesJson)
        setDisplayNames(displayNamesJson)
    };

    useEffect(() => { fetchData(); }, [])

    const onSearchChange = async (
        newValue,
        actionMeta
    ) => {
        setSearchData(true);
        const peopleRes = await fetch(`/showConnection/${newValue.id}`);
        const peopleJson = await peopleRes.json();
        console.log("people json", peopleJson);
        setNetworkData(peopleJson);
        setSelectContent(0)

    };

    const filterNames = (inputValue) => {
        const getDisplayDOB = (d) => {

            if (d.date_of_birth != null && d.date_of_death != null) {
                return `${d.date_of_birth} - ${d.date_of_death}`
            }


            else if (d.date_of_birth == null && d.date_of_death == null && d.flourishing_date == null)
                return ""

            else if (d.date_of_birth == null && d.date_of_death != null)
                return `D. ${d.date_of_death}`

            else if (d.date_of_birth == null && d.date_of_death == null)
                return `FL. ${d.flourishing_date}`

            else return ""
        }
        return (displayNames.map((d) => ({
            label: d.display_name + ` (${getDisplayDOB(d)})`,
            others: d.other_names, id: d.id
        }))).filter((i) => (i.others !== null &&
            i.others.toLowerCase().includes(inputValue.toLowerCase()) || (i.label.toLowerCase().includes(inputValue.toLowerCase())))
        );
    };


    let timeoutId

    const debounce = (func, delay) => {
        return function () {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(() => {
                func()
            }, delay)
        }
    }


    const loadOptions = (inputValue) => {
        return new Promise((resolve) => {
            debounce(() => resolve(filterNames(inputValue)), 500)()
        })
    }

    // const loadOptions = debounce(_loadOptions, 300);

    const handleInputChange = (newValue) => {
        // const newInput = newValue.replace(/\W/g, '');
        const newInput = newValue;
        setInputValue(newInput);
        return newInput;
    };

    return (
        <div className='searchTitle-wrapper'>
            {displayNames.length != 0 && <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                onInputChange={handleInputChange}
                onChange={onSearchChange}
                getOptionValue={(option) => option.label}
            />}
        </div>
    );
}
