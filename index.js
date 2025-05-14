const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on("connection", (ws) => {
    console.log("Nuevo cliente conectado");

    // Asignar rol (A o B)
    const role = clients.length === 0 ? "A" : "B";
    ws.role = role;
    ws.send(JSON.stringify({ type: "ASSIGN_ROLE", role }));

    clients.push(ws);

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        console.log("Mensaje recibido:", data);

        // Reenviar a todos menos al que envió
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on("close", () => {
        console.log("Cliente desconectado");
        clients = clients.filter((c) => c !== ws);
    });
});

console.log("Servidor WebSocket en puerto 8080");
