import React, { memo, useEffect, useState } from "react";
import { Handle, useEdges } from "reactflow";
import { selectStationTrains, selectWaitingPassengersAtStation } from "../../state/selectors";
import { useDispatch, useSelector } from "react-redux";
import { trainEntersStation } from "../../state/slice";

export default memo((props) => {
  	const trains = useSelector(state => selectStationTrains(state, props.id));
  	const passengers = useSelector(state => selectWaitingPassengersAtStation(state, props.id));
	const dispatch = useDispatch();
	const [hover, setHover] = useState(false)
  	const edges = useEdges();
/*
	useEffect(
		() => {
			trains.forEach(train => {
				dispatch(trainEntersStation({
					id:train.id
				}))
			})
		}, [trains, dispatch]
	);
*/

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
					let degree = (Math.atan2(edges[0].data.targetPos.y-edges[0].data.sourcePos.y, edges[0].data.targetPos.x-edges[0].data.sourcePos.x) * 180) / Math.PI;
					let marginTop = -1.5;
					let marginLeft =  -5;
					if (edges[0].data.targetPos.x === props.xPos && edges[0].data.targetPos.y === props.yPos){
						degree += 90;
					} else {
						degree += 270;
					}

					return edges[0].data.isDeleting ? <div
					key={index} 
					style={
						{
							display:"flow",
							zIndex: 2,
						}
					}
					>
						<Handle
						id={line}
						isConnectable={false}
						style={
							{ 
								position: "absolute",
								background: "gray",
								zIndex: -1,
								width: "20px",
								height: "1px",
								borderRadius: 0,
								left: 0,
								right: 0,
								top:0,
								bottom:0,
								marginTop: `${marginTop}px`,
								marginLeft: `${marginLeft}px`,
								transform: `rotate(${degree}deg)`,
							}
						}>
						</Handle>
					</div> : <div
						key={index} 
						style={
							{
								display:"flow",
								zIndex: 2,
							}
						}
						>
							<Handle
							id={line}
							style={
								{ 
									position: "absolute",
									background: edges[0].data.color,
									zIndex: -1,
									width: "20px",
									height: "1px",
									borderRadius: 0,
									left: 0,
									right: 0,
									top:0,
									bottom:0,
									marginTop: `${marginTop}px`,
									marginLeft: `${marginLeft}px`,
									transform: `rotate(${degree}deg)`,
								}
							}>
								{/*<div
								style={
								{ 
									background: edges[0].data.color,
									width: "12px",
									height: "2.1px",
									borderRadius: 0,
									transform: `rotate(90deg)`,
									marginTop: "9px",
									marginLeft: "4px",
								}
							}
							>

								</div>*/}
							</Handle>
						</div>
				} else {
					return <React.Fragment key={index}></React.Fragment>
				}
			})
		}
		{
			trains.map((train, index) => (
				<React.Fragment key={index}>
					<div
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            //transform: `translate(-50%, -50%) translate(${sourceX+(targetX-sourceX)*train.distance}px,${sourceY+(targetY-sourceY)*train.distance}px) rotate(${train.translateDeg}deg)`,
                            transform: `translate(-25%, -40%) rotate(${train.lastPos.data.translateDeg}deg)`,
							pointerEvents: 'all',
                            width:"20px",
                            height:"10px",
                            background:train.traits.color,
                        }}
                        className="nodrag nopan"
                    >
                    </div>
                    <span
                        style={{
                            zIndex: 2,
                            position: "absolute",
                            fontSize: "15px",
							transform: `translate(0%, -50%)`,
	                    }}>
                        {/*train.data.passengers.length*/}
                    </span>
				</React.Fragment>
			))
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
              backgroundColor: hover ? "blue" : "",
              whiteSpace: "nowrap",
            }
          }
        >{props.data.name}</span>
		{passengers ? <>{hover ?<div
				style={{
					fontSize:"8px",
					width:"150px",
					backgroundColor:"lightgray",
					margin:"4px",
					zIndex:-10
				}}
			>
			<h2 style={{
				margin:"4px",
				color: "red",
			}}>Passengers Are Waiting!</h2>
			<table><tbody>
				{
					Object.values(passengers).map((passenger, index) => (
						<tr key={index}><td>{passenger.count} to {passenger.name}</td></tr>
					))
				}
			</tbody></table>
		</div> : <div
				style={{
					fontSize:"15px",
					marginLeft: "-6px",
					marginTop: "-13px",
				}}
		>!
		</div>}</>:<></>}
      </div>
    );
});


/*
marginTop = -1.5-y+handleY;
					marginLeft = -5-x+handleX;


					const sourceX = edges[0].data.sourcePos.x
					const sourceY = edges[0].data.sourcePos.y
					const targetX = edges[0].data.targetPos.x
					const targetY = edges[0].data.targetPos.y

					const m = (targetY - sourceY) / (targetX - sourceX);
					const handleX = edges[0].data.targetPos.x === props.xPos && edges[0].data.targetPos.y === props.yPos ? targetX+(sourceX > targetX ? -1.5 : 1.5) : sourceX+( targetX > sourceX ? -1.5 : 1.5);
					const y = edges[0].data.targetPos.x === props.xPos && edges[0].data.targetPos.y === props.yPos ? targetY : sourceY;
					const x = edges[0].data.targetPos.x === props.xPos && edges[0].data.targetPos.y === props.yPos ? targetX : sourceX;
					const handleY = y + m*(handleX-x)
					//console.log(props.id)
					//console.log(sourceX)
					//console.log(sourceY)
					//console.log(targetX)
					//console.log(targetY)
					//console.log(handleX)
					//console.log(handleY)
					//console.log("===========")
					marginTop = ;
					marginLeft =;
					if (sourceX <= targetX){
						if (sourceY <= targetY){
							marginTop = -1.5;
							marginLeft = -5;
						} else {
							marginTop = -1.5;
							marginLeft = -5;
						}
					} else {
						if (sourceY <= targetY){
							marginTop = -1.5;
							marginLeft = -5;
						} else {
							marginTop = -1.5;
							marginLeft = -5;
						}
				
					}
					//marginTop = -1.5-y+handleY;
					//marginLeft = -5-x+handleX;
					/*if (handleX > x){
						marginTop = -1.5-y+handleY;
						marginLeft = -5-x+handleX;
					} else {
						if (handleY > y){
							marginTop = -1.5-y+handleY;
							marginLeft = -5-x+handleX;

						} else {
							marginTop = -1.5-y+handleY;
							marginLeft = -5-x+handleX;
						}
					}*/