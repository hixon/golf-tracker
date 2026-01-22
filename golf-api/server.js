import express from 'express';
import process from 'process';
import cors from 'cors';
import player from './player.js';
import course from './course.js';

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

app.post(`${home}/tee/{:slug}`, async function(req, res){
    console.log('POST new TEES');
    const tee = req.body;
    const courseid = req.params.slug;

    console.log(tee);
    console.log(courseid);
    
    const name = tee.name;
    const color = tee.color;
    const text = tee.text;
    const numberofholes = tee.numberofholes;
    const rating = tee.rating;
    const slope = tee.slope;
    const par = tee.par;
    const front9rating = tee.front9rating;
    const front9slope = tee.front9slope;
    const front9par = tee.front9par;
    const back9rating = tee.back9rating;
    const back9slope = tee.back9slope;
    const back9par = tee.back9par;

    await course.postTee(courseid, name, color, text, numberofholes, rating, slope, par, 
        front9rating, front9slope, front9par, back9rating, back9slope, back9par);

    res.status(201).json({tee: tee}, {course: courseid});
});

app.listen(port, () => console.log(`Server is running on port ${port}`));