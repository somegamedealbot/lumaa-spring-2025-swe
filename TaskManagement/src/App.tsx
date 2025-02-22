import { useState } from 'react'
import './App.css'
import { Auth } from './components/auth'
import { Tasks } from './components/tasks';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('jwt') ? true : false);

  if (!isAuth) {
    return <Auth setIsAuth={setIsAuth}/>
  }
  else {
    return <Tasks setIsAuth={setIsAuth}></Tasks>
  }
}

export default App
