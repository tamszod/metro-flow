import { useDispatch, useSelector } from "react-redux"
import { PopUp } from "../../ui/popup"
import { GameOver__IsOpen } from "../../state/dialog/selector"
import { restart } from "../../state/slice"

export const GameOver = () => {
    const dispatch = useDispatch();
    
    return (
        <PopUp
            open={useSelector(GameOver__IsOpen)}
        >
            <button
                 onClick={_ => dispatch(restart())}
            >
                New Game
            </button>
        </PopUp>
    )
}