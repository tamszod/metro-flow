/*export const bfs = (graph, start, end) => {
    console.log(graph, start, end);
    let queue = [[start]]; // Initialize the queue with the start node
    let visited = new Set(); // Create a set to track visited nodes
    
    while (queue.length > 0) {
        let path = queue.shift(); // Dequeue the first path
        let node = path[path.length - 1]; // Get the last node in the path
        
        if (node === end) {
            console.log(start, end, "path");
            return path; // Return the path if the end node is found
        }
        
        if (!visited.has(node)) {
            visited.add(node); // Mark the node as visited
            
            let neighbors = graph[node]; // Get the neighbors of the node

            for (let neighbor of neighbors) {
                let newPath = path.slice(); // Create a new path with the neighbor
                newPath.push(neighbor);
                queue.push(newPath); // Enqueue the new path
            }
        }
    }
    console.log(start, end, "no path");
    
    return null; // Return null if no path is found
}*/
export const bfs = (graph, start, end) => {
    let queue = [[start]]; // Initialize the queue with the start node
    let visited = new Set(); // Create a set to track visited nodes
    visited.add(start); // Mark the start node as visited
    
    while (queue.length > 0) {
        let path = queue.shift(); // Dequeue the first path
        let node = path[path.length - 1]; // Get the last node in the path
        
        if (node === end) {
            return path; // Return the path if the end node is found
        }
        
        let neighbors = graph[node]; // Get the neighbors of the node

        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor); // Mark the neighbor as visited
                let newPath = [...path, neighbor]; // Create a new path with the neighbor
                queue.push(newPath); // Enqueue the new path
            }
        }
    }
    
    return null; // Return null if no path is found
}

const heuristic = (a, b) => {
    return 0;
}

export const aStar = (graph, start, end) => {
    console.log(graph, start, end);

    // Priority queue for the open list
    let openList = [[start]];
    let openSet = new Set([start]);
    
    // Dictionaries to keep track of the path and cost
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    for (let node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }

    gScore[start] = 0;
    fScore[start] = heuristic(start, end);

    while (openList.length > 0) {
        // Get the node in the open list with the lowest fScore value
        openList.sort((a, b) => fScore[a[a.length - 1]] - fScore[b[b.length - 1]]);
        let path = openList.shift();
        let current = path[path.length - 1];

        // If we reached the goal, reconstruct and return the path
        if (current === end) {
            console.log(start, end, "path");
            return path;
        }

        openSet.delete(current);

        for (let neighbor in graph[current]) {
            let tentativeGScore = gScore[current] + graph[current][neighbor];

            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);

                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                    let newPath = [...path, neighbor];
                    openList.push(newPath);
                }
            }
        }
    }

    console.log(start, end, "no path");
    return null; // Return null if no path is found
}

export const findPath = (g, a, b) => {

}