import { Link} from "react-router-dom";
import Logo from '../components/Logo';

// for selecting game difficulty
function Difficulty() {
  return (
    <div className="container text-center">
        <Logo />
        <div className="row justify-content-center mt-4">
            <h4 className="text-white">Select Game Difficulty: </h4>
            <Link to="/game?diff=0" className='btn btn-success m-2 col-2'>Easy</Link>
            <Link to="/game?diff=1" className='btn btn-warning m-2 col-2'>Medium</Link>
            <Link to="/game?diff=2" className='btn btn-danger m-2 col-2'>Hard</Link>
        </div>
    </div>
  );
}

export default Difficulty;
