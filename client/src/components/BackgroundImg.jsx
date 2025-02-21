import bg from '../assets/imgs/bg.webp';
import Image from 'react-bootstrap/Image';

// This Component is the blue background image in the site! 
function BackgroundImg() {
  return (
    <div className="position-fixed start-0 top-0 z-n1 w-100 min-vh-100" id='background-image'>
        <Image src={ bg } className="w-100 min-vh-100 object-fit-cover" />
    </div>
  );
}

export default BackgroundImg;
