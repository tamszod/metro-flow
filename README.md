# Metro Flow

A small web game created using ReactFlow and Redux. The goal is to satisfy demand of the passengers by building metro lines between stations! Try out the game at https://metro-flow.netlify.app/!


# Version

The game currently in alpha so major features are still to come!

# Alpha 2.1 (2024.06.15)
<strong>Quality of Life:</strong><br />
&emsp;» Redesigned the line section deletion system. Now lines can be deleted on touch devices.<br />
&emsp;» In order to delete a line, you have to connect the end of it into itself. It will be mark for deletion. If a line is being used it will stay up till the trains leave it.<br />
<strong>Bug Fixes:</strong><br />
&emsp;» Improved performace on path finding.<br />
&emsp;» Restarting the game resulting in crash has been fixed.<br />
&emsp;» End of line should be visually correct.<br />


# Alpha 2.0 - The Passenger Update (2024.05.31)
<img width="500" alt="Alpha 2.0 Metro-Flow" src="https://github.com/tamszod/metro-flow/assets/126774257/448345e4-ffcc-4c2e-813f-9101acb36a13"><br />
&emsp;» Each revealed station will spawn passengers at the start of the round depending on how many days it has been revealed.<br />
&emsp;» Hovering the stations will shown the passengers travel destination.<br />
&emsp;» The metros will pick up the passengers and transfer them in direction to their goal.<br />
&emsp;» The passengers will take the shortest route not caring how many transfers it takes.<br />
&emsp;» You can see the number of passengers the train currently carrying.<br />
&emsp;» At the right top corner you can see how many passengers have reached their goal so far.<br />
<strong>Known issues:</strong><br />
&emsp;» At a station the end of some line might be visually bugged.<br />
&emsp;» Restarting the game results in crash (It will be fixed in Alpha 2.1).<br />


# Alpha 1.0 (2024.05.23)
&emsp;» You can start a new day or restart the game.<br />
&emsp;» When a day starts a set number of stations will appear on the map.<br />
&emsp;» Each station has a unique name.<br />
&emsp;» You can build lines up to 7 different one.<br />
&emsp;» Each line has a unique color.<br />
&emsp;» You can add a create a line betweem 2 stations or expand an existing one by dragging its terminal symbol.<br />
