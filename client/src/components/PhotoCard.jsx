
import { Link } from 'react-router-dom';

function PhotoCard({ photo }) {
    return (
        <Link to={`/photos/${photo._id}`} className="photo-card">
            <img
                src={`http://localhost:5000/uploads/${photo.fileName}`}
                alt={photo.title}
            />

            <div className="photo-card-overlay">
                <h3>{photo.title}</h3>
                <span>View Details</span>
            </div>
        </Link>
    );
}

export default PhotoCard;

