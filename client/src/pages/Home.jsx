
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PhotoCard from '../components/PhotoCard';
import './Home.css';

function Home() {
    const [photos, setPhotos] = useState([]);
    const [view, setView] = useState('three-columns');
    const [slideIndex, setSlideIndex] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/photos');

                if (!response.ok) {
                    throw new Error('Could not load photos');
                }

                const data = await response.json();
                setPhotos(data);
            } catch (error) {
                setError('Unable to load photos. Please try again.');
                console.error(error);
            }
        };

        fetchPhotos();
    }, []);

    const changeView = (newView) => {
        setView(newView);
        setSlideIndex(0);
    };

    const previousSlide = () => {
        setSlideIndex((current) =>
            current === 0 ? photos.length - 1 : current - 1
        );
    };

    const nextSlide = () => {
        setSlideIndex((current) =>
            current === photos.length - 1 ? 0 : current + 1
        );
    };

    return (
        <>
            <Navbar />

            <div className="home-container">
                <section className="welcome-section">
                    <h1>Welcome to Alzikrayat</h1>
                    <p>Share your memories and explore moments captured by others.</p>
                </section>

                <section className="gallery-section">
                    <div className="gallery-header">
                        <h2>Photo Gallery</h2>

                        <div className="view-buttons">
                            <button
                                className={view === 'three-columns' ? 'active' : ''}
                                onClick={() => changeView('three-columns')}
                            >
                                3 Columns
                            </button>

                            <button
                                className={view === 'four-columns' ? 'active' : ''}
                                onClick={() => changeView('four-columns')}
                            >
                                4 Columns
                            </button>

                            <button
                                className={view === 'list' ? 'active' : ''}
                                onClick={() => changeView('list')}
                            >
                                List
                            </button>

                            <button
                                className={view === 'slider' ? 'active' : ''}
                                onClick={() => changeView('slider')}
                            >
                                Slider
                            </button>
                        </div>
                    </div>

                    {error && <p>{error}</p>}

                    {!error && photos.length === 0 && (
                        <p>No photos uploaded yet.</p>
                    )}

                    {photos.length > 0 && view !== 'slider' && (
                        <div className={`photo-gallery ${view}`}>
                            {photos.map((photo) => (
                                <PhotoCard key={photo._id} photo={photo} />
                            ))}
                        </div>
                    )}

                    {photos.length > 0 && view === 'slider' && (
                        <div className="photo-slider">
                            <button
                                className="slider-arrow"
                                onClick={previousSlide}
                                aria-label="Previous photo"
                            >
                                &#10094;
                            </button>

                            <div className="slider-window">
                                <div
                                    className="slider-track"
                                    style={{
                                        transform: `translateX(-${slideIndex * 100}%)`
                                    }}
                                >
                                    {photos.map((photo) => (
                                        <div className="slider-item" key={photo._id}>
                                            <PhotoCard photo={photo} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="slider-arrow"
                                onClick={nextSlide}
                                aria-label="Next photo"
                            >
                                &#10095;
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

export default Home;
