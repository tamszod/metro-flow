import { useDispatch, useSelector } from "react-redux"
import { selectDay, selectLinesColors, selectPassengers } from "../../state/selectors"
import { Controls } from "reactflow"
import { LearnToPlay__SetOpen } from "../../state/dialog/slice";
import { SiMetrodeparis } from "react-icons/si";
import { FaPeopleLine } from "react-icons/fa6";

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
                >Day {useSelector(selectDay)}
                </strong>
            <div
                style={{
                    marginTop: "50%",
                    marginLeft: "10%",
                }}
            >
                {useSelector(selectLinesColors)?.map(color => (
                    <div
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
                        }}
                    >
                        <FaPeopleLine />
                        <span
                            style={{
                                position: "fixed",
                                transform: "translate(60%,-10%)",
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