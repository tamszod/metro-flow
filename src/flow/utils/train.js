import { lPassengerMarginOnTrain } from "../../config"

export const Train = (train) => {
    return (
        <div
            style={{
                zIndex: 1,
                position: 'absolute',
                //transform: `translate(-50%, -50%) translate(${sourceX+(targetX-sourceX)*train.distance}px,${sourceY+(targetY-sourceY)*train.distance}px) rotate(${train.translateDeg}deg)`,
                transform: `translate(-25%, -40%) rotate(${train.lastPos.data.translateDeg}deg)`,
                pointerEvents: 'all',
                width:"22px",
                height:"12px",
                background:train.traits.color,
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
                        backgroundColor:passenger.color,
                    }}
                    className="nodrag nopan"
                />
            ))}
        </div>
    )
}