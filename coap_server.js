const coap = require('coap')

const server = coap.createServer()

server.on('request', (req, res) => {
    console.log(new Blob([req.payload]).size / 1024);
    res.end('accepted');
})

server.listen()