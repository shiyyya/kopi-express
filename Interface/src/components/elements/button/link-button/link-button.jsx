import { Link } from 'react-router';
import './link-button.css';

function LinkButton({goto = "/", icon: Icon = PlaceHolderIcon, label = "oi nalimutan mo label", type = "normal"}) {

    return (
        <Link
            to={goto} 
            className={`linkButton ${type}`} 
            style={{ textDecoration: 'none'}} 
        >
            <Icon className="icon" />
            <span className="label">{label}</span>
        </Link>
    );
}

export default LinkButton

