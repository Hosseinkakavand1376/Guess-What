import Header from '../components/Header';
import BackgroundImg from '../components/BackgroundImg';


import { React, useState, useEffect } from 'react';
import API from '../API';
import { useNavigate } from 'react-router-dom';


// This is the main game play component
function Game() {
    const [game_id, setGameID] = useState(-1);
    const [items, setItems] = useState([]);

    const [right_ask, setRight] = useState(false); // For Display Messages
    const [wrong_ask, setWrong] = useState(false); // For Display Messages
    
    
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            await API.startGame({'difficulty': urlParams.get('diff')}).then((res) => {})
            .then((res) => {
                API.findGame().then((res2) => {
                    setGameID(res2.game);
                    setItems(res2.items);
                }).catch((err2) => console.log(err2));
            })
            .catch((err) => console.log(err));                
        }
        init();
    }, []); // This effect will build and start a new game

    // for asking questions
  const handleSubmit = (event) => {
    event.preventDefault();
    const q = document.querySelector("select.q").value;
    let a;
    if (q === 'legs') {
        a = document.querySelector("select.a2").value;
    } else {
        a = document.querySelector("select.a1").value;
    }
    const data = { 
        q,
        a,
        game_id
    };

    API.ask(data).then( (res) => {
        if (res.answer) {
            setRight(true);
            setWrong(false);
        } else {
            setRight(false);
            setWrong(true);
        }

        res.false_items.forEach(element => {
            document.querySelector("#it" + element.id).classList.add("crossed");
        });

    }).catch((err) => {
    });
  };
    
  // guessing and ending the game
  const handleGuess = (obj) => {
    if (!obj.target.parentElement.classList.contains('crossed')) {
        const guess = obj.target.parentElement.id.split('it')[1]
        const data = { 
            game_id, 
            guess 
        };
    
        API.guess(data).then( (res) => {
            if (res.guess) {
                alert('YOU WIN!');
            } else {
                alert('YOU LOST! SECRET: ' + res.secret);
            }

            navigate('/difficulty');
    
        }).catch((err) => {
        });
        
    }
  }

  // showing possible answers base on the question
  const qChange = () => {
    const q = document.querySelector("select.q").value;
    if (q == 'legs') {
        document.querySelector('select.a1').classList.add('d-none');
        document.querySelector('select.a2').classList.remove('d-none');
    } else {
        document.querySelector('select.a2').classList.add('d-none');
        document.querySelector('select.a1').classList.remove('d-none');    
    }
  }

  return (
    <>
        <Header />
        <div className="container my-3">
            <div className="row mt-4 justify-content-center">
                <div className="col-12 col-lg-8">
                    <h4 className="text-primary">Ask Questions to Find the Animal!</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <select className="form-select q" aria-label="Default select example" onChange={qChange}>
                                <option value="fly">Can Fly ?</option>
                                <option value="friendly">Is Friendly ?</option>
                                <option value="pocket">Can Fit in Pocket ?</option>
                                <option value="legs">How Many Legs ?</option>
                            </select>
                            <select className="form-select a1" aria-label="Default select example">
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                            <select className="form-select a2 d-none" aria-label="Default select example">
                                <option value="0">0</option>
                                <option value="2">2</option>
                                <option value="4">4</option>
                                <option value="6">6</option>
                                <option value="8">8</option>
                            </select>
                            <button className="btn btn-success form-control" type="submit">ASK!</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row justify-content-center alerts">
                {right_ask &&
                    <div className="alert alert-success alert-dismissible fade show col-9 col-md-3 col-lg-2" role="alert">
                        You Are <strong>Right</strong>!
                    </div>
                }
                {wrong_ask &&
                    <div className="alert alert-danger alert-dismissible fade show col-9 col-md-3 col-lg-2" role="alert">
                        You Are <strong>Wrong</strong>!
                    </div>
                }
            </div>
            <div className="row justify-content-center mb-4">
                <div className="row row-cols-3 row-cols-md-4 g-4 col-11 col-lg-6 items">
                    {items.map((item) => {
                        return <div className="col" key={item.id}>
                        <div className="card shadow rounded" id={"it" + item.id} onClick={handleGuess}>
                            <img src={"http://localhost:3001/" + item.pic} className="card-img-top p-1 object-fit-cover" style={{ aspectRatio: 1 }} alt="..."/>
                        </div>
                    </div>
                    })}                    
                </div>
            </div>
        </div>
        
        <BackgroundImg />
    </>
  );
}

export default Game;
