import fs from 'fs';
import express from 'express';
import { authenticate } from './middleware.js';
import userManager from './user_manager.js';

// _have_bea
// aW5kZXguanM=

const router = express.Router();

router.post('/stage1/check', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else if (!request.body || !Array.isArray(request.body) || request.body.length === 0) {
        response.status(200).json({ flag: 'I don\'t like cheaters! Do it right!' });
    } else {
        const answer = [
            'ArrowUp',   'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'b',         'a'
        ];
    
        let matches = true;
        for (let i = 0; i < request.body.length; i++) {
            if (request.body[i] !== answer[i]) matches = false;
        }
    
        response.status(200).json({ flag: matches ? 'flag{30_lives_for_you_38201}' : 'I don\'t like cheaters! Do it right!' });

        const user = userManager.getUser(request.auth.id);
        if (matches && user.stage === 1) userManager.nextStage(request.auth.id);
    }
});

router.post('/stage2/login', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        response.status(200).json({ error: 'Logins have been disabled by R3n3gad3s, but don\'t use password \'jobbin_pobbins\'!' });
    }
});

router.get('/stage3/init', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        const user = userManager.getUser(request.auth.id);
        if (user.data.stage3) {
            user.data.stage3.lastPlayerScore = 0;
            user.data.stage3.lastCpuScore = 0;
        } else {
            user.data.stage3 = {
                lastPlayerScore: 0,
                lastCpuScore: 0,
                lastTime: new Date().getTime(),
                inTimeout: false
            };
        }
        response.sendStatus(200);
    }
});

router.post('/stage3/check', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        const user = userManager.getUser(request.auth.id);

        const passedTime = new Date().getTime() - user.data.stage3.lastTime;
        if (user.data.stage3.inTimeout && passedTime < 300000) {
            response.status(200).json({ timeout: true, flag: `You are in a timeout! You have ${((300000 - passedTime) / 60000).toFixed(2)} minutes left and your score is reset!` });
            
            // reset player score
            user.data.stage3.lastPlayerScore = 0;
            user.data.stage3.lastCpuScore = 0;
        } else {
            user.data.stage3.inTimeout = false;
            user.data.stage3.lastTime = new Date().getTime();

            if (!request.body) {
                user.data.stage3.inTimeout = true;
                user.data.stage3.lastPlayerScore = 0;
                user.data.stage3.lastCpuScore = 0;
                response.status(200).json({ timeout: true, flag: 'Don\'t touch the endpoint! 5 minute timeout for you!' });
            } else {
                const ballXPosition = request.body.ballXPosition || request.body.var_29;
                const playerScore = request.body.playerScore || request.body.var_62;
                const cpuScore = request.body.cpuScore || request.body.var_95;
                const totalWidth = request.body.totalWidth || request.body.var_18;

                if (passedTime < 3000 && !firstScore) {
                    user.data.stage3.inTimeout = true;
                    user.data.stage3.lastPlayerScore = 0;
                    user.data.stage3.lastCpuScore = 0;
                    response.status(200).json({ timeout: true, flag: 'Don\'t spam the endpoint! 5 minute timeout for you!' });
                } else if (!ballXPosition && !playerScore && !cpuScore && !totalWidth) {
                    user.data.stage3.inTimeout = true;
                    user.data.stage3.lastPlayerScore = 0;
                    user.data.stage3.lastCpuScore = 0;
                    response.status(200).json({ timeout: true, flag: 'Don\'t touch the endpoint! 5 minute timeout for you!' });
                } else {
                    let flag = '';

                    if ((playerScore != 0 && cpuScore != 0) && Math.abs((playerScore - user.data.stage3.lastPlayerScore) + (cpuScore - user.data.stage3.lastCpuScore)) > 1) {
                        user.data.stage3.inTimeout = true;
                        user.data.stage3.lastPlayerScore = 0;
                        user.data.stage3.lastCpuScore = 0;
                        flag = 'I don\'t like score-changing cheaters! 5 minute timeout for you!';
                    }

                    if (playerScore - user.data.stage3.lastPlayerScore === 1 && Math.abs(totalWidth - ballXPosition) >= 30) {
                        user.data.stage3.inTimeout = true;
                        user.data.stage3.lastPlayerScore = 0;
                        user.data.stage3.lastCpuScore = 0;
                        flag = 'I don\'t like ball-moving cheaters! 5 minute timeout for you!';
                    }

                    if (!user.data.stage3.inTimeout) {
                        user.data.stage3.lastPlayerScore = playerScore;
                        user.data.stage3.lastCpuScore = cpuScore;

                        if (playerScore >= 5) {
                            flag = 'flag{hey_stop_looking_there_23912}';
                            if (user.stage === 3) userManager.nextStage(request.auth.id);
                        }
                    }
                    
                    response.status(200).json({ timeout: user.data.stage3.inTimeout, flag });
                }
            }
        }
    }
});

router.post('/stage4/request', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        const forwarded = request.headers['X-Forwarded-For'] || request.headers['x-forwarded-for'];
    
        if (forwarded != '194.242.26.157') {
            response.status(200).json({ error: 'You are not in the correct location!' });
        } else {
            response.status(200).json({ flag: 'Flag: flag{so_no_headers_28013}' });

            const user = userManager.getUser(request.auth.id);
            if (user.stage === 4) userManager.nextStage(request.auth.id);
        }
    }
});

