import React, { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, useEdges, useUpdateNodeInternals } from "reactflow";
import { selectStationTrains } from "../../state/selectors";
import { useDispatch, useSelector } from "react-redux";
import { trainEntersStation } from "../../state/slice";

export default memo((props) => {
	const updateNodeInternals = useUpdateNodeInternals();
  const trains = useSelector(state => selectStationTrains(state, props.id));
	const dispatch = useDispatch();
  const [hover, setHover] = useState(false)
  	const edges = useEdges();

	useEffect(
		() => {
			trains.forEach(train => {
				dispatch(trainEntersStation({
					id:train.id
				}))
			})
		}, [trains]
	);

	const lines = {}
	edges.forEach(edge => {
		if(edge.source === props.id || edge.target === props.id){
			if (edge.data.color in lines){
        lines[edge.data.color].push(edge)
      } else {
        lines[edge.data.color] = [edge]
      }
		}
	});

    return (
      <div
        style={{
            border: "1px black solid",
            width: "10px",
            height: "10px",
            marginTop: "0px",
            borderRadius: "10px",
            background: "white",
            userSelect: "none",
        }}
        onMouseEnter={event => setHover(true)}
        onMouseLeave={event => setHover(false)}
      >
		{Object.entries(lines).map(([line, edges], index) => {
				if (edges.length === 1){
					console.log(edges)
					return <div
						key={index} 
						style={
							{
								display:"flow",
							}
						}
						>
							<div>

							</div>
							<Handle
							id={line}
							style={
								{ 
									background: edges[0].data.color,
									width: "20px",
									height: "1px",
									borderRadius: 0,
									transform: `translate(-41%, -60%) rotate(18deg)`,
								}
							}>
								<div
								style={
								{ 
									background: edges[0].data.color,
									width: "10px",
									height: "2.22px",
									borderRadius: 0,
									transform: `rotate(90deg)`,
									marginTop: "8px",
									marginLeft: "5px",
								}
							}>

								</div>
							</Handle>
						</div>
				} else {
					return <React.Fragment key={index}></React.Fragment>
				}
			})
		}
        <Handle 
            id={"station"}
            style={
                {
                    top:"2px",
                }
            }
            isConnectable={true}
        />
        <span
          style={
            {
              display: "block",
              fontSize:"5px",
              marginTop: "2px",
              marginLeft:"12px",
              background: hover ? "red" : "",
              whiteSpace: "nowrap",
            }
          }
        >{props.data.name}</span>
      </div>
    );
});
