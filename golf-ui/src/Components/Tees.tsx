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
            <td>{hole.length}</td> 
        ));
    }

    function getTeeBoxLength(teeid: string){
        const currentteebox = teedata?.filter((holes) => holes.teeid == teeid);

        return <td>{currentteebox?.reduce((sum, item) => sum + item.length, 0)}</td>
    }
    
    function getFrontLength(teeid: string){
        const currentteebox = teedata?.filter((holes) => holes.teeid == teeid && holes.side == 1);

        return <td>{currentteebox?.reduce((sum, item) => sum + item.length, 0)}</td>
    }

    function getBackLength(teeid: string){
        const currentteebox = teedata?.filter((holes) => holes.teeid == teeid && holes.side == 2);

        return <td>{currentteebox?.reduce((sum, item) => sum + item.length, 0)}</td>
    }

    function getParForCourse(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid);

            return <td>{tees?.reduce((sum, item) => sum += item.par, 0)}</td>
        }
    }

    function getParFront(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid && holes.side == 1);

            return <td>{tees?.reduce((sum, item) => sum += item.par, 0)}</td>
        }
    }

    function getParBack(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid && holes.side == 2);

            return <td>{tees?.reduce((sum, item) => sum += item.par, 0)}</td>
        }
    }

    function getHandicapPerHole(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid);

            return tees?.map((hole) => (
                <td>{hole.hcp18}</td>
            ));
        }
    }

    function getParPerHole(){
        if(data != undefined){
            const tees = teedata?.filter((holes) => holes.teeid == data[0].uuid);

            return tees?.map((hole) => (
                <td>{hole.par}</td>
            ));
        }
    }
    
    return (
        <div>
            <h1>Scorecard Details</h1>
            <label>Tees</label>
            <table className='scorecard'>
                <tr>
                    <th className='holehcppar'>
                        <td className='tableheadercolumn'>Hole</td>
                        <td>1</td><td>2</td>
                        <td>3</td><td>4</td>
                        <td>5</td><td>6</td>
                        <td>7</td><td>8</td>
                        <td>9</td><td>10</td>
                        <td>11</td><td>12</td>
                        <td>13</td><td>14</td>
                        <td>15</td><td>16</td>
                        <td>17</td><td>18</td>
                        <td>Out</td><td>In</td>
                        <td>Total</td>
                    </th>
                </tr>
                
                {data?.map((teebox) => (
                    <tr>
                        <th className='teebox' style={{backgroundColor: teebox.color, color: teebox.text}}>
                            <td className='tableheadercolumn'>{teebox.name}</td>
                            {getEachTeeBoxInfo(teebox.uuid)}
                            {getFrontLength(teebox.uuid)}
                            {getBackLength(teebox.uuid)}
                            {getTeeBoxLength(teebox.uuid)}
                        </th>
                    </tr>
                ))}
                <tr>
                    <th className='holehcppar'>
                        <td className='tableheadercolumn'>Handicap</td>
                        {getHandicapPerHole()}
                    </th>
                </tr>
                <tr>
                    <th className='holehcppar'>
                        <td className='tableheadercolumn'>Par</td>
                        {getParPerHole()}
                        {getParFront()}
                        {getParBack()}
                        {getParForCourse()}
                    </th>
                </tr>
            </table>
        </div>
    );
}

export default Tees;