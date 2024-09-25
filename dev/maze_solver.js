// path: nnnnneeseneEwwswwnwswnwsssswwsseessseennwnnnnnesssesesssenesennnwsEwnwnnesenenwnennwswswnwsEswnwssseswwnwsseeeeeswseeenwnennennwswnEeesswswwseeEenwwsseeswwwnnnwssswnwswnwswnnnennwsEsssseeeeeeeenennnwwswseeEwwnwssswnwwswwnneEessennesesenenwwnEneenneenwwnnwwswnwwwseseeswssswsw

const cookie = 'session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWN5ZDhoMXRxM2tsYzgiLCJpYXQiOjE3MjcyMzMwNzR9.l4AUw-qBX2wg9ipzOZwiC9_5rdk43dhytrREWOEQKmU';

const getPaths = async (currentPath) => {
    const response = await fetch(`http://localhost:1338/stage/5/nnnnneeseneEwwswwnwswnwsssswwsseessseennwnnnnnesssesesssenesennnwsEwnwnnesenenwnennwswswnwsEswnwssseswwnwsseeeeeswseeenwnennennwswnEeesswswwseeEenwwsseeswwwnnnwssswnwswnwswnnnennwsEsssseeeeeeeenennnwwswseeEwwnwssswnwwswwnneEessennesesenenwwnEneenneenwwnnwwswnwwwseseeswssswswE${currentPath}`, {
        headers: { cookie }
    })
    const html = await response.text();

    let paths = [];
    if (html.toLowerCase().includes('north')) paths.push('n');
    if (html.toLowerCase().includes('south')) paths.push('s');
    if (html.toLowerCase().includes('east')) paths.push('e');
    if (html.toLowerCase().includes('west')) paths.push('w');
    if (html.toLowerCase().includes('down')) paths.push('E');
    return paths;
}

const directions = {
    n: { x: 0, y: 1 },
    s: { x: 0, y: -1 },
    e: { x: 1, y: 0 },
    w: { x: -1, y: 0 }
}

let queue = [{ x: 0, y: 0, path: '' }];
let visited = { '0,0': true };

while (queue.length != 0) {
    let item = queue.shift();

    const paths = await getPaths(item.path);
    if (paths.includes('E')) {
        console.log(item.path);
        break;
    }

    for (let i = 0; i < paths.length; i++) {
        let newPosition = { x: item.x + directions[paths[i]].x, y: item.y + directions[paths[i]].y };
        if (!visited[newPosition.x + ',' + newPosition.y]) {
            visited[newPosition.x + ',' + newPosition.y] = true;
            queue.push({ x: newPosition.x, y: newPosition.y, path: item.path + paths[i] });
        }
    }
}