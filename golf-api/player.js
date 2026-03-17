import connection from './connection.js';

async function getPlayers(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT name, hcp, uuid FROM test', (err, rows) => {
            if(err){
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function postPlayer(name, hcp){
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO test (name, hcp) VALUES (?, ?)', [name, hcp], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function getPlayersWithCourse(courseid){
    return new Promise((resolve, reject) => {
        connection.query(`
            select t.uuid, t.name, t.hcp,  (select t.uuid
from testdb.course c 
inner join testdb.tee t on t.courseid = c.uuid
where c.uuid = ? and t.normalBox = true) as 'teeid', 
ROUND(t.hcp * 
((select t.slope
from testdb.course c 
inner join testdb.tee t on t.courseid = c.uuid
where c.uuid = ? and t.normalBox = true)/113.0) + 
((select t.rating
from testdb.course c 
inner join testdb.tee t on t.courseid = c.uuid
where c.uuid = ? and t.normalBox = true) - (select t.par
from testdb.course c 
inner join testdb.tee t on t.courseid = c.uuid
where c.uuid = ? and t.normalBox = true)
), 2) as 'playerhcp'
from testdb.test t;
            `, [courseid, courseid, courseid, courseid], (err, rows) => {
            if(err){
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export default {
    getPlayers,
    postPlayer, 
    getPlayersWithCourse
};