import React from 'react';
import { useEffect, useState } from "react";
// import async from 'react-select/dist/declarations/src/async';
import '../Network.scss';

function Info({ info }) {
    console.log("info", { info })
    const [infoData, setInfoData] = useState({})

    useEffect(() => {
        async function fetchInfo() {
            if (info != null) {
                let url = `people/${info}`;
                console.log(url)
                const res = await fetch(url);
                const infoJson = await res.json();
                console.log("useeffect", infoJson);
                setInfoData(infoJson)
            }
        }
        fetchInfo()
    }, [info]);

    console.log("info json", { infoData })

    return (
        <div className='panel-right'>
            Date of birth: {infoData.date_of_birth}
            Date of death: {infoData.date_of_death}
            Date of flourishing: {infoData.flourishing_date}
            Gender: {infoData.gender?.name}
            Attributes: {infoData.attribs?.map(a => a.name)} 
        </div>
    )
}


export default Info;
