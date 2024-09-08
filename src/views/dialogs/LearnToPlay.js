import { useRef } from "react";
import { LearnToPlay__IsOpen } from "../../state/dialog/selector";
import { LearnToPlay__SetOpen } from "../../state/dialog/slice";
import { PopUp } from "../../ui/popup"
import { useDispatch, useSelector } from "react-redux"


export const LearnToPlay = () => {
    const isOpen = useSelector(LearnToPlay__IsOpen);
    const dispatch = useDispatch();
    const ref = useRef();

    return (
        <div
        >
            <PopUp
                style={{
                    width: "300px",
                    height: "400px",
                    overflow: "auto"
                }}
                ref = {ref}
                open={isOpen}
                title={"Learn To Play"}
                draggable={true}
                resizable={true}
                onClose={ _ => dispatch(LearnToPlay__SetOpen(false))}
            >
                <div
                >
                <h2>What is the Goal of the Game?</h2> 
                <p> The objective of the game is to build and expand metro lines to help 
                    passengers reach their destinations efficiently. Try to keep the metro 
                    system running for as many days as possible! However, be cautious—if too 
                    many passengers are waiting at a station at the same time, and their needs 
                    are not met promptly, the game will end. Managing passenger flow and 
                    ensuring timely transport is key to maintaining a successful metro system.
                </p> 
                <h2>How to Build a New Line?</h2> 
                <p> To create a new line, click and hold the left mouse button on the station 
                    you want to start from, then drag it to another station where you want 
                    the line to end. You can build up to 8 lines in total.
                </p> 
                <h2>How to Expand a Line?</h2> 
                <p> You can expand an existing line from its endpoint. Each line ends with a 
                    train bumper. Click and hold the left mouse button on the bumper, then drag 
                    it to the station where you want to extend the line. 
                </p> 
                <h2>How to Delete a Line?</h2> 
                <p> To delete a line, click and hold the left mouse button on it, then connect it 
                    back to itself. If no train is on the line, or if it’s the last section of the 
                    line, it will be deleted immediately. If a train is on the line, it will turn 
                    gray and will be deleted once all trains have left the line. 
                </p> 
                <h2>How and When Do Passengers Spawn at a Station?</h2> 
                <p> Passengers spawn at stations at the start of each new day. The number of passengers 
                    depends on how long the station has existed in days. The maximum number of passengers 
                    that can spawn in a single day is 3. 
                </p> 
                <h2>How to Transport Passengers?</h2> 
                <p> Trains automatically pick up passengers as they travel towards the passengers' 
                    destinations. Passengers will always take the shortest route to their destination, 
                    regardless of the number of transfers needed. 
                </p> 
                <h2>When Does the Game End?</h2> 
                <p> The game will end if too many passengers wait too long at stations. You can monitor 
                    passenger satisfaction using the satisfaction bar in the top left corner. The satisfaction 
                    bar decreases if more than 10 passengers are waiting at a station simultaneously. 
                </p> 
                <h2>How to Add an Additional Train to a Line?</h2> 
                <p> You can add an additional train to a line once it has at least 10 sections. 
                    For every 10 sections built, you can add another train by double-clicking on the 
                    line section where you want to place the extra train. 
                </p>
                </div>
            </PopUp>
        </div>
    )
}