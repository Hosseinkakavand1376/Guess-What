import { Link } from "react-router-dom";
import Logo from '../components/Logo';
import API from '../API';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

// registeration form and action
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
      
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
  
    // do the registeration
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = { username, password, firstname, lastname };
  
      const user = API.register(data).then( (res) => {
        navigate('/profile');
      }).catch((err) => {
        navigate('/register');
      });
    }

    return (
    <div className="container text-center">
        <Logo />
        <div className="row justify-content-center mt-4">
            <form className='col-9 col-md-4 mb-4' onSubmit={handleSubmit}>
                <div class="input-group mb-3">
                    <span class="input-group-text">Aa</span>
                    <input onChange={(ev) => setFirstname(ev.target.value)} type="text" class="form-control" placeholder="Firstname" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">Aa</span>
                    <input onChange={(ev) => setLastname(ev.target.value)} type="text" class="form-control" placeholder="lastname" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">@</span>
                    <input onChange={(ev) => setUsername(ev.target.value)} type="text" class="form-control" placeholder="Username" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">#</span>
                    <input onChange={(ev) => setPassword(ev.target.value)} type="password" class="form-control" placeholder="Password" />
                </div>
                <div class="input-group mb-3">
                    <button className='btn btn-warning form-control' type="submit">Register</button>
                </div>
                <Link to="/login" className="link-light">Already Have an Account!</Link>
            </form>
        </div>
    </div>
  );
}

export default Register;
