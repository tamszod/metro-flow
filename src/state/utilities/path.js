export const bfs = (graph, start, end) => {
    let queue = [[start]];
    let visited = new Set();
    
    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];
        
        if (node === end) {
            return path;
        }
        
        if (!visited.has(node)) {
            
            let neighbors = graph[node];

            for (let neighbor of neighbors) {
                let newPath = path.slice();
                newPath.push(neighbor);
                queue.push(newPath);
            }
        }
    }
    
    return null;
}