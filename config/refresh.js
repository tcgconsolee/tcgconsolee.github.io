require('./package.json')
require('./package-lock.json')
const readline = require('readline'). createInterface({
    input: process.stdin,
    output: process.stdout
    });
console.clear()
console.log('Application refreshed!')
readline.question('Initialize application? Y/N', boolean => {
    if(boolean.toLowerCase().includes('y')) {
        require('./start')
    } else {
        console.log('Application initialization cancelled.')
    }
    readline.close()
})