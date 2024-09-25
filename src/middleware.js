import jwt from 'jsonwebtoken';
import userManager from './user_manager.js';

const DEBUG = false;

const authenticate = (request, response, next) => {
    if (!request.cookies.session) request.auth = null;

    try {
        const decoded = jwt.verify(request.cookies.session, 'SecretKey');
        if (!userManager.getUser(decoded.id)) {
            request.auth = null;
        } else {
            request.auth = { id: decoded.id };
        }
    } catch (error) {
        request.auth = null;
    }

    next();
}

const isCorrectStage = (stage) => {
    return (request, response, next) => {
        if (request.auth) {
            const user = userManager.getUser(request.auth.id);
            if (user && (user.stage >= stage || DEBUG)) {
                next(); 
            } else {
                response.redirect('/stage/1');
            }
        } else {
            response.redirect('/stage/1');
        }  
    }
}

const stage2AccountBypass = (request, response, next) => {
    const account = request.cookies.account;
    if (!account) {
        request.auth.stage2Account = null;
    } else {
        try {
            const decoded = JSON.parse(atob(account));
            request.auth.stage2Account = decoded;
        } catch (error) {
            request.auth.stage2Account = null;
        }
    }

    next();
}

export {
    authenticate,
    isCorrectStage,
    stage2AccountBypass
};