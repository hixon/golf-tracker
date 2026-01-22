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

export default {
    getPlayers,
    postPlayer
};