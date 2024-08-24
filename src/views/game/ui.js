import { useDispatch, useSelector } from "react-redux"
import { Game__TimeProgress, selectDay, selectLinesColors, selectPassengers } from "../../state/selectors"
import { Controls } from "reactflow"
import { LearnToPlay__SetOpen } from "../../state/dialog/slice";
import { SiMetrodeparis } from "react-icons/si";
import { FaPeopleLine } from "react-icons/fa6";
import { Clock } from "../../ui/clock";

export const UI = () => {
    const dispatch = useDispatch();

    return (<div
        style={{
            position: "fixed",
            zIndex: "1000",
        }}
    >
        <div
            style={{
                position: "fixed",
                marginLeft: "1%",
                marginTop: "1%",
            }}
        >
            <strong
                style={{
                    position: "fixed",
                    marginTop: "1.5%",
                    textAlign: "center",
                    width: "80px"
                }}
                >Day {useSelector(selectDay)}
            </strong>
            <div
                style={{
                    position: "fixed",
                    marginTop: "-0.5%",
                    marginLeft: "7%",

                }}
            >
                <Clock size={60} primaryTick={useSelector(Game__TimeProgress)}/>
            </div>
            <div
                style={{
                    position: "fixed",
                    marginTop: "6%",
                    marginLeft: "1%",
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
                            marginTop: "30%",
                            marginLeft: "-10%",
                        }}
                    >
                        <FaPeopleLine />
                        <span
                            style={{
                                position: "fixed",
                                marginTop: "-0.1%",
                                marginLeft: "0.5%",
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