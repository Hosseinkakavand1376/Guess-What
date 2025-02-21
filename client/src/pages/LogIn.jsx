import { Link } from "react-router-dom";
import Logo from '../components/Logo';
import API from '../API';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

// login page
function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
            await API.userInfo().then((res) => {
                navigate('/profile');
            }).catch((err) =>  {
              console.error(err);
            }); 
        }
        init();
    }, []); // redirect if logged-in

  // do the log-in
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { username, password };

    API.logIn(data).then( (res) => {
      setError(false);
      navigate('/profile');

    }).catch((err) => {
      setError(true);
    });
  };
  
  return (
    <div className="container text-center">
        <Logo />
        { error &&
          <h5 className="text-danger">Wrong Info!</h5>
        }
        <div className="row justify-content-center mt-4 mb-4">
            <form className='col-9 col-md-4' onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <span className="input-group-text">@</span>
                    <input type="text" onChange={(ev) => setUsername(ev.target.value)} className="form-control" placeholder="Username" />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">#</span>
                    <input type="password" onChange={(ev) => setPassword(ev.target.value)} className="form-control" placeholder="Password" />
                </div>
                <div className="input-group mb-3">
                    <button type="submit" className='btn btn-success form-control'>Log In</button>
                </div>
                <Link to="/register" className="link-warning">Don't Have an Account ?</Link>
            </form>
        </div>
    </div>
  );
}

export default LogIn;
