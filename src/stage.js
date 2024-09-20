import express from 'express';
import { authenticate, isCorrectStage, stage2AccountBypass } from './middleware.js';
import jwt from 'jsonwebtoken';
import userManager from './user_manager.js';
import fs from 'node:fs';

const maze = JSON.parse(fs.readFileSync('./src/maze.json').toString());

const router = express.Router();

router.get('/1', authenticate, (request, response) => {
    if (!request.auth) {
        const id = userManager.createUser();
        const token = jwt.sign({ id }, 'SecretKey');
        response.cookie('session', token);
    }

    response.render('stage1');
});

router.get('/2', authenticate, isCorrectStage(2), stage2AccountBypass, (request, response) => {
    response.render('stage2', { loggedIn: (request.auth.stage2Account && request.auth.stage2Account.account_name === 'r3n3gad3s' && request.auth.stage2Account.account_password === 'jobbin_pobbins') });
});

router.get('/3', authenticate, isCorrectStage(3), (request, response) => {
    response.render('stage3');
});

router.get('/4', authenticate, isCorrectStage(4), (request, response) => {
    response.render('stage4');
});

router.get('/5', authenticate, isCorrectStage(5), (request, response) => {
    let current = { x: 5, y: 5, z: 0 };
    let finalDirections = { n: false, s: false, e: false, w: false, S: false, E: false };
    for (let i = 0; i < maze[current.z][current.y * 10 + current.x].split('').length; i++) {
        finalDirections[maze[current.z][current.y * 10 + current.x].split('')[i]] = true;
    }

    if (current.z == 0) finalDirections.S = false;

    response.render('stage5', { directions: finalDirections, invalid: false, flag: '' });
});

router.get('/5/:directions', authenticate, isCorrectStage(5), (request, response) => {
    let directions = request.params.directions;
    if (request.params.directions == null) {
        directions = '';
    }

    let current = { x: 5, y: 5, z: 0 };
    let invalid = false;
    for (let i = 0; i < directions.length; i++) {
        if (maze[current.z][current.y * 10 + current.x].includes(directions[i])) {
            switch (directions[i]) {
                case 'n':
                    current.y--;
                    break;
                case 's':
                    current.y++;
                    break;
                case 'e':
                    current.x++;
                    break;
                case 'w':
                    current.x--;
                    break;
                case 'E':
                    current.z++;
                    break;
                case 'S':
                    current.z--;
                    break;
            }
        } else {
            invalid = true;
        }
    }

    console.log(maze[current.z][current.y * 10 + current.x]);

    let finalDirections = { n: false, s: false, e: false, w: false, S: false, E: false };
    let flag = '';
    for (let i = 0; i < maze[current.z][current.y * 10 + current.x].split('').length; i++) {
        finalDirections[maze[current.z][current.y * 10 + current.x].split('')[i]] = true;
        if (maze[current.z][current.y * 10 + current.x].split('')[i] == 'X') {
            flag = 'flag{this_isnt_a_corn_maze_28131}';
        }
    }

    if (current.z == 0) finalDirections.S = false;

    response.render('stage5', { directions: finalDirections, invalid, flag });
});

router.get('/6', authenticate, isCorrectStage(6), (request, response) => {
    response.render('stage6');
});

export default router;