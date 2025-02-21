import { Link} from "react-router-dom";
import Logo from '../components/Logo';

// landing page
function Home() {
  return (
    <div className="container text-center">
        <Logo />
        <div className="row justify-content-center mt-4">
            <Link to="/difficulty" className='btn btn-success m-2 col-3 col-md-2'>Play!</Link>
            <Link to="/login" className='btn btn-warning m-2 col-5 col-md-3'>Log In / Profile</Link>
        </div>
    </div>
  );
}

export default Home;
