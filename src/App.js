import React from 'react';
import './App.css';
import LoginPage from "./components/login";
import MainPage from "./components/main";
import {getLocalUser} from "./api/api";

const App = () => {
  const user = getLocalUser();
  return user ? <MainPage username={user.username} isAdmin={user.isAdmin}/> : <LoginPage />;
}

export default App;
