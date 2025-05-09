import { useAuthUserStore } from '../../store/authUser';
import AuthScreen from './AuthScreen';
import HomeScreen from './HomeScreen';

const HomePage = () => {
    const { user } = useAuthUserStore();
    return <>{user ? <HomeScreen /> : <AuthScreen />}</>;

}

export default HomePage;