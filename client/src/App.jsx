import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import {Routes,Route} from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ReferCandidate from './pages/ReferCandidate'
import Metrics from './pages/Metrics'
function App() {

  return (
    <>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/metrics' element={<Metrics/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/refer' element={<ReferCandidate/>}/>
        </Routes>
      <Footer/>
    </>
  )
}

export default App