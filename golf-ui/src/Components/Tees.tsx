import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './scorecard.css';

interface CourseProps {
    courseid: string;
}

type Tee = {
    uuid: string, 
    name: string, 
    color: string,
    text: string,
    rating: number, 
    slope: number, 
    par: number
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

function Tees({courseid}: CourseProps){
    const location = import.meta.env.VITE_API_ROOT + ":" + import.meta.env.VITE_API_PORT + import.meta.env.VITE_API_HOME;
    const [data, setData] = useState<Tee[]>();
    const [teedata, setTeeData] = useState<Hole[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(location);
    
    useEffect(() => {
        //get all tee names/slopes/ratings from course
        axios.get(`${location}/tee/${courseid}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch( err => {
                setError(err.message);
                setLoading(false);
            });
        //get all hole details from course
        axios.get(`${location}/tees/${courseid}`)
            .then(response =>{
                setTeeData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [courseid]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    function getEachTeeBoxInfo(teeid: string){
        const currentteebox = teedata?.filter((holes) => holes.teeid == teeid);

        return currentteebox?.map((hole) => (
            <th key={hole.uuid}>{hole.length}</th> 
        ));
    }

    function getTeeBoxLength(teeid: string){
        const currentteebox = teedata?.filter((holes) => holes.teeid == teeid);

        return <th>{currentteebox?.reduce((sum, item) => sum + item.length, 0)}</th>
    }
    
    function getFrontLength(teeid: string){
        const currentteebox = teedata?.filter((holes) => holes.teeid == teeid && holes.side == 1);

        return <th>{currentteebox?.reduce((sum, item) => sum + item.length, 0)}</th>
    }

    function getBackLength(teeid: string){
        const currentteebox = teedata?.filter((holes) => holes.teeid == teeid && holes.side == 2);

        return <th>{currentteebox?.reduce((sum, item) => sum + item.length, 0)}</th>
    }

    function getParForCourse(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid);

            return <th>{tees?.reduce((sum, item) => sum += item.par, 0)}</th>
        }
    }

    function getParFront(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid && holes.side == 1);

            return <th>{tees?.reduce((sum, item) => sum += item.par, 0)}</th>
        }
    }

    function getParBack(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid && holes.side == 2);

            return <th>{tees?.reduce((sum, item) => sum += item.par, 0)}</th>
        }
    }

    function getHandicapPerHole(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid);

            return tees?.map((hole) => (
                <th key={hole.uuid}>{hole.hcp18}</th>
            ));
        }
    }

    function getParPerHole(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid);

            return tees?.map((hole) => (
                <th key={hole.uuid}>{hole.par}</th>
            ));
        }
    }
    
    return (
        <div>
            <h1>Scorecard Details</h1>
            <table className='scorecard'>
                <thead>
                <tr>
                    
                        <th className='tableheadercolumn'>Hole</th>
                        <th>1</th><th>2</th>
                        <th>3</th><th>4</th>
                        <th>5</th><th>6</th>
                        <th>7</th><th>8</th>
                        <th>9</th><th>10</th>
                        <th>11</th><th>12</th>
                        <th>13</th><th>14</th>
                        <th>15</th><th>16</th>
                        <th>17</th><th>18</th>
                        <th>Out</th><th>In</th>
                        <th>Total</th>
                    
                </tr>

                {data?.map((teebox) => (
                    <tr key={teebox.uuid} className='teebox' style={{backgroundColor: teebox.color, color: teebox.text}}>
                        
                            <th className='tableheadercolumn'>{teebox.name}</th>
                            {getEachTeeBoxInfo(teebox.uuid)}
                            {getFrontLength(teebox.uuid)}
                            {getBackLength(teebox.uuid)}
                            {getTeeBoxLength(teebox.uuid)}
                        
                    </tr>
                ))}
                 <tr className='holehcppar'>
                        <th className='tableheadercolumn'>Handicap</th>
                        {getHandicapPerHole()}
                </tr>
                <tr className='holehcppar'>
                        <th className='tableheadercolumn'>Par</th>
                        {getParPerHole()}
                        {getParFront()}
                        {getParBack()}
                        {getParForCourse()}
                </tr> 

                </thead>
            </table>
        </div>
    );
}

export default Tees;