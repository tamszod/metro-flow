import { useDispatch, useSelector } from "react-redux"
import { Game__HeatTimeProgress, Game__TimeProgress, Game_IsHeated, selectDay, selectLinesColors, selectPassengers } from "../../state/selectors"
import { LearnToPlay__SetOpen } from "../../state/dialog/slice";
import { SiMetrodeparis } from "react-icons/si";
import { FaPeopleLine } from "react-icons/fa6";
import { Clock } from "../../ui/clock";
import { RProgressBar } from "../../ui/bar";
import { lImpatientPassengerMargin } from "../../config";
import { randomNumber } from "../../state/logic";

export const UI = () => {
    const dispatch = useDispatch();
    const heatTimeProgress = useSelector(Game__HeatTimeProgress)
    const IsHeated = useSelector(Game_IsHeated)
    return (<div
        style={{
            position: "fixed",
            zIndex: "1000",
        }}
    >
        <div
            style={{
                position: "fixed",
                marginLeft: "10px",
                marginTop: "5px",
            }}
        >
            <strong
                style={{
                    position: "fixed",
                    marginTop: "10px",
                    textAlign: "center",
                    width: "80px"
                }}
                >Day {useSelector(selectDay)}
            </strong>
            <div
                style={{
                    position: "fixed",
                    marginTop: "0px",
                    marginLeft: "85px",

                }}
            >
                <Clock size={60} primaryTick={useSelector(Game__TimeProgress)}/>
            </div>
            <div 
                style={{ 
                    position: "fixed", 
                    marginLeft: "160px", 
                    marginTop: "25px", 
                    display: "inline-flex", 
                }}
            >
                <RProgressBar 
                    style={{ position: "inline" }} 
                    progress={heatTimeProgress} 
                    barColor="whitesmoke" 
                    progressColor={heatTimeProgress < 0.3 ? "red" : "gray"} 
                />
                { IsHeated ? <strong 
                    style={{ 
                        marginLeft: "5px",
                        transform: "translate(0%, -40%)",
                        color: "red",
                        marginTop: lImpatientPassengerMargin[randomNumber(0,lImpatientPassengerMargin.length-1)].top,
                        fontSize: "30px",
                    }}
                >
                    !
                </strong>: <></>}
            </div>
            <div
                style={{
                    position: "fixed",
                    marginTop: "60px",
                }}
            >
                {useSelector(selectLinesColors)?.map((color, index) => (
                    <div
                        key={index}
                        style={{
                            marginTop: "-5px",
                        }}
                    >
                        <SiMetrodeparis style={
                        {
                            border:"solid black 1px",
                            color,
                            background:"white",
                            padding: "3px",
                        }
                        }/>
                    </div>
                ))}
                    <div
                        style={{
                            marginTop: "10px",
                        }}
                    >
                        <FaPeopleLine />
                        <span
                            style={{
                                position: "fixed",
                                transform: "translate(10px, -2px)"
                            }}>
                            {useSelector(selectPassengers)}
                        </span>

                    </div>
            </div>
        </div>
        <button
            style={{
                border: "none",
                cursor: "pointer",
                backgroundColor: "transparent",
                position: "fixed",
                marginTop: "100vh",
                transform: "translate(25%,-200%)",
            }}
            onClick={e => dispatch(LearnToPlay__SetOpen())}
        >
            <strong>Learn To Play</strong>
        </button>
    </div>)
}