const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const { webServer } = require('./config/');

// COMMON
app.use(cors()); // Using CORS
app.use(express.json()); // Using for POST -> Getting for req.body.data


// ------ ROUTE ------
app.get('/', function (req, res, next) {
    res.status(200)
        .sendFile(path.join(__dirname + webServer.rootDir, webServer.defaultPage));
});


// ------ SERVER LISTENING ------
app.listen(webServer.port, () => {
    console.log(`Express server is listening on port ${webServer.port}!`);
    console.log(`View your local server at\x1b[36m http://localhost:${webServer.port}\x1b[0m`);
});
