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

export default {
    postCourse
}