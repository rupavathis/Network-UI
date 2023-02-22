import './core.scss';
import { useEffect, useRef, useState, useCallback } from "react";
import { ForceGraph3D } from 'react-force-graph';
import SpriteText from 'three-spritetext';


const Graph3D = ({ data, show3DText }) => {

    const NODE_R = 8;

    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState(null);

    console.log("3d", { data }, show3DText)
    const fgRef = useRef();

    useEffect(() => {
        if (Object.keys(data).length > 0) {
            // fgRef.current.d3Force('link').distance((link) => 200)
            fgRef.current.d3Force('charge').strength(-300);
        };
    }, [data, show3DText, highlightLinks])

    const handleNodeHover = node => {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
          highlightNodes.add(node);
          node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
          node.links.forEach(link => highlightLinks.add(link));
        }

        setHoverNode(node || null);
        updateHighlight();
      };

    const handleLinkHover = link => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
            setHighlightLinks(highlightLinks.add(link));
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
        }

        updateHighlight();
    };
    const updateHighlight = () => {
        console.log({ highlightLinks })

        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };
    const paintRing = useCallback((node, ctx) => {
        // add ring just for highlighted nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        ctx.fill();
        console.log({ hoverNode })
    }, [hoverNode]);


    return (
        <>
            {console.log("3d show", show3DText)}
            {!show3DText && <ForceGraph3D
                backgroundColor="white"
                ref={fgRef}
                graphData={data}
                // nodeRelSize={4}
                autoPauseRedraw={false}
                linkColor={((data) => data.linkColor = "black")}
                nodeLabel="id"
                // linkLabel="id"
                nodeAutoColorBy="group"
                linkWidth={link => highlightLinks.has(link) ? 5 : 1}
                linkDirectionalParticles={4}
                linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
                nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : undefined}
                onLinkHover={handleLinkHover}
                nodeCanvasObject={paintRing}
                
            />}
            {show3DText && <ForceGraph3D
                ref={fgRef}
                graphData={data}
                nodeAutoColorBy="group"
                backgroundColor="white"
                linkColor={((data) => data.linkColor = "black")}
                nodeThreeObjectExtend={true}
                nodeThreeObject={node => {
                    const sprite = new SpriteText(node.id);
                    sprite.color = node.color;
                    sprite.textHeight = 6;
                    const s = sprite.position.y
                    sprite.position.y = -8
                    return sprite;
                }}
                enableNodeDrag={true}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                    node.fz = node.z;
                }}
            />}
        </>
    );
};

export default Graph3D
