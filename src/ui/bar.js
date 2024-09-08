export const RProgressBar = ({
    style = {}, 
    progress = null,
    barColor = "lightgray",
    progressColor = "gray",
}) => {
    return (
        <div
            style={{
                width: style.width ?? 300,
                height:  style.width ?? 6,
                backgroundColor: barColor,
                border: "solid black 1px",
                borderRadius: "25px",
            }}
        >
            <div
                style={{
                    width: `${progress*100}%`,
                    height:  style.width ?? 6,
                    backgroundColor: progressColor,
                }}
            />
        </div>
    )
}