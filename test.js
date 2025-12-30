const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введите что-нибудь: ', (answer) => {
    console.log('Вы ввели:', answer);
    rl.close();
});


console.log("!2312312312")