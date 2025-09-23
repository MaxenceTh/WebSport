import { useEffect } from 'react'

import './App.css'
import axios from 'axios'

function App() {

  // http://localhost:8005/auth/login

useEffect(() => {
  axios.post('http://localhost:8005/auth/login',
    { email: "thomas.max@gmail.com", password: "123" },
    { headers: { "Content-Type": "application/json" } }
  )
  .then(response => {
    console.log(response.data)
    const token = response.data.token;
    localStorage.setItem('token', token);

    // Appel à la route protégée après récupération du token
    return axios.get("http://localhost:8005/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
  })
  .then(res => console.log(res.data))
  .catch(err => console.error('There was an error!', err));
}, []);


  return (
    <>
      <div>
        <h1 className='text-center'>Coucou c'est moi</h1>
      </div>
    </>
  )
}

export default App
