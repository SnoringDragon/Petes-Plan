import { Professor } from '../../types/course-requirements';
import { Link } from 'react-router-dom';

export function Professor(props: { professors: Professor }) {
    // TODO: better looking prerequisites

    const data = props.professors;

    if (data === null) return (<span>None</span>);

    if (data.type === 'professor') {
        return (<span className={`bg-opacity-25`}>
            <Link to={`/professor?subject=${data.name}`}>
                {data.name}
            </Link>
        </span>);
    }

    return null;
}