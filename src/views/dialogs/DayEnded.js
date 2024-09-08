import { useDispatch, useSelector } from "react-redux";
import { PopUp } from "../../ui/popup"
import { DayEnded__IsOpen } from "../../state/dialog/selector";
import { nextRound } from "../../state/slice";
import { selectDay } from "../../state/selectors";

export const DayEnded = () => {
    const dispatch = useDispatch();
    const day = useSelector(selectDay);

    return (
        <PopUp
            style = {{
                width: "300px",
                height: "200px",
                
            }}
            open={useSelector(DayEnded__IsOpen)}

        >
            <h1>Day {day}</h1>
            <p>
                You’ve successfully completed Day {day}. Click "New Day" to continue!
            </p>
            <button className="dialog__button"
                 onClick={_ => dispatch(nextRound())}
            >
                New Day
            </button>
        </PopUp>
    )
}