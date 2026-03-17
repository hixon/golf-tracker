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
    score: number,
    holeDetails: ScoredHole[]
}

type ScoredHole = {
    holeid: string,
    hole: number, 
    score: number, 
    net: number, 
    par: number, 
    hcp18: number, 
    hcp9: number, 
    side: number
}

type PlayerData = {
    uuid: string, 
    name: string, 
    hcp: number, 
    teeid: string, 
    playerhcp: number
}

function GolfNames({courseid}: ScoreProps){
    const location = import.meta.env.VITE_API_ROOT + ":" + import.meta.env.VITE_API_PORT + import.meta.env.VITE_API_HOME;
    const [data, setData] = useState<Player[]>();
    const [playersData, setPlayersData] = useState<PlayerData[]>();
    const [teedata, setTeeData] = useState<Tee[]>();
    const [holedata, setHoleData] = useState<Hole[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scores, setScores] = useState<Score[]>();
    const [initialLoad, setInitialLoad] = useState(true);
    const [scoreUpdate, setScoreUpdate] = useState<string>("");

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

    // when we have both tee information and the player list we want to
    // ensure every player starts on the "normal" tee box and has a
    // calculated course handicap.  the previous implementation was
    // unconditionally calling `setDefaultBoxAndHCP` whenever `data` or
    // `teedata` changed which caused a state update on every render and
    // therefore a render loop ("too many re-renders").
    //
    // fix: compute the default tee once and only update the player array if
    // one or more players are missing that box.  after the first update the
    // check will short-circuit and no additional state updates will occur.
    useEffect(() => {
        if (!teedata || !data || courseid.length === 0 || !initialLoad) {
            return;
        }

        // Accept any truthy indication of the normal tee; some APIs return
        // the value as a string/number which would fail a strict check.
        const defaultTee = teedata.find((t) => !!t.normalBox);
        if (!defaultTee) {
            console.warn('no default tee found', teedata);
            return;
        }

        // if every player already has the correct teeid we don't touch state
        const needsDefault = data.some((p) => p.teeid !== defaultTee.uuid);
        if (!needsDefault) {
            return;
        }

        const playerDetails = data.map((player) => ({
            ...player,
            teeid: defaultTee.uuid,
            course: (
                player.hcp * (defaultTee.slope / 113.0) +
                (defaultTee.rating - defaultTee.par)
            ).toFixed(2),
        }));

        setData(playerDetails);
    }, [teedata, data, courseid]);

    useEffect(() => {
        console.log("\tSCORES UPDATED:", scores);
    }, [scores])

    useEffect(() => {
        //here is where we should make all the changes to the scores
        //this way they're reflected on the UI in real-time
        try{
            console.log("\t\t\tSCORE TO CHANGE:", JSON.parse(scoreUpdate));
            const {playerid, holeid, holescore} = JSON.parse(scoreUpdate);
            const player = data?.find(p => p.uuid == playerid);

            if(player != undefined){
                if(scores == undefined || scores.find(s => s.pid == playerid) == undefined){
                    initializePlayerScore(player, holeid, holescore);
                }
                else{
                    setPlayerScore(playerid, holeid, holescore);
                }
            }

        } catch {
            console.log("\t\t\tSCORE TO CHANGE:", scoreUpdate);
        }
        
    }, [scoreUpdate]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    console.log("PLAYERS DATA:", playersData);
    console.log(teedata);

    function handleTeeBoxChange(playerid: string, e: React.ChangeEvent<HTMLSelectElement>){
        //need to find the player and update their tee box to the correct box
        //then update their course handicap off of the new tee box selected
        setInitialLoad(false);
        const selectedTee = teedata?.filter(tee => tee.uuid == e.target.value);

        if(selectedTee != undefined){
            const playerDetails = data?.map(player =>{
                if(player.uuid == playerid){
                    console.log("TEEBOX CHANGED FOR:", player, e.target.value);
                    console.log("NEW INDEX: ", player.hcp * (selectedTee[0].slope/113.0) + (selectedTee[0].rating - selectedTee[0].par));
                    return {
                        ...player, 
                        teeid: e.target.value, 
                        course: (player.hcp * (selectedTee[0].slope/113.0) + (selectedTee[0].rating - selectedTee[0].par)).toFixed(2)
                        
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

    function handleScoreChange(playerid: string, holeid: string, value: string){
        setScoreUpdate(JSON.stringify({"playerid":playerid, "holeid":holeid, "holescore": parseInt(value)}));
    }

    function setPlayerScore(playerid: string, holeid: string, holescore: number){
        if(scores != undefined){
                //update score for person and hole
                const playerDetails = scores?.map(playerscore =>{
                    if(playerscore.pid == playerid){
                        console.log("Updating score for:", playerscore.name);
                        //console.log("NEW INDEX: ", player.hcp * (selectedTee[0].slope/113.0) + (selectedTee[0].rating - selectedTee[0].par));
                        return {
                            ...playerscore, 
                            holeDetails: playerscore.holeDetails.map(hole => {
                                if(hole.holeid == holeid){
                                    return {
                                        ...hole,
                                        score: holescore || 0,
                                        net: getNetScore(holescore, playerscore.coursehcp, hole.hcp18),
                                    }
                                }
                                else{
                                    return hole;
                                }
                            }), 
                            score: playerscore.holeDetails.reduce((accumulator, currentValue) => accumulator + currentValue.score, 
                            0,
                        )
                        }
                    }
                    else{
                        return playerscore;
                    }
                });

                setScores(playerDetails);
            }
    }

    function getNetScore(holescore: number, coursehcp: number, holehcp: number){
        let net = holescore;
        const hcp = Math.floor(coursehcp);

        const pops = Math.floor(hcp/18);

        //hcp > 18 so they get multiple pops on a hole
        if(pops > 0){
            net -= pops;
        }

        //if mod of 18 < current hcp hole take off a stroke 
        if((hcp % 18) >= holehcp){
            net -= 1;
        }

        return net;
    }

    function initializePlayerScore(player: Player, holeid: string, holescore: number){

        setScores(
            [...scores || [],  {
            pid: player.uuid, 
            name: player.name, 
            index: player.hcp, 
            teeid: player.teeid, 
            coursehcp: player.course,
            date: new Date(), 
            score: holescore, 
            holeDetails: holedata?.filter(h => h.teeid == player.teeid).map((hole => ({
                holeid: hole.uuid,
                hole: hole.num, 
                score: hole.uuid == holeid ? holescore : 0,
                net: 0, 
                par: hole.par, 
                hcp18: hole.hcp18, 
                hcp9: hole.hcp9, 
                side: hole.side
            }))) || []
        }]);
    }

    function getPlayerFront9Score(playerid: string){
        const playerScore = scores?.find(s => s.pid == playerid);
        if(playerScore != undefined){
            return playerScore.holeDetails.filter(h => h.side == 1).reduce((total, hole) => total + hole.score, 0);
        }
        else{
            return 0;
        }
    }

    function getPlayerBack9Score(playerid: string){
        const playerScore = scores?.find(s => s.pid == playerid);
        if(playerScore != undefined){
            return playerScore.holeDetails.filter(h => h.side == 2).reduce((total, hole) => total + hole.score, 0);
        }
        else{
            return 0;
        }
    }

    function getPlayerScore(playerid: string){
        const playerScore = scores?.find(s => s.pid == playerid);
        if(playerScore != undefined){
            return playerScore.score;
        }
        else{
            return 0;
        }    
    }

    // the logic previously in `setDefaultBoxAndHCP` has been moved into the
    // effect above; the helper is no longer needed.  keeping it around was
    // one of the reasons we were disabling the exhaustive-deps lint rule.

    if(teedata != undefined && holedata != undefined && data != undefined && courseid.length > 0){
        //initialize teeboxes and hcps

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
                        {holedata.filter(holes => holes.teeid == teedata[0].uuid).map((hole) => (
                            <th>{hole.num}</th>
                        ))}
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
                            {/* make the select controlled so that the value follows
                                the current player object; this automatically selects
                                the correct option when we initialise the data or
                                when the user changes the tee box */}
                            <select
                                value={post.teeid || ""}
                                onChange={(e) => handleTeeBoxChange(post.uuid, e)}
                            >
                                <option value="" disabled>
                                    -- select --
                                </option>
                                {teedata?.map((tee) => (
                                    <option
                                        key={tee.uuid}
                                        value={tee.uuid}
                                    >
                                        {tee.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>{post.course}</td>

                        {holedata.filter(holes => holes.teeid == post.teeid).map((hole) => (
                            <td><input id={post.uuid + ":" + hole.uuid} className="hole-score" onChange={(e) => handleScoreChange(post.uuid, hole.uuid, e.target.value)} type="number" min="1" max="99" step="1" placeholder={hole.par.toString()}></input></td>
                        ))}
                        <td>{getPlayerFront9Score(post.uuid)}</td>
                        <td>{getPlayerBack9Score(post.uuid)}</td>
                        <td>{getPlayerScore(post.uuid)}</td>
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