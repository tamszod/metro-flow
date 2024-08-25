

const GetClockHandPositon = (radius, progress) => {
    // Return a list [x,y] where the clock hand points depending on the progress from the middle of the given circle created by radius.
    if (progress == null || !radius) {
        return [];
    }  
    let angle = 2 * Math.PI * progress - (Math.PI / 2);
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    return [x, y];
}



export const Clock = ({
    size = 20,
    primaryTick = null, // A value between 0 <= primaryTick < 1. If null the tick is not displayed.
    secondaryTick = null, // A value between 0 <= primaryTick < 1. If null the tick is not displayed.
}) => {
    const origo = size/2;
    const radius = origo-1;
    let [primaryTickX, primaryTickY] = GetClockHandPositon(radius*0.8, primaryTick);
    let [secondaryTickX, secondaryTickY] = GetClockHandPositon(radius*0.5, secondaryTick);
    return (
        <>
             <svg width={size} height={size}>
                <circle cx={origo} cy={origo} r={radius-1} stroke="black" strokeWidth="1" fill="none"/>
                {primaryTick != null ? <path id="" d={`M ${origo} ${origo} l ${primaryTickX} ${primaryTickY}`} stroke="black" strokeWidth="0.5" fill="none"/> : <></>}
                {secondaryTick != null ? <path id="" d={`M ${origo} ${origo} l ${secondaryTickX} ${secondaryTickY}`} stroke="black" strokeWidth="0.5" fill="none"/> : <></>}
            </svg>
        </>
    )
}