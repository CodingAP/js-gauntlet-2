// path: nnnnneeseneEwwswwnwswnwsssswwsseessseennwnnnnnesssesesssenesennnwsEwnwnnesenenwnennwswswnwsEswnwssseswwnwsseeeeeswseeenwnennennwswnEeesswswwseeEenwwsseeswwwnnnwssswnwswnwswnnnennwsEsssseeeeeeeenennnwwswseeEwwnwssswnwwswwnneEessennesesenenwwnEneenneenwwnnwwswnwwwseseeswssswsw

const cookie = 'session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBrd3FtZmoyOGNzdGVsdnQiLCJpYXQiOjE3MzAyNTI3NzB9.r_loXDhY54C4UoN8AAeFQj7M3NTWwP9Y9u_gAGiRxgI';

const getPaths = async (currentPath) => {
    const response = await fetch(`https://razorhack-js-gauntlet-2.chals.io/stage/5/${currentPath}`, {
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
let finalPath = '';
let level = 1;

while (queue.length != 0) {
    let item = queue.shift();

    const paths = await getPaths(finalPath + item.path);
    if (paths.includes('E')) {
        finalPath += item.path + 'E'; 
        queue = [{ x: item.x, y: item.y, path: '' }];
        visited = { [`${item.x},${item.y}`]: true };

        console.log('On Level:', ++level);

        continue;
    }

    for (let i = 0; i < paths.length; i++) {
        let newPosition = { x: item.x + directions[paths[i]].x, y: item.y + directions[paths[i]].y };
        if (!visited[newPosition.x + ',' + newPosition.y]) {
            visited[newPosition.x + ',' + newPosition.y] = true;
            queue.push({ x: newPosition.x, y: newPosition.y, path: item.path + paths[i] });
        }
    }
}

finalPath = finalPath.slice(0, finalPath.length - 1);
console.log(finalPath);