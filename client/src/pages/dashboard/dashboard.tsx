import { Layout } from '../../components/layout/layout';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();

    if (!UserService.isLoggedIn())
        setTimeout(() => navigate('/'), 1);

    return (<Layout>
        <div>dashboard</div>
    </Layout>);
}
