import Button from '../../components/buttonset/buttonset'; 
import { useNavigate } from 'react-router-dom';

export function Verification() {
    const navigate = useNavigate();

    return (
    <>
    <div className="text-center mt-10"> An email has been sent to reset your password.
    <p></p>
    <a href='/'><u>Return to homepage.</u></a > </div>
    </>
    );
}   