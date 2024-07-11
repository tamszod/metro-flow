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
    //const intervalRef = useRef();


/*
    useEffect(() => {
        sectionTrains.forEach(train => {
            let index = 0;
            while (index < trainPos.length && trainPos[index].id !== train.id ){
                ++index;
            }
            if (index >= trainPos.length){
                dispatch(trainEntersLine({
                    id:id,
                    train_id: train.id,
                    distance: train.currentPos.source,
                }))
            }
        });
    }, [sectionTrains, dispatch, id, trainPos, ]);

    useEffect(() => {
        if (trainPos.length > 0){
            intervalRef.current = setInterval(() => {
                trainPos.forEach(train => {            
                    dispatch(trainMoves({
                        train_id: train.id,
                    }))
                });
            }, 10);
        }
        return () => clearInterval(intervalRef.current);
    }, [sourceX, sourceY, targetX, targetY, id, trainPos, dispatch]);
*/
    useEffect(() => {
        if (isDeleting){
            dispatch(deleteLine(id))
        }
    }, [isDeleting, id, dispatch])

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
                            transform: `translate(-50%, -50%) translate(${sourceX+(targetX-sourceX)*train.distance}px,${sourceY+(targetY-sourceY)*train.distance}px) rotate(${270-Math.atan2((targetX-sourceX),(targetY-sourceY))* (180 / Math.PI)}deg)`,
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
                        {(sectionTrains.find(train_ => train_.id === train.id)?.data.passengers.length)}

                    </span>
                </EdgeLabelRenderer>
                )
            }
        </>
    )
}



/*
    const [tmp, setTmp] = useState(0)
    useEffect(() => {
        if (tmp < 10){
            intervalRef.current = setInterval(() => {
                console.log("edge_id:" + id + " tmp:"+tmp)
                setTmp(tmp => tmp + 1);
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [intervalRef, tmp, setTmp]);
    useEffect(() => {
        if (trains.length > 0){
            intervalRef.current = setInterval(() => {
                console.log(color)
                trains.forEach(train => {
                    dispatch(shoveTrain({
                        sourceX,
                        sourceY,
                        targetX,
                        targetY,
                        id: train.id,
                    }));
                });
            }, 1);
        }
        return () => clearInterval(intervalRef.current);
    }, [intervalRef, trains]);
*/



/*
    useEffect(() => {
        console.log(trains);
        sectionTrains.forEach(train => {
            let index = 0;
            while (index < trains.length && trains[index].id !== train.id ){
                ++index;
            }
            if (index >= trains.length){
                setTrains(trains => [...trains, {
                    id: train.id,
                    distance: train.currentPos.distanceFinished,
                }]);
            }
        });
    }, [sectionTrains]);

    useEffect(() => {
        if (trains.length > 0){
            intervalRef.current = setInterval(() => {
                trains.forEach((distance, index) => {            
                    const train = sectionTrains.find(train => train.id === distance.id);
                    const distancePerTick = train.traits.speed / Math.sqrt(((sourceX - targetX)**2 + (sourceY - targetY)**2));
                    const currentDistace = distance.distance + distancePerTick;
                    if (distance.distance < train.currentPos.target){
                        if (currentDistace >= 1){
                            setTrains([
                                ...trains.slice(0, index), 
                                ...trains.slice(index + 1),
                            ])
                        } else {
                            setTrains([
                                ...trains.slice(0, index), 
                                {
                                    id: train.id,
                                    distance: currentDistace,
                                },
                                ...trains.slice(index + 1),
                            ])
                        }
                    }
                });
            }, 100);
        }
        return () => clearInterval(intervalRef.current);
    }, [intervalRef, trains]);
*/