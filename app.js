const http = require('http')
const fs = require('fs');
const { stdout } = require('process');
const { builtinModules } = require('module');

var pages = [
        '/',
        '/games',
        '/games/hangman',
        '/games/flappy_bird',
        '/games/pacman',
        '/games/snake_game',
]

function letterCounter(str) {
        var letters = 0;
        var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var ar = alphabet.split("");
        for (var i=0; i<str.length;i++) {
            if (ar.indexOf(str[i]) > -1) {
                letters = letters + 1;
            }
        }
        return letters;
}

const monitor = http.createServer((req, res) => {

        if(req.url.includes('/images')) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fs.createReadStream(__dirname + req.url).pipe(res);
        } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if(req.url === '/games/hangman?') {} else { if(pages.includes(req.url)) {
        fs.createReadStream(__dirname + `/html/pages${req.url}.html`).pipe(res);
        var path = __dirname + `/html/pages${req.url}.html`
        } else {
        fs.createReadStream(__dirname + `/html/404.html`).pipe(res)
        var path = __dirname + `/html/404.html`
        }
        process.stdout.write(`Listening to ${req.url}`)
        process.stdout.cursorTo(letterCounter(path))
        process.stdout.clearLine(1)
        setTimeout(() => {
                process.stdout.write('\n')
        }, 1000)
        }
}
})

monitor.listen(3000, '127.0.0.1', 10, () => {
        console.log('Application initialized')
})
