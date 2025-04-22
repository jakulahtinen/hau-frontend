import React, { useEffect, useState} from "react";
import { Picture } from "../interfaces/picture";
import { fetchPictures } from "../api/picturesApi";
import { Link } from "react-router-dom";
import '../styles/photos.css';

const Photospage = () => {
    const [photosList, setPhotosList] = useState<Picture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                setLoading(true);
                const data = await fetchPictures();
                setPhotosList(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };
        loadPhotos();
    }, []);

    if (loading) return <p>Ladataan kuvia...</p>;
    if (error) return <p>Virhe: {error}</p>;

    return (
        <div className="photos-container">
            {photosList.map((photo: any) => (
                <div className="photo-item" key={photo.id}>
                    <Link to={`/photos/${photo.id}`} className="photo-link">
                        <img
                            src={photo.imageData ? `data:image/jpeg;base64,${photo.imageData}` : 'default-image.jpg'}
                            alt={photo.title}
                            className="photo-image"
                        />
                    </Link>
                    <h3 className="photo-title">{photo.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default Photospage;