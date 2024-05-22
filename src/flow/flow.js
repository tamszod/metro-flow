import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Station from './utils/station'
import ReactFlow, { ControlButton, Controls, ReactFlowProvider, addEdge, useEdgesState, useNodesState, useReactFlow } from "reactflow"
import Line from "./utils/line";
import 'reactflow/dist/style.css';
import { SiMetrodeparis } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { startRoundAction } from "../state/logic";
import { addEdges, buildLine, onEdgesChange, revealStation } from "../state/slice";
import { calculateRoundTime, selectEdges, selectNodes } from "../state/selectors";
import { pace } from "../config";

const proOptions = { hideAttribution: true };

export const Flow = () => {
    const dispatch = useDispatch();
    const roundTime = useSelector(calculateRoundTime)
    const edges = useSelector(selectEdges);
    const nodes = useSelector(selectNodes);
    const [round, setRound] = useState(0)
    const [coords, setCoords] = useState([]);
    const [unclaimedTiles, setUnclaimedTiles] = useState([{x:0, y:0}]);
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0)
    const intervalRef = useRef();
    //const { setViewport, zoomIn, zoomOut } = useReactFlow();
    const [x, setX] = useState(200);
    const [y, setY] = useState(200);
    const [zoom, setZoom] = useState(1);

    const game = useSelector(state => state.game)

    useEffect(() => {
        if (started){
            if (timeLeft > 0){
                if (timeLeft % pace === 0){
                    dispatch(revealStation());
                }
                intervalRef.current = setInterval(() => {
                    setTimeLeft(timeLeft - 1)
                }, 1000);
                return () => clearInterval(intervalRef.current);
            } 
        }
    }, [timeLeft, started]);

    useEffect(() => {
        if (timeLeft == 0){
            setStarted(false);
        }
    }, [timeLeft, setStarted]);

    const nodeTypes = useMemo(() => ({ station: Station }), []);
    const edgeTypes = useMemo(() => ({ line: Line }), []);

    const start = async () => {
        setStarted(true);
        dispatch(await startRoundAction(setTimeLeft));
        setRound(r => r + 1);
    }

    return (
        <>

<h1>Day {round}</h1>
            <p>{started && timeLeft === 0 ?
            <>Loading</>
            :
            <>
                {
                started
            ? 
            <>{timeLeft}s time left</>
                :
                <button onClick={event => {start()}}>Start</button>
                }
            </>
            }</p>
            <div
                style={{
                    width: "95vw",
                    height: "75vh",
                }}
            >
                <ReactFlowProvider>
                    <ReactFlow
                        style={{
                        border: "black 2px solid",
                        background:"white"}}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        proOptions={proOptions}
                        nodes={nodes} 
                        edges={edges}
                        connectionMode={"loose"}
                        onEdgesChange={(e) => dispatch(onEdgesChange(e))}
                        onConnect={(e) => dispatch(buildLine(e))}
                    >
                    <Controls 
                        showZoom={false}
                        showFitView={false}
                        showInteractive={false}
                        position="top"
                    >
                        <ControlButton style={{background:"black"}}
                        draggable
                        onClick={() => alert('Something magical just happened. ✨')}>
                            <SiMetrodeparis style={
                                {
                                    color:"yellow",
                                    background:"black",
                                }
                                }/>
                        </ControlButton>
                        <ControlButton style={{background:"black"}}
                        onClick={() => alert('Something magical just happened. ✨')}>
                            <SiMetrodeparis style={
                                {
                                    color:"red",
                                    background:"black",
                                }
                                }/>
                        </ControlButton>
                        <ControlButton style={{background:"black"}}
                        onClick={() => alert('Something magical just happened. ✨')}>
                            <SiMetrodeparis style={
                                {
                                    color:"blue",
                                    background:"black",
                                }
                                }/>
                        </ControlButton>
                        <ControlButton style={{background:"black"}}
                        onClick={() => alert('Something magical just happened. ✨')}>
                            <SiMetrodeparis style={
                                {
                                    color:"green",
                                    background:"black",
                                }
                                }/>
                        </ControlButton>
                        <ControlButton style={{background:"black"}}
                        onClick={() => alert('Something magical just happened. ✨')}
                                disabled
                        >
                            <SiMetrodeparis style={
                                {
                                    color:"pink",
                                    background:"black",
                                }
                                }/>




                        </ControlButton>
                    </Controls>
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </>
    )
}