import { LearnToPlay__IsOpen } from "../../state/dialog/selector";
import { LearnToPlay__SetOpen } from "../../state/dialog/slice";
import { PopUp } from "../../ui/popup"
import { useDispatch, useSelector } from "react-redux"


export const LearnToPlay = () => {
    const isOpen = useSelector(LearnToPlay__IsOpen);
    const dispatch = useDispatch();

    return (
        <div
        
        >
            <PopUp
                style={{
                    width: "300px",
                    height: "400px",
                }}
                open={isOpen}
                title={"Learn To Play"}
                draggable={true}
                resizable={true}
                onClose={ _ => dispatch(LearnToPlay__SetOpen(false))}
            >
            </PopUp>
        </div>
    )
}