import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CourseProps{
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

type Course = {
    name: string, 
    uuid: string
};

function Courses({onSelectChange}: CourseProps){
    const location = import.meta.env.VITE_API_ROOT + ":" + import.meta.env.VITE_API_PORT + import.meta.env.VITE_API_HOME;
    const [data, setData] = useState<Course[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [courseid, setCourseId] = useState(null);
    console.log(location);
    
    useEffect(() => {
        axios.get(`${location}/course`)
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
            <label>Course</label>
            <select onChange={onSelectChange}>
                <option value="">(Choose One)</option>
                    {data?.map((post) => (
                    <option key={post.uuid} value={post.uuid}>{post.name}</option>
                ))}               
            </select>
        </div>
    );
}

export default Courses;