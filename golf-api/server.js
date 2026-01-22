import express from 'express';
import process from 'process';
import cors from 'cors';
import player from './player.js';
import course from './course.js';

//connection.connect();

const app = express();
app.use(cors({
    origin: process.env.UI_URL,
    credentials: true
}));

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = process.env.API_PORT || 9000;
const home = process.env.API_HOME;

app.get(`${home}/home`, async function (req, res) {
    const playerList = await player.getPlayers();
    res.status(200).json(playerList);
});

app.post(`${home}/player`, async function(req, res){
    console.log(req.body.name, '\t', req.body.hcp);
    const name = req.body.name;
    const hcp = req.body.hcp;
    await player.postPlayer(name, hcp);

    res.status(201).json(name, hcp);
});

//add new course
app.post(`${home}/course`, async function(req, res){
    console.log(req.body.name);
    const name = req.body.name;
    const city = req.body.city;
    const stateid = req.body.stateid;
    const zip = req.body.zip;
    const address = req.body.address;
    const ncrdb = req.body.ncrdb;

    await course.postCourse(name, city, stateid, zip, address, ncrdb);

    res.status(201).json(req.body);
});

//connection.end();
app.listen(port, () => console.log(`Server is running on port ${port}`));