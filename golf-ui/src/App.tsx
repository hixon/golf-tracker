import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import GolfNames from './Components/GolfNames';
import Courses from './Components/Courses';
import Tees from './Components/Tees';

function App() {
  const [count, setCount] = useState(0)
  const [courseid, setCourseId] = useState("");

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>){
        setCourseId(e.target.value);
    }
    

  let courseDetails;
  if(courseid != ""){
    courseDetails = <Tees courseid={courseid}></Tees>
  }



  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Courses onSelectChange={handleSelectChange}></Courses>
      { courseDetails }
      <GolfNames></GolfNames>
    </>
  )
}

export default App
