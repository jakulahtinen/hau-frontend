import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPictures } from "../api/picturesApi";
import { Picture } from "../interfaces/picture";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import "../styles/photosdetail.css";

const PhotosDetailPage = () => {
    const { id } = useParams();
    const [photo, setPhoto] = useState<Picture | null>(null);
    const photoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPhoto = async () => {
            try {
                const pictures = await fetchPictures();
                const found = pictures.find(p => p.id === parseInt(id!));
                setPhoto(found || null);
            } catch (error) {
                console.error("Kuvan lataus epäonnistui:", error);
            }
        };
        loadPhoto();
    }, [id]);

    useEffect(() => {
        if (photo) {
            setTimeout(() => {
                const navbarHeight = document.querySelector(".navbar")?.clientHeight || 80; 
                const offset = navbarHeight + 50; 
                const top = photoRef.current!.getBoundingClientRect().top + window.scrollY - offset;
    
                window.scrollTo({ top, behavior: "smooth" });
            }, 200);
        }
    }, [photo]);

    if (!photo) return <p>Kuvaa ei löytynyt.</p>;
    
    return (
        <div className="photo-detail" ref={photoRef}>
            <div className="photo-header">
                <Link to="/photos">
                    <ArrowBackIosNewRoundedIcon className="back-button" fontSize="large" style={{ color: "black" }} />
                </Link>
            </div>
            {photo.imageData && (
                <div className="photo-wrapper">
                    <img
                        src={`data:image/jpeg;base64,${photo.imageData}`}
                        alt={photo.title}
                        className="photo-detail-image"
                    />
                </div>
            )}
            <p>{photo.title}</p>
        </div>
    );
}


export default PhotosDetailPage;