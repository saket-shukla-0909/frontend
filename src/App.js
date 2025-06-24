import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Home/home';
import { isTokenValid } from './Utils/auth';
// import Loading from './Components/Loading';

function App() {
  // const localtion = useLocation
  const { isLoggedIn } = useSelector((state) => state.auth);
  const tokenValid = isTokenValid();

  const isAuthenticated = isLoggedIn || tokenValid;

  return (
    // <Loading/>
    <BrowserRouter>
      <Routes>
        {/* Default route based on token */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/Home" /> : <Navigate to="/Login" />
          }
        />
        <Route path="/SignUp" element={<SignUp />} />
        <Route
          path="/Login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/Home" />}
        />
        <Route
          path="/Home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/Login" replace />
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
