import { useAuth } from '../context/AuthContext';
import Login from '../components/login';

const LoggedInRoute = ({ children }) => {
    const { isLoggedIn , loading } = useAuth();

    if(loading){
        return (
            <div><p>Loading ......</p></div>
        );
    }

    return isLoggedIn ? children : <Login />


}

export default LoggedInRoute;