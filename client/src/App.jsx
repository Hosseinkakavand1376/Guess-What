import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Difficulty from './pages/Difficulty';
import Game from './pages/Game';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

// routing the site
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<LogIn />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="difficulty" element={<Difficulty />} />
          <Route path="game" element={<Game />} />
        </Route>
      </Routes>
    </BrowserRouter>
);
