const mc = require('minecraft-protocol');
const util = require('util')
const {join} = require("node:path");
const {writeFileSync} = require("node:fs");

const dataCommands = require("./Data/commands.js")

const packetChat = require('../PacketsCreator/chat').packetChat;
const declare_commands = require("../PacketsCreator/declare_commands").declareCommands;

const states = mc.states

const host = "mc.funtime.su"
const port = 25565
const version = "1.16.5"

let blackList = []
let whiteList = []
let sendServerPacket = false
let sendClientPacket = false

const infoText = [
    {"text": "SmartParser by @Sasher809\n", "color": "aqua", "bold": true},
    {"text": "ИНУСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ\n", "color": "red", "bold": true},
    {"text": "Команды:\n", "color": "red", "bold": true},
    {"text": "Все команды начинаюся с /+\n\n", "color": "green", "bold": true},

    {"text": "/+info", "color": "gold", "bold": true},
    {"text": " - Показывает эту подсказку\n", "color": "blue", "bold": true},

    {"text": "/+settings", "color": "gold", "bold": true},
    {"text": " - Показывает текущие настройки\n", "color": "blue", "bold": true},

    {"text": "/+blacklist", "color": "gold", "bold": true},
    {"text": " - Показывает команды для работы с черным списком\n", "color": "blue", "bold": true},

    {"text": "/+whitelist", "color": "gold", "bold": true},
    {"text": " - Показывает команды для работы с белым списком\n", "color": "blue", "bold": true},


]


const srv = mc.createServer({
    'online-mode': false,
    port: 25566,
    keepAlive: false,
    version
})
console.log("Сервер создан! IP для подключения: localhost:25566")
srv.on('login', function (client) {

    const addr = client.socket.remoteAddress

    console.log('Подключение с адреса: ', '(' + addr + ')')

    let endedClient = false
    let endedTargetClient = false

    client.on('end', function () {
        endedClient = true
        console.log('Соединение закрыто клиентом', '(' + addr + ')')
        if (!endedTargetClient) {
            targetClient.end('Соединение закрыто клиентом')
        }
    })

    client.on('error', function (err) {
        endedClient = true
        console.log('Ошибка на стороне клиента', '(' + addr + ')')
        console.log(err.stack)
        if (!endedTargetClient) {
            targetClient.end('Ошибка на стороне клиента')
        }
    })

    const targetClient = mc.createClient({
        host,
        port,
        username: client.username,
        keepAlive: false,
        version
    })

    client.on('packet', function (data, meta) {
        if (targetClient.state === states.PLAY && meta.state === states.PLAY) {
            if (meta.name === "chat") {
                if (data.message.startsWith("/+")) {


                    packetChat.toClientExtra(client, infoText)
                    return
                }

            }

            if (shouldDump(meta.name, 'o')) {

                console.log('client->server:',
                    client.state + ' ' + meta.name + ' :',
                    JSON.stringify(data))
            }
            if (!endedTargetClient) {
                targetClient.write(meta.name, data)
            }
        }
    })

    targetClient.on('packet', function (data, meta) {
        if (meta.state === states.PLAY && client.state === states.PLAY) {
            if (meta.name === "declare_commands") {

                data = declare_commands.addAll(data, dataCommands)


            }

            if (shouldDump(meta.name, 'i')) {

                console.log('client<-server:',
                    targetClient.state + '.' + meta.name + ' :' +
                    JSON.stringify(data))
            }
            if (!endedClient) {
                client.write(meta.name, data)//Тут отправляется пакет на клиент.
                if (meta.name === 'set_compression') {
                    client.compressionThreshold = data.threshold
                } // Set compression
            }
        }
    })


    targetClient.on('end', function () {
        endedTargetClient = true
        console.log('Соединение закрыто сервером', '(' + addr + ')')
        if (!endedClient) {
            client.end('Сервер закрыл соединение')
        }
    })

    targetClient.on('error', function (err) {
        endedTargetClient = true
        console.log('Ошибка соединения сервера', '(' + addr + ') ', err)
        console.log(err.stack)
        if (!endedClient) {
            client.end('Ошибка соединения сервера')
        }
    })
})


function shouldDump(name, direction) {
    if (!sendServerPacket && direction === "i") return false
    if (!sendClientPacket && direction === "o") return false

    if (whiteList.length > 0) {
        return whiteList.includes(name);
    }

    return !blackList.includes(name);
}
