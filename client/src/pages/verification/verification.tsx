import Button from '../../components/buttonset/buttonset'; 
import { useNavigate } from 'react-router-dom';

export function Verification() {
    const navigate = useNavigate();

    return (
    <div className="h-full flex flex-col items-center justify-center">
    <div> An email has been sent to reset your password. </div>
    <p></p>
    <a href='/'><u>Return to homepage.</u></a >
    </div>
    );
}   