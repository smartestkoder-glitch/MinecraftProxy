

const packetChat = {

    toClientJust: (client, text, color = "white") => {
        client.write('chat', {
            message: JSON.stringify({
                text: text,
                color: color
            }),
            position: 1,
            sender: '00000000-0000-0000-0000-000000000000'
        });
    },

    toClientExtra: (client, extra) => {
        client.write('chat', {
            message: JSON.stringify({
                text: "",
                color: "",
                extra: extra
            }),
            position: 1,
            sender: '00000000-0000-0000-0000-000000000000'
        });
    }

}

export {packetChat}