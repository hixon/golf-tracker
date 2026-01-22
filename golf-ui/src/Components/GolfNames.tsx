import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Player = {
    id: number,
    name: string, 
    hcp: number, 
    uuid: string
};

function GolfNames(){
    const location = import.meta.env.VITE_API_ROOT + ":" + import.meta.env.VITE_API_PORT + import.meta.env.VITE_API_HOME;
    const [data, setData] = useState<Player[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Players</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Index</th>
                    </tr>
                </thead>
                
                <tbody>
                    {data?.map((post) => (
                    <tr key={post.uuid}>
                        <td>{ post.uuid }</td>
                        <td>{ post.name }</td>
                        <td>{ post.hcp }</td>
                    </tr>
                ))}
                </tbody>                
            </table>
            
        </div>
    );
}

export default GolfNames;