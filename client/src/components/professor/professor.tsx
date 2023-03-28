import { ProfessorReq } from '../../types/course-requirements';
import { Link } from 'react-router-dom';

export function Professor(props: { professors: ProfessorReq }) {

    const data = props.professors;

    if (data === null) return (<span>None</span>);

    if (data.type === 'professor') {
        return (<span className={`bg-opacity-25`}>
            <Link to={`/professor?name=${data.name}`}>
                {data.name}
            </Link>
        </span>);
    }

    return null;
}