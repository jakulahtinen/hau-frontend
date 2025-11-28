import { useEffect, useState, useRef } from "react";
import { Picture } from "../interfaces/picture";
import { Folder } from "../interfaces/folder";
import { fetchFolders, fetchLatestPictures, fetchPicturesByFolder } from "../api/picturesApi";
import '../styles/photos.css';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';


const Photospage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null); 
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchMoveX, setTouchMoveX] = useState<number | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [latestPhotos, setLatestPhotos] = useState<Picture[]>([]); 
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [folderPhotos, setFolderPhotos] = useState<Picture[]>([]); 
    const folderDetailRef = useRef<HTMLDivElement>(null); 
    const [offsetX, setOffsetX] = useState(0); 
    const THRESHOLD = 50;
    const SLIDE_WIDTH_PERCENTAGE = 100;
    const translatePercentage = lightboxIndex !== null ? lightboxIndex * SLIDE_WIDTH_PERCENTAGE : 0;
    const shouldAnimate = touchStartX === null && offsetX === 0;    

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (lightboxIndex === null) return;
        setTouchStartX(e.touches[0].clientX);
        setOffsetX(0);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null || lightboxIndex === null) return;

        const touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;

        setOffsetX(diff);
    };

    const handleTouchEnd = () => {
        if (touchStartX === null || lightboxIndex === null) return;

        if (Math.abs(offsetX) > THRESHOLD) {
            if (offsetX > 0) {
                // Left → next image
                setLightboxIndex((prev) => (prev! + 1) % displayPhotos.length);
            } else {
                // Right → previous image
                setLightboxIndex((prev) => (prev! - 1 + displayPhotos.length) % displayPhotos.length);
            }
        }

        setTouchStartX(null);
        setTimeout(() => {
            setOffsetX(0);
        }, 200);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 1. Fetch Latest 8 Photos
            const latestData = await fetchLatestPictures(8);
            setLatestPhotos(latestData);

            // 2. Fetch Folders (Albums)
            const folderData = await fetchFolders();
            setFolders(folderData);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Tuntematon virhe");
        } finally {
            setLoading(false);
        }
    };
    
    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);

        // Load pictures for a specific folder when one is selected
    useEffect(() => {
        const loadFolderPhotos = async () => {
            if (selectedFolder) {
                setLoading(true);
                try {
                    const data = await fetchPicturesByFolder(selectedFolder.id);
                    setFolderPhotos(data);
                } catch (err) {
                    setError("Virhe ladatessa kansion kuvia.");
                } finally {
                    setLoading(false);
                }
            }
        };
        loadFolderPhotos();
    }, [selectedFolder]);

    useEffect(() => {
        if (selectedFolder && folderDetailRef.current) {
            setTimeout(() => {
                const navbarHeight = document.querySelector(".navbar")?.clientHeight || 80; 
                const offset = navbarHeight + 140; 
                const targetElement = folderDetailRef.current!;
                const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;
    
                window.scrollTo({ top, behavior: "smooth" });
            }, 200); 
        }
    }, [selectedFolder, folderPhotos.length]);

    // Determine which photo list to display for the lightbox
    const displayPhotos = selectedFolder ? folderPhotos : latestPhotos; 

    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                setLightboxIndex((prev) => (prev! + 1) % displayPhotos.length);
            } 
            else if (e.key === "ArrowLeft") {
                setLightboxIndex((prev) => (prev! - 1 + displayPhotos.length) % displayPhotos.length);
            }
            else if (e.key === "Escape") {
                setLightboxIndex(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, displayPhotos.length]);



    if (loading) return <p>Ladataan kuvia...</p>;
    if (error) return <p>Virhe: {error}</p>;

    
    return (
        <div className="photos-page-wrapper">
            <h1>Kuvagalleria</h1>

                        {selectedFolder ? (
                // --- FOLDER DETAIL VIEW ---
                <div className="folder-detail-view" ref={folderDetailRef}>
                    <div className="folder-header">
                        <ArrowBackIosNewRoundedIcon className="back-button" fontSize="large" style={{ color: "black" }} onClick={() => setSelectedFolder(null)}/>
                    </div>
                    <h2>{selectedFolder.name}</h2>
                    
                    <div className="photos-container">
                        {folderPhotos.map((photo, index) => (
                             <div className="photo-item" key={photo.id} onClick={() => setLightboxIndex(index)}>
                                <img src={photo.imageUrl} alt={photo.title} className="photo-image" />
                                <h3 className="photo-title">{photo.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>

            ) : (
                // --- MAIN GALLERY VIEW (LATEST & FOLDERS) ---
                <div>
                    
                    {/* 1. LATEST PHOTOS PREVIEW (6 Images) */}
                    <h2>Viimeisimmät kuvat</h2>
                    <div className="photos-container latest-preview-grid">
                        {latestPhotos.map((photo, index) => (
                             <div className="photo-item latest-item" key={photo.id} onClick={() => setLightboxIndex(index)}>
                                <img src={photo.imageUrl} alt={photo.title} className="photo-image" />
                                <h3 className="photo-title">{photo.title}</h3>
                            </div>
                        ))}
                    </div>
                    
                    <hr />

                    {/* 2. FOLDER GRID */}
                    <h2>Selaa kansioita</h2>
                    <div className="folders-container folder-grid">
                        {folders.map((folder) => (
                            <div 
                                className="folder-card" 
                                key={folder.id} 
                                onClick={() => setSelectedFolder(folder)}
                            >
                                <img 
                                    src={folder.coverImageUrl || 'placeholder.jpg'}
                                    alt={folder.name} 
                                    className="folder-cover-image" 
                                />
                                <h3 className="folder-title-overlay">{folder.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {lightboxIndex !== null && (
                <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✖</button>
                        <button className="lightbox-prev" onClick={() => setLightboxIndex((lightboxIndex - 1 + displayPhotos.length) % displayPhotos.length)}>←</button>
                    <img
                        src={displayPhotos[lightboxIndex].imageUrl}
                        alt={displayPhotos[lightboxIndex].title}
                        className="lightbox-image"
                        style={{
                            transition: offsetX === 0 ? 'transform 0.3s ease-out' : 'none', 
                            transform: `translateX(${-offsetX}px)` 
                        }}
                    />

                        <button className="lightbox-next" onClick={() => setLightboxIndex((lightboxIndex + 1) % displayPhotos.length)}>→</button>
                        <p className="lightbox-counter">
                            {lightboxIndex + 1} / {displayPhotos.length}
                        </p>

                        <p className="lightbox-caption">{displayPhotos[lightboxIndex].title}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Photospage;