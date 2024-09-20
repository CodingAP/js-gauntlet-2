const generateID = () => {
    const CHARS = 'abcdefghijklmnopqurstuvwxyz0123456789';
    return new Array(16).fill(0).map((_) => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

class UserManager {
    constructor() {
        this.users = {};
    }

    createUser() {
        const id = generateID();
        this.users[id] = {
            stage: 1,
            data: {}
        }
        return id;
    }

    getUser(id) {
        return this.users[id];
    }

    nextStage(id) {
        this.users[id].stage++;
        if (this.users[id].stage > 8) this.users[id].stage = 8;

        console.log(this.users);
    }
}

const userManager = new UserManager();

export default userManager;