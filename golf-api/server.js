import express from 'express';
import process from 'process';
import cors from 'cors';
import player from './player.js';
import course from './course.js';
import swagger from './swagger.js';

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

app.post(`${home}/bulktee/{:courseid}`, async function(req, res){
    console.log('POST new TEES');
    const tees = req.body;
    const courseid = req.params.courseid;

    console.log(tees);
    console.log(courseid);

    if(!Array.isArray(req.body)){
        return res.status(400).json({message: 'Request body should be an array'});
    }

    await course.bulkPostTees(tees, courseid);

    res.status(201).json({tees: tees}, {course: courseid});
});

app.post(`${home}/bulkhole/{:teeid}`, async function(req, res){
    console.log('POST new TEES');
    const holes = req.body;
    const teeid = req.params.teeid;

    console.log(holes);
    console.log(teeid);

    if(!Array.isArray(req.body)){
        return res.status(400).json({message: 'Request body should be an array'});
    }

    await course.bulkPostHoles(holes, teeid);

    res.status(201).json({holes: holes}, {tee: teeid});
});

app.get(`${home}/course`, async function(req, res){
    const courses = await course.getCourses();
    res.status(200).json(courses);
});

app.get(`${home}/tee/{:courseid}`, async function(req, res){
   const courseid = req.params.courseid;
   console.log('GET tees for course', courseid);

   const tees = await course.getCourseTees(courseid);
   res.status(200).json(tees);
});

app.get(`${home}/tees/{:courseid}`, async function(req, res){
    const courseid = req.params.courseid;
    console.log('GET holes for course', courseid);

    const holes = await course.getHoles(courseid);
    res.status(200).json(holes);
});

swagger(app);

app.listen(port, () => console.log(`Server is running on port ${port}`));
