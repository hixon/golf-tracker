import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ScoreProps {
    courseid: string;
}

type Player = {
    id: number,
    name: string, 
    hcp: number, 
    uuid: string, 
    course: number,
    teeid: string,
};

type Tee = {
    uuid: string, 
    name: string, 
    color: string,
    text: string,
    rating: number, 
    slope: number, 
    par: number, 
    normalBox: boolean
};

type Hole = {
    teeid: string;
    uuid: string;
    num: number, 
    par: number, 
    length: number, 
    hcp18: number, 
    hcp9: number, 
    side: number
};

type Score = {
    pid: string, 
    name: string, 
    index: number, 
    teeid: string, 
    coursehcp: number,
    date: Date, 
    holeDetails: ScoredHole[]
}

type ScoredHole = {
    holeid: string,
    hole: number, 
    score: number, 
    net: number
}

function GolfNames({courseid}: ScoreProps){
    const location = import.meta.env.VITE_API_ROOT + ":" + import.meta.env.VITE_API_PORT + import.meta.env.VITE_API_HOME;
    const [data, setData] = useState<Player[]>();
    const [teedata, setTeeData] = useState<Tee[]>();
    const [holedata, setHoleData] = useState<Hole[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scores, setScores] = useState<Score[]>();

    console.log(location);
    
    useEffect(() => {
        axios.get(`${location}/home`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch( err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        //get all tee names/slopes/ratings from course
        axios.get(`${location}/tee/${courseid}`)
            .then(response => {
                setTeeData(response.data);
                setLoading(false);
            })
            .catch( err => {
                setError(err.message);
                setLoading(false);
            });
        //get all hole details from course
        axios.get(`${location}/tees/${courseid}`)
            .then(response =>{
                setHoleData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [courseid]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    console.log("COURSEID:", courseid);
    console.log(teedata);

    function handleTeeBoxChange(playerid: string, e: React.ChangeEvent<HTMLSelectElement>){
        //need to find the player and update their tee box to the correct box
        //then update their course handicap off of the new tee box selected
        const selectedTee = teedata?.filter(tee => tee.uuid == e.target.value);

        if(selectedTee != undefined){
            const playerDetails = data?.map(player =>{
                if(player.uuid == playerid){
                    console.log("TEEBOX CHANGED FOR:", player, e.target.value);
                    console.log("NEW INDEX: ", player.hcp * (selectedTee[0].slope/113.0) + (selectedTee[0].rating - selectedTee[0].par));
                    return {
                        ...player, 
                        teeid: e.target.value, 
                        course: (player.hcp * (selectedTee[0].slope/113.0) + (selectedTee[0].rating - selectedTee[0].par)).toFixed(3)
                        
                    }
                }
                else{
                    return player;
                }
            });

            setData(playerDetails);
            console.log(data);
        }
    }

    function calculatePlayerIndex(post: Player){

    }

    function isDefaultTeeBox(isSelected: boolean){
        if(isSelected){
            return "selected";
        }
        else{
            return "";
        }
    }

    if(teedata != undefined && holedata != undefined && data != undefined && courseid.length > 0){
        return (
        <div>
            <h1>Players</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Index</th>
                        <th>Tee</th>
                        <th>HCP</th>
                        <th>1</th>
                        <th>12</th>
                        <th>Out</th>
                        <th>In</th>
                        <th>Total</th>
                    </tr>
                </thead>
                
                <tbody>
                    {data?.map((post) => (
                    <tr key={post.uuid}>
                        <td>{post.name }</td>
                        <td> {post.hcp } </td>
                        <td>
                            <select onChange={(e) => handleTeeBoxChange(post.uuid, e)}>
                                <option></option>
                                {teedata?.map((tee) => (
                                    <option key={tee.uuid} value={tee.uuid}>{tee.name}</option>
                                ))}
                            </select>
                        </td>
                        <td>{post.course}</td>
                    </tr>
                ))}
                </tbody>                
            </table>
            
        </div>
    );
    }
    else{
        return (<div></div>);
    }
}

export default GolfNames;