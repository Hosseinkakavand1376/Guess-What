import { Link } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import logoImg from '../assets/imgs/logo.png';

// Logo image in the first pages
function Logo() {
  return (
    <div className="row justify-content-center mt-4">
        <Link to='/'>
            <Image src={ logoImg } alt="logo" className='col-md-5 col-8 d-inline'/>
        </Link>
        <h2 className="text-white col-12 m-4">
          Welcome to GUESS WHAT!
        </h2>
    </div>
  );
}

export default Logo;