const axios = require('axios');

const HTTP_SERVER_HOST = '127.0.0.1';
const HTTP_SERVER_PORT = 3000;

const sendHTTPMessage = (content) => new Promise((resolve, reject) => {
    axios.post(`http://${HTTP_SERVER_HOST}:${HTTP_SERVER_PORT}/api/v1/battery`, content)
        .then((response) =>  resolve(response))
        .catch((error) => reject(error));
});

const run = async () => {
    const promises = [];

    for (let i=0; i<20000; i++) {
        promises.push(() => sendHTTPMessage({ level: 75 }));
    }

    const start = new Date().getTime();
    const result = await Promise.allSettled(promises.map(item => item()));
    const end = new Date().getTime();

    console.log("Success: ", result.filter(item => item.status === 'fulfilled').length, "Time: ", end - start, " ms");
}

const transmitSize = async () => {
    const sizes = [0.1, 0.15, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 5, 10, 15, 20, 50, 100, 500];
    
    /** Max COAP message size */
    const maxMessageSize = 10024;

    for (let i=0; i<sizes.length; i++) {
        const start = new Date().getTime();
        const size = sizes[i];
        let batches = 1;
        if ((size * 1024) > maxMessageSize) batches = Math.ceil((size * 1024) / maxMessageSize);
        for (let j=0; j<batches; j++) {
            const chunkSize = size / batches;
            const inputArray = [];
            do {
                inputArray.push(1)
            } while (new Blob([JSON.stringify(inputArray)]).size / 1024 < chunkSize);
            await sendHTTPMessage(inputArray);
        }
        const end = new Date().getTime();
        console.log("Size:", size, "Time: ", end - start, " ms");
    }
}

transmitSize();

//** MacBook Pro results */
/**
 * Messages per second - 2118
 * Time, to execute 1M requests - 544500 ms
 */