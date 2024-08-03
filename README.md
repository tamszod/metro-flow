# Metro Flow

A small web game created using ReactFlow and Redux. The goal is to satisfy demand of the passengers by building metro lines between stations! Try out the game at https://metro-flow.netlify.app/!


# Version

The game currently in alpha so major features are still to come!

# Alpha 2.2.1 (2024.08.02)
<strong>Gameplay</strong><br/>
&emsp;- Trains default speed has been decreased by 20%.<br/>
&emsp;- The first round has been shortened compared to others.<br/>

<strong>Bugfixes</strong><br/>
&emsp;- Fixed an issue which disallowed restarting the game after it was game over.<br/>
&emsp;- Fixed an issue where the life time timer was still ticking eventhough the round was over.<br/>

<strong>Known Issues:</strong><br />
&emsp;- If you build shared sections between different lines. Only one of them will be visible. (To be fixed in 3.1)<br/>
&emsp;- If you have shared sections of lines and delete one of them the route will be inaccessable for passengers until you delete the other section and rebuild it. (To be fixed in 3.1)<br/>
&emsp;- If you add extra trains to a line then delete sections and the criteria is no longer met, the extra trains will be not removed.<br/>

# Alpha 2.2 (2024.07.29)
<strong>Gameplay</strong><br/>
&emsp;- The trains will only move when the day is going.<br/>
&emsp;- The round timer has been increased as an adjustment to the train changes.<br/>
&emsp;- After 10 sections build for a singular line you can add an extra train by double clicking on a section of the line.<br/>
&emsp;- Passengers are represented by small circles which are the same color as their destination.<br/>
&emsp;- If you keep a station too busy for 60 seconds the game will be over. A station is busy when more than 10 people are waiting.<br/>
&emsp;- The maximum capacity of a train is 8 passengers.<br/>
&emsp;- A train generates as many passengers as many day old it is until it is 4 days old, at that point it will generate 4 passengers per day. <br/>

<strong>Performance</strong><br/>
&emsp;- Decreased lag while playing. All trains should be synchronised to each other in each frame.<br/>

<strong>Bugfixes</strong><br/>
&emsp;- Fixed app freeze at the start of a new day or mid game when a train enters a station. It was caused by circular routes resulting the pathfinder entering into an infinite loop at some cases.<br/>
&emsp;- Fixed an issue where trains were invisible when stopping at stations.<br/>

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
