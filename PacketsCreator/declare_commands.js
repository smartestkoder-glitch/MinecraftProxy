const declareCommands = {

    addAll: (packet, commands = []) => {
        for (const command of commands) packet = declareCommands.add(packet, command)
        return packet
    },

    add: (packet, command) => {
        let newPacket = packet
        const newNuberCommand = newPacket.nodes.length + 1
        newPacket.nodes[0].children.push(newNuberCommand-1)
        newPacket.nodes.push({
            flags: {
                unused: 0,
                has_custom_suggestions: 0,
                has_redirect_node: 0,
                has_command: 1,
                command_node_type: 1
            }, children: [newNuberCommand], redirectNode: undefined, extraNodeData: {name: command}
        })

        newPacket.nodes.push(
            {
                "flags": {
                    "unused": 0,
                    "has_custom_suggestions": 1,
                    "has_redirect_node": 0,
                    "has_command": 1,
                    "command_node_type": 2
                },
                "children": [],
                "extraNodeData": {
                    "name": "args",
                    "parser": "brigadier:string",
                    "properties": "GREEDY_PHRASE",
                    "suggestionType": "minecraft:ask_server"
                }
            })

        return newPacket
    }
}


export {declareCommands}