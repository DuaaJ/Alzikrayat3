
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext';
import './PhotoDetail.css';

const API_URL = 'http://localhost:5000';

function PhotoDetail() {
    const { id } = useParams();
    const { user } = useAuth();

    const [photo, setPhoto] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const photoResponse = await fetch(`${API_URL}/api/photos/${id}`);

                if (!photoResponse.ok) {
                    throw new Error('Photo not found');
                }

                const photoData = await photoResponse.json();
                setPhoto(photoData);

                const commentsResponse = await fetch(
                    `${API_URL}/api/photos/${id}/comments`
                );

                if (!commentsResponse.ok) {
                    throw new Error('Could not load comments');
                }

                const commentsData = await commentsResponse.json();
                setComments(commentsData);

            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleComment = async (e) => {
        e.preventDefault();

        if (!comment.trim()) return;

        if (!user?._id) {
            setError('Please log in to add a comment.');
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/photos/${id}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user._id,
                        comment: comment
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not add comment');
            }

            setComments((previous) => [
                ...previous,
                data.comment
            ]);

            setComment('');
            setError('');

        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <p>Loading photo...</p>
            </>
        );
    }

    if (!photo) {
        return (
            <>
                <Navbar />
                <p>{error || 'Photo not found.'}</p>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <section className="user-photo">
                <div className="photo-section">
                    <p className="user">
                        {photo.userId?.firstName} {photo.userId?.lastName}
                    </p>

                    <img
                        src={`${API_URL}/uploads/${photo.fileName}`}
                        alt={photo.title}
                    />
                </div>

                <div className="details-section">
                    <p>{photo.title}</p>
                    <p>{photo.description}</p>
                    <p>
                        {photo.dateTime
                            ? new Date(photo.dateTime).toLocaleString()
                            : ''}
                    </p>
                </div>
            </section>

            <section className="comment-section">
                <h2>Comments</h2>

                {comments.map((item) => (
                    <div className="comments" key={item._id}>
                        <label>
                            {item.userId?.firstName} {item.userId?.lastName}
                        </label>

                        <p>{item.comment}</p>

                        <small>
                            {new Date(item.dateTime).toLocaleString()}
                        </small>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p>No comments yet. Be the first to comment!</p>
                )}

                <div className="add-comment">
                    {user ? (
                        <form onSubmit={handleComment}>
                            <textarea
                                placeholder="Share your thoughts"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />

                            <button type="submit" aria-label="Send comment">
                                →
                            </button>
                        </form>
                    ) : (
                        <p>Please log in to add a comment.</p>
                    )}

                    {error && <p className="comment-error">{error}</p>}
                </div>
            </section>
        </>
    );
}

export default PhotoDetail;
