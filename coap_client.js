const coap = require('coap')

const sendCoapMesssage = (content) => new Promise((resolve, reject) => {
    const req = coap.request({
        host: 'localhost',
        method: 'POST',
        pathname: 'api/v1/battery',   
    })

    req.setOption('Content-Format', 'application/json');
    req.write(JSON.stringify(content), (err) => {});
    
    req.on('response', (res) => resolve())
    req.end()
});

const messagesPerSecond = async () => {
    const promises = [];

    for (let i=0; i<200000; i++) {
        promises.push(() => sendCoapMesssage({ level: 75 }));
    }

    const start = new Date().getTime();
    const result = await Promise.allSettled(promises.map(item => item()));
    const end = new Date().getTime();

    console.log("Success: ", result.filter(item => item.status === 'fulfilled').length, "Time: ", end - start, " ms");
}

const transmitSize = async () => {
    const sizes = [0.1, 0.15, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 5, 10, 15, 20, 50, 100, 500];
    
    /** Max COAP message size */
    const maxMessageSize = 1024;

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

            await sendCoapMesssage(inputArray);
        }
        const end = new Date().getTime();
        console.log("Size:", size, "Time: ", end - start, " ms");
    }
}

transmitSize();


//** MacBook Pro results */
/**
 * Messages per second - 4208 messages
 * Time, to execute 1M requests - 454680 ms
 * Discrete size transmitting
 *      Size: 0.1 Time:  13  ms
        Size: 0.15 Time:  3  ms
        Size: 0.25 Time:  4  ms
        Size: 0.5 Time:  11  ms
        Size: 0.75 Time:  9  ms
        Size: 1 Time:  17  ms
        Size: 1.25 Time:  18  ms
        Size: 1.5 Time:  22  ms
        Size: 1.75 Time:  23  ms
        Size: 2 Time:  27  ms
        Size: 3 Time:  33  ms
        Size: 5 Time:  59  ms
        Size: 10 Time:  99  ms
        Size: 15 Time:  148  ms
        Size: 20 Time:  199  ms
        Size: 50 Time:  494  ms
        Size: 100 Time:  993  ms
        Size: 500 Time:  4904  ms
 */