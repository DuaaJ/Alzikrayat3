
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";
import "./Profile.css";

const API_URL = "http://localhost:5000";

function Profile() {
    const { user } = useAuth();

    const [photos, setPhotos] = useState([]);
    const [picture, setPicture] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Get photos belonging to the logged-in user
    const fetchPhotos = async () => {
        try {
            const response = await fetch(`${API_URL}/api/photos`);

            if (!response.ok) {
                throw new Error("Failed to load photos");
            }

            const data = await response.json();

            const myPhotos = data.filter(
                (photo) =>
                    photo.userId?._id === user._id ||
                    photo.userId === user._id
            );

            setPhotos(myPhotos);
        } catch (error) {
            console.error("Fetch photos error:", error);
            setMessage("Could not load your photos.");
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchPhotos();
        }
    }, [user]);

    // Upload photo
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!picture || !title.trim()) {
            setMessage("Please select a photo and enter a title.");
            return;
        }

        const formData = new FormData();
        formData.append("picture", picture);
        formData.append("userId", user._id);
        formData.append("title", title);
        formData.append("description", description);

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(`${API_URL}/api/photos`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            setMessage("Photo uploaded successfully!");

            setPicture(null);
            setTitle("");
            setDescription("");

            document.getElementById("photoInput").value = "";

            await fetchPhotos();

        } catch (error) {
            console.error("Upload error:", error);
            setMessage(error.message);

        } finally {
            setLoading(false);
        }
    };

    // Delete photo
    const handleDelete = async (photoId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this photo?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_URL}/api/photos/${photoId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user._id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setPhotos((previousPhotos) =>
                previousPhotos.filter((photo) => photo._id !== photoId)
            );

            setMessage("Photo deleted successfully!");

        } catch (error) {
            console.error("Delete error:", error);
            setMessage(error.message);
        }
    };

    return (
        <>
            <Navbar />

            <div className="profile-container">

                <div className="profile-header">
                    <h1>
                        {user?.firstName} {user?.lastName}
                    </h1>

                    <p>{user?.occupation}</p>
                    <p>{user?.location}</p>
                    <p>{user?.description}</p>
                </div>

                <form
                    className="upload-form"
                    onSubmit={handleUpload}
                >
                    <h2>Share a New Memory</h2>

                    <input
                        id="photoInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPicture(e.target.files[0])}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Photo title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Write a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Uploading..." : "Upload Photo"}
                    </button>

                    {message && (
                        <p className="profile-message">{message}</p>
                    )}
                </form>

                <section className="memories-section">
                    <h2>My Photos</h2>

                    {photos.length === 0 ? (
                        <p>You haven't uploaded any photos yet.</p>
                    ) : (
                        <div className="memories-grid">

                            {photos.map((photo) => (
                                <div
                                    className="memory-card"
                                    key={photo._id}
                                >
                                    <img
                                        src={`${API_URL}/uploads/${photo.fileName}`}
                                        alt={photo.title}
                                    />

                                    <div className="memory-info">
                                        <h3>{photo.title}</h3>

                                        <p>{photo.description}</p>

                                        <small>
                                            {new Date(
                                                photo.dateTime
                                            ).toLocaleDateString()}
                                        </small>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(photo._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </section>

            </div>
        </>
    );
}

export default Profile;
