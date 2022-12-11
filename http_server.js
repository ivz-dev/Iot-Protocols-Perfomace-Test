const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use( bodyParser.json() );  

app.post('/api/v1/battery', (req, res) => {
    console.log(new Blob([JSON.stringify(req.body)]).size / 1024);
    res.send('accepted')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})