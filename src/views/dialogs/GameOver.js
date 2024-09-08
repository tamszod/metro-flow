import { useDispatch, useSelector } from "react-redux"
import { PopUp } from "../../ui/popup"
import { GameOver__IsOpen } from "../../state/dialog/selector"
import { nextRound, restart } from "../../state/slice"
import { selectPassengers } from "../../state/selectors"

export const GameOver = () => {
    const dispatch = useDispatch();
    return (
        <PopUp
            style = {{
                width: "300px",
                height: "300px",
            }}
            open={useSelector(GameOver__IsOpen)}
        >
            <h1>Game Over!</h1>
            <p>
            You have transported <strong>{useSelector(selectPassengers)} passengers</strong>. Click "New Game" to try again!
            </p>
            <button
                className="dialog__button"
                onClick={_ => 
                    {
                        dispatch(restart());
                        dispatch(nextRound())
                    }
                 }
            >
                New Game
            </button>
        </PopUp>
    )
}