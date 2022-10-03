const express = require("express");
const Authprocess = require("./Routing/Authprocess")

const app = express();

app.use(express.json());

app.use('/auth', Authprocess)

app.get('/', (req, res) => {
    res.send("Auth Process");
    res.end();
})

app.listen(2020, () => {
    console.log(`Server Running`);
})