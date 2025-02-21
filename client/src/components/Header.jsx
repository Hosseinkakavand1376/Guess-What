import { Link } from "react-router-dom";
import API from '../API';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

// Header of site with navigations
function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(false);

  useEffect(() => {
    const init = async () => {
      await API.userInfo().then((res) => {
        setUsername(res.username);
      }).catch((err) =>  {}); 
    }
    init();
  }, []); // Loading username for header

  // do the log-out
  const logout = () => {
    API.logOut().then(() => {
        navigate('/');
      }
    )
  }
  return (
    <nav className="navbar border-dark border-bottom">
        <div className="container-fluid">
            <Link to="/profile" className="navbar-brand">{username ? username : "Anonymous"}</Link>
            <div>
                <div className="d-flex">
                    <Link to='/difficulty' className="btn btn-success me-2">Play a New Game</Link>
                    <Link to='#' onClick={logout} className="btn btn-danger me-2">Log Out</Link>
                </div>
            </div>
        </div>
    </nav>
  );
}

export default Header;
