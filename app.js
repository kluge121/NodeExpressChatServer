const express = require('express');

const app = express();
const host = 'ubuntu@ec2-52-78-135-92.ap-northeast-2.compute.amazonaws.com';

app.get('/', (req, res) => {
    res.send("dd");
});

app.listen(3000, host, () => {
    console.log("dd2");
});

