import { useEffect } from 'react'

import './App.css'
import api from './api.ts'

function App() {

  const handleLogin = async () => {
    await api.login("thomas.max@gmail.com", "123");
    await api.getCurrentUser();
    await api.getSeance("2");
    await api.getAllSeances();
  };


  return (
    <>
      <div>
        <h1 className='text-center'>Coucou c'est moi</h1>

        <button onClick={handleLogin}>
          Tester connexion
        </button>

      </div>
    </>
  )
}

export default App
