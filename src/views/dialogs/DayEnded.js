import { useDispatch, useSelector } from "react-redux";
import { PopUp } from "../../ui/popup"
import { DayEnded__IsOpen } from "../../state/dialog/selector";
import { nextRound } from "../../state/slice";

export const DayEnded = () => {
    const dispatch = useDispatch();

    return (
        <PopUp
            style = {{
                width: "20vw",
                height: "20vh",
            }}
            open={useSelector(DayEnded__IsOpen)}
            title={"The day is over"}

        >
            <button
                 onClick={_ => dispatch(nextRound())}
            >
                New Day
            </button>
        </PopUp>
    )
}