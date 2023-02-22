import Form from 'react-bootstrap/Form';
import './core.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from "react";
import Graph2D from "./Graph2D";
import Graph3D from './Graph3D';
import Filter from '../../tabs/WorkFilter';
import GraphForce2D from './Graph2DForce';

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


const Work = ({ workNetworkData, settings, secondDegree, threeD, tab, show3DText, displayNames }) => {
    const nodeSettings = (uniqueNode) => uniqueNode.map((u) => {
        if (u.batch === "work1") return (u.color = settings[0].node1, u.size = settings[1].node1 === '0' ?
            1 : settings[1].node1 * 2, u.fontSize = settings[2].node1 === '0' ? 1 : settings[2].node1 / 5,
            u.symbolType = "square")
        if (u.batch === "people1") return (u.color = settings[0].node2, u.size = settings[1].node2 === '0' ?
            1 : settings[1].node2 * 2, u.fontSize = settings[2].node2 === '0' ? 1 : settings[2].node2 / 5)
        if (u.batch === "work2") return (u.color = settings[0].node3, u.size = settings[1].node3 === '0' ?
            1 : settings[1].node3 * 2, u.fontSize = settings[2].node3 === '0' ? 1 : settings[2].node3 / 5,
            u.symbolType = "square")
        if (u.batch === "people2") return (u.color = settings[0].node3, u.size = settings[1].node3 === '0' ?
            1 : settings[1].node3 * 2, u.fontSize = settings[2].node3 === '0' ? 1 : settings[2].node3 / 5
        )
    })

    console.log({ workNetworkData, displayNames })


    const obj = displayNames.reduce((obj, item) => Object.assign(obj, { [item.id]: item.display_name }), {})

    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        fetchNodes();
        fetchLinks();
    }, [workNetworkData, secondDegree]);

    const firstDegree = workNetworkData[0]
    const networkData1 = [...firstDegree]
    const networkData2 = workNetworkData[1]
    console.log({ networkData1 })

    const fetchNodes = () => {
        const source1 = networkData1.map((c) => {
            return { id: c.display_title === null ? "" : c.display_title, work_id: c.id, batch: "work1" }
        })
        const assoc_author = networkData1.map((c) => {
            const a = c.author_id_id === null ? "" : obj[`${c.author_id_id}`];
            return { id: a, work_id: c.id, batch: "people1" }
        })

        const assoc_people = networkData1.map((c) => [c.patron_id_ids, c.patron_id_ids, c.publisher_id_ids, c.bookseller_id_ids]
            .map(d =>
                d.map(e => {
                    const v = e === null ? "" : obj[`${e}`];
                    return { id: v, people_id: e, batch: "people1" }
                }))
        ).flat(2)

        // const target1 = uniqueNodes([...assoc_people, ...assoc_author])
        const nodes1 = [...source1, ...assoc_people, ...assoc_author]

        if (secondDegree) {
            const source2 = networkData2.map((c) => {
                return { id: c.display_title === null ? "" : c.display_title, work_id: c.id, batch: "work1" }
            })


            const nodes = uniqueNodes([...nodes1, ...source2])
            console.log({ nodes })
            setNodes(nodes)
        }
        else {
            const nodes = uniqueNodes(nodes1)
            setNodes(nodes)
        }

        nodeSettings(nodes)

    }

    const fetchLinks = () => {
        const author_works = networkData1.map((c) => {
            const a = c.author_id_id === null ? "" : obj[`${c.author_id_id}`];
            return { source: c.display_title === null ? "" : c.display_title, target: a }
        })

        // const assoc_people_works = networkData1.map((w) => [w.patron_id_ids, w.printer_id_ids, w.publisher_id_ids, w.bookseller_id_ids]
        //     .map(people =>
        //         people.map(e => {
        //             const v = e === null? "" : obj[`${e}`];
        //             return {source: w.display_title === null ? "" : w.display_title ,  target: v}
        //         }))
        // ).flat(2)

        const ws = networkData1
        const ws2 = networkData2

        const w2p = ws.map(w => {
            // input: array of people ids, output array of src tgt objects
            const ids2p = (ids) => ids.map(id => ({
                source: w.display_title ?? "",
                target: obj[id] ?? "",
            }));
            return [w.patron_id_ids, w.printer_id_ids, w.publisher_id_ids, w.bookseller_id_ids].map(ids => ids2p(ids));
        }).flat(2);

        // const ws22 = ws2.filter(w => w.includes)

        const w2p2 = ws2.map(w => {
            // input: array of people ids, output array of src tgt objects
            const ids2p = (ids) => ids.map(id => ({
                source: w.display_title ?? "",
                target: obj[id] ?? "",
            }));
            return [w.patron_id_ids, w.printer_id_ids, w.publisher_id_ids, w.bookseller_id_ids].map(ids => ids2p(ids));
        }).flat(2);
        const assoc_people_works = w2p;

        const link1 = [...author_works, ...assoc_people_works]

        if (secondDegree) {

            // const assoc_people_works_2 = networkData1.map((w) => [w.patron_id_ids, w.printer_id_ids, w.publisher_id_ids, w.bookseller_id_ids]
            //     .map(people =>
            //         people.map(e => {
            //             const v = e === null ? "" : obj[`${e}`];
            //             return { target: networkData2[1].display_title === null ? "" : networkData2[1].display_title, source: v }
            //         }))
            // ).flat(3)

            const links2 = [...link1]
            const uniqueLinks = [...new Set(links2.map(JSON.stringify))].map(JSON.parse);
            setLinks(uniqueLinks)
        }
        else {
            const uniqueLinks = [...new Set(link1.map(JSON.stringify))].map(JSON.parse);
            setLinks(uniqueLinks)
        }
    }

    const data = { nodes: nodes, links: links }
    console.log({ data })
    const data3D = JSON.parse(JSON.stringify(data));

    return (
        <>
            {!threeD && <GraphForce2D data={data} />}
            {threeD && <Graph3D data={data3D} show3DText={show3DText} />}

            {tab === "show-filter" && <Filter nodes={[...data.nodes]} setNodes={setNodes} />}
        </>
    );
};

export default Work;
