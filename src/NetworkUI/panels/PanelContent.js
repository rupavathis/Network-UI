import React from 'react';
import { useEffect, useState } from "react";
import '../Network.scss';
import People from '../core/network/People';
import Work from '../core/network/Work.js';
import Form from 'react-bootstrap/Form';

function PanelContent({ networkData, settings, tab, setTab, workNetworkData, selectContent, show3DText, displayNames}) {
    console.log({ networkData, workNetworkData, selectContent })
    const [secondDegree, setSecondDegree] = useState(true);
    const [threeD, setThreeD] = useState(false);
    console.log("PanelContent", networkData)
    return (
        <div className='panel-content'>
            {networkData.length != 0 && selectContent === 0 &&
                <People networkData={networkData} settings={settings} tab={tab} setTab={setTab} secondDegree={secondDegree}
                    threeD={threeD}  show3DText={show3DText} displayNames={displayNames}/>
            }
            {workNetworkData.length != 0 && selectContent === 1 &&
                <Work workNetworkData={workNetworkData} settings={settings} secondDegree={secondDegree} threeD={threeD}
                    tab={tab} show3DText={show3DText} displayNames={displayNames}/>
            }
            {(workNetworkData.length != 0 || networkData.length != 0) && <Form className="switches">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Show the 2nd degree"
                    onClick={() => setSecondDegree(!secondDegree)}
                />
                <Form.Check
                    type="switch"
                    id="3D-switch"
                    label="Show the network in 3D"
                    onClick={() => setThreeD(!threeD)}
                />
            </Form>}
        </div>
    )
}

export default PanelContent;

