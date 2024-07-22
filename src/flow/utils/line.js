import { useDispatch, useSelector } from "react-redux";
import { BaseEdge, EdgeLabelRenderer } from "reactflow";
import { selectSectionTrains } from "../../state/selectors";
import { useEffect, useRef } from "react";
import { deleteLine, trainEntersLine, trainMoves } from "../../state/slice";
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
        trainPos,
    },
    //sourcePosition,
    //targetPosition,
    style = {},
    markerEnd,
    selected,
  }) {
    const dispatch = useDispatch();
    const sectionTrains = useSelector(state => selectSectionTrains(state, id));
    
    useEffect(() => {
        if (isDeleting){
            dispatch(deleteLine(id))
        }
    }, [isDeleting, id, dispatch]);

    return (
        <>            
            <BaseEdge path={`M ${sourceX},${sourceY}, ${targetX},${targetY}`} markerEnd={markerEnd} style={{border: "3px black solid", stroke: (isDeleting ? "gray" : color ?? "gray"), strokeWidth:selected ? 3 : 2, ...style}} />
            {
                trainPos.map(train => 
                <EdgeLabelRenderer
                    key={train.id}
                >
                    <div
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${sourceX+(targetX-sourceX)*train.distance}px,${sourceY+(targetY-sourceY)*train.distance}px) rotate(${train.translateDeg}deg)`,
                            pointerEvents: 'all',
                            width:"20px",
                            height:"10px",
                            background:color,
                        }}
                        className="nodrag nopan"
                    >
                    </div>
                    <span
                        style={{
                            zIndex: 2,
                            position: "absolute",
                            fontSize: "15px",
                            transform: `translate(-50%, -50%) translate(${sourceX+(targetX-sourceX)*train.distance}px,${sourceY+(targetY-sourceY)*train.distance}px)`,
                    }}>
                        {/*(sectionTrains.find(train_ => train_.id === train.id)?.data.passengers.length)*/}

                    </span>
                </EdgeLabelRenderer>
                )
            }
        </>
    )
}