router.get('/stage6/init', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        const user = userManager.getUser(request.auth.id);
        if (!user.data.stage6) {
            userManager.createDatabase(request.auth.id);
        }

        response.status(200).send('Please don\'t spam this endpoint, it does nothing for the challenge! - Alex');
    }
});

router.post('/stage6/create_ticket', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        if (!request.body.summary || !request.body.description) {
            response.sendStatus(400);
        } else {
            try {
                userManager.insertTicket(request.auth.id, request.body);
                if (userManager.getModifiedTicket(request.auth.id)['TICKET_COMPLETE'] == 1) {
                    userManager.insertTicket(request.auth.id, { summary: 'The Flag', description: 'flag{legit_number_one_19373}' });
                    const user = userManager.getUser(request.auth.id);
                    if (user.stage === 6) userManager.nextStage(request.auth.id);
                }
                response.sendStatus(200);
            } catch (e) {
                response.sendStatus(500);
            }
        }
    }
});

router.get('/stage6/list_tickets', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        response.status(200).json(userManager.getAllTickets(request.auth.id));
    }
});

router.get('/stage7/init', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else {
        const user = userManager.getUser(request.auth.id);
        let seed = Math.floor(Math.random() * Math.pow(2, 31));
        if (!user.data.stage7) {
            user.data.stage7 = { seed };
        } else {
            seed = user.data.stage7.seed;
        }
        user.data.stage7.started = new Date().getTime();
        
        const pieces = simulatePuzzle(user.data.stage7.seed);
        response.status(200).json({ pieces });
    }
});

router.post('/stage7/check', authenticate, (request, response) => {
    if (!request.auth || !userManager.getUser(request.auth.id)) {
        response.sendStatus(401);
    } else if (!request.body || !Array.isArray(request.body) || request.body.length === 0) {
        response.status(200).json({ flag: 'I don\'t like cheaters! Do it right!' });
    } else {
        const user = userManager.getUser(request.auth.id);
        if (!user.data.stage7) {
            response.sendStatus(401);
        } else {
            try {
                let passedTime = new Date().getTime() - user.data.stage7.started;
                if (passedTime > 5 * 60 * 1000) {
                    response.status(200).json({ flag: 'Sorry, time is up!' });
                } else if (checkPuzzle(user.data.stage7.seed, request.body)) {
                    response.status(200).json({ flag: 'flag{i_actually_wasnt_sorry_83911}' });
                    if (user.stage === 7) userManager.nextStage(request.auth.id);
                } else {
                    response.status(200).json({ flag: 'I don\'t like cheaters! Do it right!' });
                }
            } catch (e) {
                response.sendStatus(500);
            }
        }
    }
});

router.post('/stage8/send_notification', authenticate, (request, response) => {
    if (!request.auth) {
        response.sendStatus(401);
    } else {
        if (!request.body.message) {
            response.sendStatus(400);
        } else {
            let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const random = new Array(10).fill(0).map(_ => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
            fs.writeFile('logs/' + random + '.log', request.body.message + ' - From R3n3gad3s', (error) => {
                if (error) response.sendStatus(500);
                else response.sendStatus(200);
            });
        }
    }
});

router.get('/stage8/get_all_notifications', authenticate, (request, response) => {
    if (!request.auth) {
        response.sendStatus(401);
    } else {
        fs.readdir('logs', (error, files) => {
            if (error) response.sendStatus(500);
            response.status(200).json(files);
        });
    }
});

router.post('/stage8/show_notification', authenticate, (request, response) => {
    if (!request.auth) {
        response.sendStatus(401);
    } else {
        fs.readFile(request.body.file, (error, data) => {
            if (error) response.sendStatus(500);
            else response.status(200).json({ data });
        });
    }
});

const simulatePuzzle = (seed) => {
    let state = seed;
    const randomFloat = () => {
        state = (1103515245 * state + 12345) % Math.pow(2, 31);
        return state / Math.pow(2, 31);
    }

    const width = 32;
    const height = 20;
    let pieces = [];
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = y * width + x;
            pieces[index] = { x, y };
        }
    }

    for (let i = 0; i < pieces.length; i++) {
        let index = Math.floor(randomFloat() * pieces.length);
        let temp = JSON.stringify(pieces[i]);
        pieces[i] = pieces[index];
        pieces[index] = JSON.parse(temp);
    }
    
    return pieces;
}

const checkPuzzle = (seed, moves) => {
    const width = 32;
    const height = 20;
    const pieces = simulatePuzzle(seed);
    
    for (let i = 0; i < moves.length; i++) {
        let temp = JSON.stringify(pieces[moves[i].from]);
        pieces[moves[i].from] = pieces[moves[i].to];
        pieces[moves[i].to] = JSON.parse(temp);
    }

    let sorted = true;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = y * width + x;
            if (!(pieces[index].x == x && pieces[index].y == y)) {
                sorted = false;
            }
        }
    }

    return sorted;
}

export default router;