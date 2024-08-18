import { useEffect, useRef, useState } from "react";
import { PopUp } from "../../ui/popup"
import { nextRound } from "../../state/slice";
import { useDispatch } from "react-redux";

export const StartMenu = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(true);
    const popRef = useRef(null);

    const StartGame = () => {
        setOpen(false);
        dispatch(nextRound());
    }

    return (
        <div
            className='dialog__start'
        >
            <PopUp
                ref={popRef}
                style = {{
                    width: "40vw",
                    height: "30vh",
                }}
                open={open}
                title={"MetroFlow"}
                draggable={false}
                onClose={null}
            >
                <p
                    className="dialog__start_text"
                >
                    This is an early version of my passion project about a transportation game. The goal is the satisfy the passengers by providing them a way to
                    travel to their destination. You can build a limited amount of lines. Try to build the most efficient way for passengers to go by. Be carefull! If a station gets 
                    too busy the passengers will become impatient. If you keep a station busy for too long the game will end!
                </p>
                <button
                    className="dialog__start__start_button"
                    onClick={StartGame}
                >
                    <span>Play now!</span>
                </button>
                <footer
                    className="dialog__start__footer"
                >
                    Version: Alpha 3.0
                </footer>
            </PopUp>
        </div>
    )
}