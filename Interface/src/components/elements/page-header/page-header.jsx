import { useNavigate } from "react-router";
import './page-header.css';


function PageHeader({ title }) {
    const navigate = useNavigate();

    return (
        <header className="page-header">
            <button
                type="button"
                className="page-header-back"
                onClick={() => navigate(-1)}
            >
                ←
            </button>

            <h1 className="page-header-title">
                {title}
            </h1>
        </header>
    );
}

export default PageHeader;