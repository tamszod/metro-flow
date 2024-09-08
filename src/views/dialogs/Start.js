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
                    width: "500px",
                    height: "300px",
                }}
                open={useSelector(Start__IsOpen)}
                title={"MetroFlow"}
            >
                <p
                    className="dialog__start_text"
                >
                    Welcome to the early version of my passion project — a transportation strategy game where your goal is to keep passengers happy by efficiently guiding them to their 
                    destinations. You’ll have a limited number of lines to build, so plan wisely to create the most efficient routes. But be careful! Overcrowded stations will cause 
                    passengers to lose patience. If a station remains too busy for too long, it’s game over!
                </p>
                <button
                    className="dialog__start__start_button dialog__button"
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