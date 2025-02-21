import Header from '../components/Header'
import BackgroundImg from '../components/BackgroundImg'

import { React, useState, useEffect } from 'react';
import API from '../API';
import { useNavigate } from 'react-router-dom';

// profile page
function Profile() {
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            await API.profile().then((res) => {
                setData(res);
                setLoaded(true);
            }).catch((err) => navigate('/login'));                
        }
        init();
    }); // get user info or redirect if didn't logged-in
    
  return (
    <>
    <Header />
    {loaded && 
        <div className="container"> 
            <div className="row justify-content-center">
                <div className="m-4 col-12 col-md-8 col-lg-6">
                    <h3>
                        Your Games
                        <span className="badge text-bg-success mx-4">XP: {data.user.xp}</span>
                    </h3>
                    <div className="table-responsive">
                    <table className="table mt-2 table-dark">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Difficulty</th>
                            <th scope="col">Secret Item</th>
                            <th scope="col">Score</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divide">
                            {data.games.map((row, i) => { 
                                return <tr key={i} className={row.state == 0 ? "table-danger": "table-success"}>
                                        <th scope="row">{ i + 1 }</th>
                                        <td>
                                            {row.difficulty == 0 && "Easy"}
                                            {row.difficulty == 1 && "Medium"}
                                            {row.difficulty == 2 && "Hard"}
                                        </td>
                                        <td>{ row.secret }</td>
                                        <td>{ row.score }</td>
                                    </tr>
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    }
    <BackgroundImg />
</>
  );
}

export default Profile;