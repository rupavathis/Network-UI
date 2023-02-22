import './core.scss';
import { useEffect, useRef, useState, useCallback } from "react";
import { ForceGraph2D } from 'react-force-graph';
import SpriteText from 'three-spritetext';


const Graph2DForce = ({ data, show3DText }) => {
    console.log("3d", { data }, show3DText)
    const fgRef = useRef();
    const ref = useRef();
    const [config, setConfig] = useState(null);
    const [linkStyle, setLinkStyle] = useState({});


    useEffect(() => {
        if (Object.keys(data).length > 0) {
            fgRef.current.d3Force('link').distance((link) => 100);
            fgRef.current.d3Force('charge').strength(() => -400);
        };
    }, [data, show3DText])


    // useEffect(() => {
    //     console.log("useEffect")
    //     const { current } = ref;
    //     if (!current) {
    //         console.log("returning")
    //         return;
    //     }
    //     const { clientWidth, clientHeight } = current;
    //     const configNew = { width: clientWidth, height: clientHeight };
    //     setConfig(configNew);
    //     console.log({ configNew })

    //     setLinkStyle(
    //         {
    //             linkColor: "black",
    //             linkOpacity: 1,
    //         }
    //     )
    // }, [ref]);


    function nodePaint(node, ctx) {
        const { x, y, id } = node

        // ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI, false); ctx.fill();
        // ctx.moveTo(100, 100);

        ctx.font = '10px Sans-Serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillStyle = "black"
        // ctx.moveTo(50, 50) 
        ctx.fillText(id, x + 8, y + 1);
    }
    // if(node.batch === "work1" ){
    //     ctx.fillStyle = color;
    //     ctx.fillRect(x - 6, y - 4, 12, 8);
    //     ctx.font = '5px Sans-Serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; 
    //     ctx.fillText(node.id, x, y);  
    // }

    // else {
    //     ctx.fillStyle = color;
    //     ctx.font = '5px Sans-Serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; 
    //     ctx.fillText(node.id, x, y); } 

    //     // ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x - 5, y + 5); ctx.lineTo(x + 5, y + 5); ctx.fill(); }
    // }

    console.log("Graph 2D corce", { data })
    return (
        <>
            <div ref={ref} style={{ height: '100%' }}>
                {console.log("3d show", show3DText)}
                {!show3DText && <ForceGraph2D
                    // width={250}
                    // height={250}
                    // nodeVal={(data => data.nodes.map(d => d.size))}
                    graphData={data}
                    ref={fgRef}
                    nodeLabel="id"
                    linkLabel="id"
                    nodeAutoColorBy="group"
                    linkColor={(() => 'rgb(211,211,211)')}
                    linkResolution={10}
                    linkOpacity={1}
                    // {...linkStyle}
                    nodeCanvasObject={(node, ctx) => {
                        return nodePaint(node, ctx)
                    }}
                    nodeCanvasObjectMode={() => 'after'}
                    cooldownTicks={100}
                    onEngineStop={() => fgRef.current.zoomToFit(400)}

                />}
            </div>
        </>
    );
};

export default Graph2DForce
