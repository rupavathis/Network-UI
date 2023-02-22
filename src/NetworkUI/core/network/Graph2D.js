import { useEffect, useRef, useState } from "react";
import { Graph } from "react-d3-graph";
import './core.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import PanelRight from "../../panels/PanelRight";

const myConfig = {
  nodeHighlightBehavior: true,
  node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
  },
  link: {
      highlightColor: "lightblue",
  },
};



const onClickLink = function (source, target) {
  window.alert(`Clicked link between ${source} and ${target}`);
};


const Graph2D = ({ data }) => {
  console.log({ data })
  const [config, setConfig] = useState(null);
  const [info, setInfo] = useState(0);
  const [infoData, setInfoData] = useState([])
  const ref = useRef(null);

  const onClickNode = function (nodeId, node) {
    const id = node.people_id
    console.log({id})
    setInfo(id)
  };

  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    const { clientWidth, clientHeight } = current;
    const configNew = { ...myConfig, width: clientWidth, height: clientHeight };
    setConfig(configNew);
}, [ref]);

  return (
    <div ref={ref} style={{ height: '100%' }}>
       {data.nodes.length > 0 && data.links.length > 0 && config && (<Graph
          id="graph-id"
          data={data}     
          config={config}
          onClickNode={onClickNode}
          onClickLink={onClickLink}
        />)}
        {info!=0 && <PanelRight info={info} />}
    </div>
   
    
  );
};

export default Graph2D;
