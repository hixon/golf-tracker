import { randomUUID } from 'crypto';
import connection from './connection.js';

async function postCourse(name, city, stateid, zip, address, ncrdb){
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO course (name, city, stateid, zip, address, ncrdb) VALUES (?, ?, ?, ?, ?, ?)', [name, city, stateid, zip, address, ncrdb], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function getCourses(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT uuid, name FROM course WHERE active = true ORDER BY name', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function postTee(courseid, name, color, text, numberofholes, rating, slope, par, 
            front9rating, front9slope, front9par, back9rating, back9slope, back9par){
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO tee (courseid, name, color, text, numberofholes, rating, slope, par, front9rating, front9slope, front9par, back9rating, back9slope, back9par) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [courseid, name, color, text, numberofholes, rating, slope, par, front9rating, front9slope, front9par, back9rating, back9slope, back9par], (err) => { 
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
    });

}

async function getCourseTees(courseid){
    return new Promise((resolve, reject) => {
        connection.query('SELECT uuid, name, color, text, rating, slope, par FROM tee WHERE courseid = ? AND active = true', [courseid], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function bulkPostTees(tees, courseid){
    return new Promise((resolve, reject) => {
        tees.forEach((tee) => {
            connection.query('INSERT INTO tee (courseid, uuid, name, color, text, numberofholes, rating, slope, par, front9rating, front9slope, front9par, back9rating, back9slope, back9par) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [courseid, randomUUID(), tee.name, tee.color, tee.text, tee.numberofholes, tee.rating, tee.slope, tee.par, tee.front9rating, tee.front9slope, tee.front9par, tee.back9rating, tee.back9slope, tee.back9par], (err) => { 
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

//add holes for a given tee, used to display scorecard and for each score/hcp
async function bulkPostHoles(holes, teeid){
    return new Promise((resolve, reject) => {
        holes.forEach((hole) => {
            connection.query('INSERT INTO hole (teeid, uuid, num, par, length, hcp18, hcp9, side) values (?, ?, ?, ?, ?, ?, ?, ?)', 
            [teeid, randomUUID(), hole.num, hole.par, hole.length, hole.hcp18, hole.hcp9, hole.side], (err) =>{
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

async function getHoles(courseid){
    return new Promise((resolve, reject) => {
        connection.query('select t.uuid as teeid, h.uuid, h.num, h.par, h.length, h.hcp18, h.hcp9, h.side from hole h inner join tee t on t.uuid = h.teeid inner join course c on c.uuid = t.courseid where c.uuid = ? and h.active = true order by h.teeid, h.num ', 
        [courseid], (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export default {
    postCourse,
    postTee,
    bulkPostTees,
    bulkPostHoles,

    getCourseTees, 
    getCourses,

    getHoles,
}