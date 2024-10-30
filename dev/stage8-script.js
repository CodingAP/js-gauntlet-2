import fs from 'node:fs';

const cookie = 'session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im9pMGN1a3NodnZmODFhYTEiLCJpYXQiOjE3MjcyMzUwMTd9.QzFus6zl_u1T-1UN1AmKpR4EJc4_iqG_JBYXuaTj7lM';
const file = 'public/img/congrats.png';

fetch('http://localhost:1338/api/stage8/show_notification', {
    method: 'post',
    headers: {
        'content-type': 'application/json',
        cookie: cookie
    },
    body: JSON.stringify({ file: file })
})
.then(response => response.json())
.then(data => {
    fs.writeFileSync('test.png', Buffer.from(data.data.data));
})

// flag{we_have_beaten_them_14765}