import React, { useEffect, useState} from "react";
import { Picture } from "../interfaces/picture";
import { fetchPictures } from "../api/picturesApi";
import { Link } from "react-router-dom";
import '../styles/photos.css';

const getYear = (dateStr: string) => new Date(dateStr).getFullYear();

const Photospage = () => {
    const [photosList, setPhotosList] = useState<Picture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //UUDET CONSTIT
    const [filteredPhotos, setFilteredPhotos] = useState<Picture[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null); // Lightboxin indeksi>

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


    //FILTERING LATER
    useEffect(() => {
        const filtered = photosList.filter(p => p.uploadedAt && getYear(p.uploadedAt.toString()) === selectedYear);
        setFilteredPhotos(filtered);
    }, [photosList, selectedYear]);

    //LightBox>
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;

            if (e.key === "ArrowRight") {
                setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
            } else if (e.key === "ArrowLeft") {
                setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
            } else if (e.key === "Escape") {
                setLightboxIndex(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, filteredPhotos.length]);


    if (loading) return <p>Ladataan kuvia...</p>;
    if (error) return <p>Virhe: {error}</p>;


    return (
        <div>
            <div className="year-filter">
                {[2025].map((year) => (
                    <button
                        key={year}
                        className={year === selectedYear ? "active" : ""}
                        onClick={() => setSelectedYear(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>
        
            <div className="photos-container">
                {filteredPhotos.map((photo, index) => (
                    <div className="photo-item" key={photo.id} onClick={() => setLightboxIndex(index)}>
                        <img
                            src={photo.imageData ? `data:image/jpeg;base64,${photo.imageData}` : 'default-image.jpg'}
                            alt={photo.title}
                            className="photo-image"
                        />
                        <h3 className="photo-title">{photo.title}</h3>
                    </div>
                ))}
            </div>
            {lightboxIndex !== null && (
                <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✖</button>
                        <button className="lightbox-prev" onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length)}>←</button>
                        <img
                            src={`data:image/jpeg;base64,${filteredPhotos[lightboxIndex].imageData}`}
                            alt={filteredPhotos[lightboxIndex].title}
                            className="lightbox-image"
                        />
                        <button className="lightbox-next" onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}>→</button>
                        <p className="lightbox-caption">{filteredPhotos[lightboxIndex].title}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Photospage;