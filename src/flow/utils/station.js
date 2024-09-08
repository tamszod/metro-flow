import React, { memo } from "react";
import { Handle, useEdges } from "reactflow";
import { Game__IsRunning, selectStationTrains } from "../../state/selectors";
import { useSelector } from "react-redux";
import { lImpatientPassengerMargin, lPassengerMarginOnTrain } from "../../config";
import { randomNumber } from "../../state/logic";

export default memo((props) => {
  	const trains = useSelector(state => selectStationTrains(state, props.id));
  	const edges = useEdges();
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

	const isGameRunning = useSelector(Game__IsRunning);

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
							isConnectable={isGameRunning}
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
							}
						/>
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
								}
								isConnectable={isGameRunning}
							/>
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
							transform: `translate(-25%, -40%) rotate(${(train.currentPos.data.source === 0 ? 180 : 0) + train.lastPos.data.translateDeg}deg)`,
							pointerEvents: 'all',
							width:"22px",
							height:"12px",
							background: train.data.isDeleting ? "gray" : train.traits.color,
						}}
						className="nodrag nopan"
					>
						{ 
						train.data.passengers.map((passenger, index) => (
							<div 
								key={index}
								style={{
									position: 'absolute',
									zIndex: 1,
									pointerEvents: 'all',
									width:"4.5px",
									height:"4.5px",
									marginLeft: lPassengerMarginOnTrain[index].left,
									marginTop: lPassengerMarginOnTrain[index].top,
									borderRadius:"25px",
									border: "0.25px solid",
									borderColor: "black",
									backgroundColor: passenger.color,
								}}
							className="nodrag nopan"
							/>
						))}
					</div>
				</React.Fragment>
			))
		}
        <Handle 
            id={"station"}
            style={
                {
					background: props.data.color,
                    top:"2px",
                }
            }
			isConnectable={isGameRunning}
        />
        <span
          style={
            {
              display: "block",
              fontSize:"5px",
              marginTop: "2px",
              marginLeft:"12px",
              whiteSpace: "nowrap",
            }
          }
        >{!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? <>{props.id}</> : <> {props.data.name} </>}</span>
		{
			props.data.passengers.map((objPassenger, iPassenger) => (
				<div 
					key={iPassenger}
					style={{
						position: 'absolute',
						zIndex: 1,
						pointerEvents: 'all',
						width:"4.5px",
						height:"4.5px",
						marginLeft: 10+iPassenger*6,
						marginTop: iPassenger < props.data.passengerLimit ? 0 : lImpatientPassengerMargin[randomNumber(0,lImpatientPassengerMargin.length-1)].top,
						borderRadius:"25px",
						border: "0.25px solid",
						borderColor: "black",
						backgroundColor: objPassenger.color,
					}}
					className="nodrag nopan"
				/>
			))
		}
      </div>
    );
});