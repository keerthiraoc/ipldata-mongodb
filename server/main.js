const express = require('express');
const path = require('path');
const stats = require(path.resolve('./server/index'));
const app = express();
var cors = require('cors');

app.use(express.static(path.resolve('./')));

app.use(cors())
app.use(express.static('./client'))

app.get('/matches', async function (req, res) {
    const matchesd = await stats.matchesPerYear('match');
    res.send(matchesd);
});

app.get('/economy', async function (req, res) {
    const matchesd = await stats.economy('match', 'delivery', 2016);
    res.send(matchesd);
});

app.get('/extraruns', async function (req, res) {
    const matchesd = await stats.extraRuns('match', 'delivery', 2015);
    res.send(matchesd);
});

app.get('/matcheswon', async function (req, res) {
    const matchesd = await stats.matchesWon('match');
    res.send(matchesd);
});

app.get('/topscorer', async function (req, res) {
    const matchesd = await stats.topScore('match', 'delivery', 2016);
    res.send(matchesd);
})
app.listen(5000);