
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import VerifyUser from './pages/VerifyUser';
import Reset from './pages/Reset';
import Forgot from './pages/Forgot';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user/:id/verify/:token' element={<VerifyUser />} />
          <Route path='/user/:id/reset/:token' element={<Reset />} />
          <Route path='/forgot' element={<Forgot />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;
