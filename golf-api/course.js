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
        connection.query('SELECT from tee WHERE courseid = (?) and active = true', [courseid], (err, rows) => {
            if (err) {
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

    getCourseTees
}