import { useEffect, useState} from "react";
import { Picture } from "../interfaces/picture";
import { fetchPictures } from "../api/picturesApi";
import '../styles/photos.css';

const getYear = (dateStr: string) => new Date(dateStr).getFullYear();
const getMonth = (dateStr: string) => new Date(dateStr).getMonth() + 1;

const Photospage = () => {
    const [photosList, setPhotosList] = useState<Picture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //UUDET CONSTIT
    const [filteredPhotos, setFilteredPhotos] = useState<Picture[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null); // Lightboxin indeksi>
    const [showMonths, setShowMonths] = useState<boolean>(false);


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


    // Filter by year/month
    useEffect(() => {
        let filtered = [...photosList];

        if (selectedYear) {
            filtered = filtered.filter(p => p.uploadedAt && getYear(p.uploadedAt.toString()) === selectedYear);
        }

        if (selectedMonth) {
            filtered = filtered.filter(p => p.uploadedAt && getMonth(p.uploadedAt.toString()) === selectedMonth);
        }

        setFilteredPhotos(filtered);
    }, [photosList, selectedYear, selectedMonth]);
    

    // Compute available years dynamically
    const availableYears = Array.from(new Set(photosList.map(p => getYear(p.uploadedAt?.toString() ?? "")))).sort((a, b) => b - a);

    // Compute available months for selected year
    const availableMonths = selectedYear
        ? Array.from(new Set(photosList
            .filter(p => getYear(p.uploadedAt?.toString() ?? "") === selectedYear)
            .map(p => getMonth(p.uploadedAt?.toString() ?? ""))))
        : [];

    // Show latest 12 if no year selected
    const displayPhotos = selectedYear ? filteredPhotos : photosList.slice(-12).reverse();

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
        <div>
            {/* Select year */}
            <div className="year-filter">
                {availableYears.map(year => {
                    const isActive = year === selectedYear && showMonths;

                    return (
                        <button
                            key={year}
                            className={isActive ? "active" : ""}
                            onClick={() => {
                                if (year === selectedYear) {
                                    setShowMonths(prev => !prev);
                                    setSelectedMonth(null); 
                                } else {
                                    setSelectedYear(year);
                                    setSelectedMonth(null);
                                    setShowMonths(true);
                                }
                            }}
                        >
                            {year}
                        </button>
                    );
                })}
            </div>

            {/* Select month */}
            {selectedYear && showMonths && (
                <div className="month-filter">
                    {availableMonths.map(month => {
                        const isActive = month === selectedMonth;

                        return (
                            <button
                                key={month}
                                className={isActive ? "active" : ""}
                                onClick={() => {
                                    if (month === selectedMonth) {
                                        // Toggle off
                                        setSelectedMonth(null);
                                    } else {
                                        setSelectedMonth(month);
                                    }
                                }}
                            >
                                {month} / {selectedYear}
                            </button>
                        );
                    })}
                </div>
            )}
        
            <div className="photos-container">
                {displayPhotos.map((photo, index) => (
                    <div className="photo-item" key={photo.id} onClick={() => setLightboxIndex(index)}>
                        <img
                            src={photo.imageUrl ? photo.imageUrl : 'default-image.jpg'}
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

                        <button className="lightbox-prev" onClick={() => setLightboxIndex((lightboxIndex - 1 + displayPhotos.length) % displayPhotos.length)}>←</button>
                        <img
                            src={displayPhotos[lightboxIndex].imageUrl}
                            alt={displayPhotos[lightboxIndex].title}
                            className="lightbox-image"
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