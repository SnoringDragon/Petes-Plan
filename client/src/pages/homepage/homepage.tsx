import Button from '../../components/buttonset/buttonset'; 
import { useNavigate } from 'react-router-dom';

export function Homepage() {
    const navigate = useNavigate();

    return (
    <>
      <Button 
        border="thick"
        color="grey"
        height = "100px"
        onClick={() =>  navigate('/login')    }
        radius = "5%"
        width = "300px"
        top = "60px"
        padding="50px"
        left = "500px"
        children = "Login"
      />
      <Button 
        border="thick"
        color="grey"
        height = "100px"
        onClick={() => navigate('/register')  }
        radius = "5%"
        width = "300px"
        padding="50px"
        top = "0px"
        left = "500px"
        children = "Register"
      />
      <Button 
        border="thick"
        color="grey"
        height = "100px"
        onClick={() => navigate('/dashboard')  }
        radius = "5%"
        width = "300px"
        padding="50px"
        top = "0px"
        left = "500px"
        children = "Dashboard (for ease of use)"
      />
    </>
    );
}   