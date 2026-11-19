
import Navbar from '../components/Navbar';
import './About.css';

function About() {
    return (
        <>
            <Navbar />

            <div className="about-container">
                <section className="about-content">
                    <h1>About Alzikrayat</h1>

                    <p>
                        Welcome to Alzikrayat, a place where people can
                        share their memories and explore moments captured
                        by others.
                    </p>

                    <p>
                        Our platform allows users to upload photos,
                        add descriptions, view other people's photos,
                        and interact through comments.
                    </p>

                    <p>
                        We believe every photo tells a story, and
                        Alzikrayat is here to help you share yours.
                    </p>
                </section>

                <section className="about-mission">
                    <h2>Our Mission</h2>
                    <p>
                        To create a simple and friendly platform for
                        sharing memories and connecting people through
                        photography.
                    </p>
                </section>
            </div>
        </>
    );
}

export default About;
