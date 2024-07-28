import { useDispatch, useSelector } from "react-redux";
import { BaseEdge, EdgeLabelRenderer } from "reactflow";
import { selectSectionTrains } from "../../state/selectors";
import { useEffect } from "react";
import { deleteLine } from "../../state/slice";
import { lPassengerMarginOnTrain } from "../../config";
/*
const getPathPosition = (sourceX, sourceY, targetX, targetY) => {
    if (sourceX <= targetX){
        if (sourceY <= targetY){
            return Position.Bottom;
        } else {
            return Position.Right;
        }
    } else {
        if (sourceY <= targetY){
            return Position.Left; 
        } else {
            return Position.Top;
        }

    }
}

const reversePathPosition = (position) => {
    switch (position) {
        case Position.Left:
            return Position.Right;
        case Position.Right:
            return Position.Left;
        case Position.Bottom:
            return Position.Top;
        case Position.Top:
            return Position.Bottom;
    }
}
*/
export default function Line({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data: {
        color,
        isDeleting,
    },
    style = {},
    markerEnd,
    selected,
  }) {
    const dispatch = useDispatch();
    const trains = useSelector(state => selectSectionTrains(state, id));
    
    useEffect(() => {
        if (isDeleting){
            dispatch(deleteLine(id))
        }
    }, [isDeleting, id, dispatch]);

    return (
        <>            
            <BaseEdge path={`M ${sourceX},${sourceY}, ${targetX},${targetY}`} markerEnd={markerEnd} style={{border: "3px black solid", stroke: (isDeleting ? "gray" : color ?? "gray"), strokeWidth: 3, ...style}} />
            {
                trains.map(train => 
                <EdgeLabelRenderer
                    key={train.id}
                >
                    <div
                        style={{
                            zIndex: 2,
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${sourceX+(targetX-sourceX)*train.currentPos.data.distance}px,${sourceY+(targetY-sourceY)*train.currentPos.data.distance}px) rotate(${(train.currentPos.data.source === 0 ? 180 : 0) + train.currentPos.data.translateDeg}deg)`,
                            pointerEvents: 'all',
                            width:"22px",
                            height:"12px",
                            backgroundColor:color,
                        }}
                        className="nodrag nopan"
                    >
                        { 
                        train.data.passengers.map((passenger, index) => (
                            <div key={index}
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
                                    backgroundColor:passenger.color,
                                }}
                                className="nodrag nopan"
                            />
                        ))}

                    </div>
                    <span
                        style={{
                            zIndex: 2,
                            position: "absolute",
                            fontSize: "15px",
                            transform: `translate(-50%, -50%) translate(${sourceX+(targetX-sourceX)*train.currentPos.data.distance}px,${sourceY+(targetY-sourceY)*train.currentPos.data.distance}px)`,
                    }}>
                        
                    </span>
                </EdgeLabelRenderer>
                )
            }
        </>
    )
}