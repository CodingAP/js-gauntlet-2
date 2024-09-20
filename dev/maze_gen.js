import mazeGen from '@sbj42/maze-generator';
import fs from 'fs';
import { PNG } from 'pngjs';

const size = 10;
const pixelSize = 10;
let mazeJson = [];
let mazePictures = [];
for (let i = 0; i < size; i++) {
    let mazePNG = new PNG({
        width: size * pixelSize,
        height: size * pixelSize,
        colorType: 2
    });
    
    for (let y = 0; y < mazePNG.height; y++) {
        for (let x = 0; x < mazePNG.width; x++) {
            let idx = (mazePNG.width * y + x) * 4;
    
            mazePNG.data[idx] = 255;
            mazePNG.data[idx + 1] = 255;
            mazePNG.data[idx + 2] = 255;
            mazePNG.data[idx + 3] = 255;
        }
    }

    mazePictures.push(mazePNG);
}

let current = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) };
for (let i = 0; i < size; i++) {
    let end = { x: current.x, y: current.y };
    while (current.x == end.x && current.y == end.y) {
        end = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) };
    }

    const maze = mazeGen.generate(size, size, {
        generator: '@sbj42/maze-generator-backtrack'
    });

    const mazeData = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = maze.cell(x, y);
            let str = '';
            if (cell.north()) str += 'n';
            if (cell.south()) str += 's';
            if (cell.east()) str += 'e';
            if (cell.west()) str += 'w';
            if (x == current.x && y == current.y) str += 'S';
            if (x == end.x && y == end.y) str += 'E';
            mazeData.push(str);

            if (!cell.north()) {
                for (let j = 0; j < pixelSize; j++) {
                    let idx = (mazePictures[i].width * (y * pixelSize) + ((x * pixelSize) + j)) * 4;

                    mazePictures[i].data[idx] = 0;
                    mazePictures[i].data[idx + 1] = 0;
                    mazePictures[i].data[idx + 2] = 0;
                    mazePictures[i].data[idx + 3] = 255;
                }
            }
            if (!cell.south()) {
                for (let j = 0; j < pixelSize; j++) {
                    let idx = (mazePictures[i].width * (y * pixelSize + 9) + ((x * pixelSize) + j)) * 4;

                    mazePictures[i].data[idx] = 0;
                    mazePictures[i].data[idx + 1] = 0;
                    mazePictures[i].data[idx + 2] = 0;
                    mazePictures[i].data[idx + 3] = 255;
                }
            }
            if (!cell.east()) {
                for (let j = 0; j < pixelSize; j++) {
                    let idx = (mazePictures[i].width * (y * pixelSize + j) + (x * pixelSize + 9)) * 4;

                    mazePictures[i].data[idx] = 0;
                    mazePictures[i].data[idx + 1] = 0;
                    mazePictures[i].data[idx + 2] = 0;
                    mazePictures[i].data[idx + 3] = 255;
                }
            }
            if (!cell.west()) {
                for (let j = 0; j < pixelSize; j++) {
                    let idx = (mazePictures[i].width * (y * pixelSize + j) + (x * pixelSize)) * 4;

                    mazePictures[i].data[idx] = 0;
                    mazePictures[i].data[idx + 1] = 0;
                    mazePictures[i].data[idx + 2] = 0;
                    mazePictures[i].data[idx + 3] = 255;
                }
            }
            if (x == current.x && y == current.y) {
                for (let j = -2; j <= 2; j++) {
                    for (let k = -2; k <= 2; k++) {
                        let idx = (mazePictures[i].width * (y * pixelSize + j + pixelSize / 2) + (x * pixelSize + k + pixelSize / 2)) * 4;

                        mazePictures[i].data[idx] = 0;
                        mazePictures[i].data[idx + 1] = 255;
                        mazePictures[i].data[idx + 2] = 0;
                        mazePictures[i].data[idx + 3] = 255;
                    }
                }
            }
            if (x == end.x && y == end.y) {
                for (let j = -2; j <= 2; j++) {
                    for (let k = -2; k <= 2; k++) {
                        let idx = (mazePictures[i].width * (y * pixelSize + j + pixelSize / 2) + (x * pixelSize + k + pixelSize / 2)) * 4;

                        mazePictures[i].data[idx] = 255;
                        mazePictures[i].data[idx + 1] = 0;
                        mazePictures[i].data[idx + 2] = 0;
                        mazePictures[i].data[idx + 3] = 255;
                    }
                }
            }
        }
    }

    mazeJson.push(mazeData);

    current = end;
}

fs.writeFileSync('maze.json', JSON.stringify(mazeJson));

for (let i = 0; i < mazePictures.length; i++) {
    mazePictures[i].pack().pipe(fs.createWriteStream(`maze/${i}.png`));
}