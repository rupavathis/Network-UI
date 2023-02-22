import React from 'react';
import { useEffect, useState } from "react";
import Info from '../tabs/Info';
import '../Network.scss';

function PanelRight({info}) {
    console.log({info})
    return (
        <div className='panel-right'>
            {info != 0 && <Info info={info} />}
        </div>
    )
}

export default PanelRight;
