export const bfs = (graph, start, end) => {
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
}
/*
export const bfs = (graph, start, end) => {
    console.log(graph, start, end);
    let queue = [[start]]; // Initialize the queue with the start node
    let visited = new Set(); // Create a set to track visited nodes
    visited.add(start); // Mark the start node as visited
    
    while (queue.length > 0) {
        let path = queue.shift(); // Dequeue the first path
        let node = path[path.length - 1]; // Get the last node in the path
        
        if (node === end) {
            console.log(start, end, "path");
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
    console.log(start, end, "no path");
    
    return null; // Return null if no path is found
}
*/