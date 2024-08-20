import { useEffect, useRef, useState } from "react";
import { PopUp } from "../../ui/popup"
import { nextRound } from "../../state/slice";
import { useDispatch, useSelector } from "react-redux";
import { Start__IsOpen } from "../../state/dialog/selector";

export const Start = () => {
    const dispatch = useDispatch();
    return (
        <div
            className='dialog__start'
        >
            <PopUp
                style = {{
                    width: "40vw",
                    height: "40vh",
                }}
                open={useSelector(Start__IsOpen)}
                title={"MetroFlow"}
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
                    onClick={_ => dispatch(nextRound())}
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