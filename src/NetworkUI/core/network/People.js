import { useEffect, useRef, useState } from "react";
import { Graph } from "react-d3-graph";

import './core.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Graph3D from "./Graph3D";
import Graph2D from "./Graph2D";
import Filter from "../../tabs/Filter";
import Graph2DForce from "./Graph2DForce";


const uniqueNodes = (nodes) => {
    const uniqueIds = [];
    return nodes.filter(element => {
        const isDuplicate = uniqueIds.includes(element.id);

        if (!isDuplicate) {
            uniqueIds.push(element.id);
            return true;
        }

        return false;
    });
}

const People = ({ networkData, settings, tab, setTab, secondDegree, threeD, show3DText, displayNames }) => {
    console.log({ networkData, tab, displayNames })

    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    const names = displayNames.reduce((obj, item) => Object.assign(obj, { [item.id]: item.display_name }), {})


    useEffect(() => {
        fetchNodes(networkData[0], networkData[1]);
        fetchLinks(networkData[0], networkData[1]);
    }, [networkData, secondDegree, settings[0], settings[1], settings[2]]);

    const fetchNodes = (networkData2, networkData3) => {
        const source1 = networkData2.map((c) => { return { id: names[`${c.source_id_id}`], people_id: c.source_id_id, batch: "node1" } })
        const target1 = networkData2.map((c) => { return { id: names[`${c.target_id_id}`], people_id: c.target_id_id, batch: "node1Targets" } })
        const nodes1 = [...source1, ...target1]
        console.log({ source1, target1 })
        const target2 = networkData3.map((c) => { return { id: names[`${c.target_id_id}`], people_id: c.target_id_id, batch: "nodes2" } })
        const source2 = networkData3.map((c) => { return { id: names[`${c.source_id_id}`], people_id: c.source_id_id, batch: "nodes2" } })
        const nodes2 = [...source2, ...target2]
        console.log({ source2, target2 })
        let nodes = []
        if (secondDegree) nodes = [...nodes1, ...nodes2]
        else nodes = [...nodes1]
        // const nodes = [...nodes1, ...nodes2]
        const uniqueNode = uniqueNodes(nodes)
        uniqueNode.map((u) => {
            if (u.batch === "node1") return (u.color = settings[0].node1, u.nodeVal = settings[1].node1 === '0' ?
                1 : settings[1].node1 * 2, u.fontSize = settings[2].node1 === '0' ? 1 : settings[2].node1 / 5)
            if (u.batch === "node1Targets") return (u.color = settings[0].node2, u.nodeVal = settings[1].node2 === '0' ?
                1 : settings[1].node2 * 2, u.fontSize = settings[2].node2 === '0' ? 1 : settings[2].node2 / 5)
            if (u.batch === "nodes2") return (u.color = settings[0].node3, u.nodeVal = settings[1].node3 === '0' ?
                1 : settings[1].node3 * 2, u.fontSize = settings[2].node3 === '0' ? 1 : settings[2].node3 / 5)
        })
        setNodes(uniqueNode)
    }

    const fetchLinks = (networkData2, networkData3) => {
        const links1 = networkData2.map((c) => { return { source: names[`${c.source_id_id}`], target: names[`${c.target_id_id}`]} })
        const links2 = networkData3.map((c) => { return { source: names[`${c.source_id_id}`], target: names[`${c.target_id_id}`]} })
        let links = []
        if (secondDegree) links = [...links1, ...links2]
        else links = [...links1]
        const uniqueLinks = [...new Set(links.map(JSON.stringify))].map(JSON.parse);
        setLinks(uniqueLinks)
    }


    const data = { nodes: nodes, links: links }
    const data2 = JSON.parse(JSON.stringify(data));
    // const data3D = {...data}
    // setTab(() => "")
    // setTab((tab) => tab === "show-filter" ? "hide-filter" : "")
    const data3D = JSON.parse(JSON.stringify(data));

    console.log({data})
    return (
        <>
            {/* {!threeD && <Graph2D data={data} />} */}
            {!threeD && <Graph2DForce data={data} /> }
            {threeD && <Graph3D data={data3D} show3DText={show3DText} />}

            { tab === "show-filter" && <Filter nodes={[...data.nodes]} setNodes={setNodes} />}
            
        </>
    );
};

export default People;
