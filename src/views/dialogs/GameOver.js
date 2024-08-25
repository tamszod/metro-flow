import { useDispatch, useSelector } from "react-redux"
import { PopUp } from "../../ui/popup"
import { GameOver__IsOpen } from "../../state/dialog/selector"
import { nextRound, restart } from "../../state/slice"

export const GameOver = () => {
    const dispatch = useDispatch();

    //alert("Game over!\nYou have transported " + state.passengers +" passengers!");
    
    return (
        <PopUp
            open={useSelector(GameOver__IsOpen)}
            title={"Game Over!"}
        >
            <button
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