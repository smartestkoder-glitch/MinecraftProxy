const mc = require('minecraft-protocol');

// Получаем протокол для конкретной версии
const proto = mc.protocol.version('1.21.4');

// PLAY state → toServer
console.log('Packets to server (PLAY):');
console.log(Object.keys(proto.states.play.toServer));

// PLAY state → toClient
console.log('Packets to client (PLAY):');
console.log(Object.keys(proto.states.play.toClient));
