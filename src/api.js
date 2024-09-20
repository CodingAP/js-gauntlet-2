import express from 'express';
import { authenticate } from './middleware.js';
import userManager from './user_manager.js';

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
            user.data.stage3.inTimeout = true;
            user.data.stage3.lastPlayerScore = 0;
            user.data.stage3.lastCpuScore = 0;
            response.status(200).json({ message: 'Don\'t touch the endpoint! 5 minute timeout for you!' });
        } else {
            user.data.stage3 = {
                lastPlayerScore: 0,
                lastCpuScore: 0,
                lastTime: new Date().getTime(),
                inTimeout: false
            };
            response.status(200).json({ message: '' });
        }
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

                    if (playerScore - user.data.stage3.lastPlayerScore === 1 && Math.abs(totalWidth - ballXPosition) >= 5) {
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
                        }
                    }
                    
                    response.status(200).json({ timeout: user.data.stage3.inTimeout, flag });
                }
            }
        }
    }
});

router.post('/stage4/request', authenticate, (request, response) => {
    const forwarded = request.headers['X-Forwarded-For'] || request.headers['x-forwarded-for'];
    
    if (forwarded != '194.242.26.157') {
        response.status(200).json({ error: 'You are not in the correct location!' });
    } else {
        response.status(200).json({ data: 'Flag: flag{so_no_headers_28013}' });
    }
});

export default router;