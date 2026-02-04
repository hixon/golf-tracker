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
        connection.query('SELECT * FROM tee WHERE courseid = ? AND active = true', [courseid], (err, rows) => {
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
            connection.query('INSERT INTO tee (courseid, name, color, text, numberofholes, rating, slope, par, front9rating, front9slope, front9par, back9rating, back9slope, back9par) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [courseid, tee.name, tee.color, tee.text, tee.numberofholes, tee.rating, tee.slope, tee.par, tee.front9rating, tee.front9slope, tee.front9par, tee.back9rating, tee.back9slope, tee.back9par], (err) => { 
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

export default {
    postCourse,
    postTee,
    bulkPostTees,

    getCourseTees, 
    getCourses
}