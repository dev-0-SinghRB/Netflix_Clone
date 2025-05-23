import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContentStore } from '../store/content';
import Navbar from '../components/Navbar'
import axios from 'axios';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ReactPlayer from 'react-player';
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from '../utils/constants';
import WatchPageSkeleton from '../components/skeletons/WatchPageSkeleton';

function formatReleaseDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

const WatchPage = () => {
    const { id } = useParams();
    const [trailers, setTrailers] = useState([])
    const { contentType } = useContentStore();

    const [currentTrailerId, setCurrentTrailerId] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [content, setContent] = useState({});
    const [similerContent, setSimilerContent] = useState([])
    const sliderRef = useRef(null)
    useEffect(() => {
        const getTrailers = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
                setTrailers(res.data.trailers);
            } catch (error) {
                if (error.message.includes("404")) {
                    setTrailers([]);
                }
            }
        };

        getTrailers()
    }, [contentType, id])


    useEffect(() => {
        const getSimilarContent = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
                setSimilerContent(res.data.similar);
            } catch (error) {
                if (error.message.includes("404")) {
                    setSimilerContent([]);
                }
            }
        };

        getSimilarContent()
    }, [contentType, id])

    useEffect(() => {
        const getContentDetails = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
                setContent(res.data.content);
            } catch (error) {
                if (error.message.includes("404")) {
                    setContent([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getContentDetails()
    }, [contentType, id])

    const handleNext = () => {
        if (currentTrailerId < trailers.length - 1) setCurrentTrailerId(currentTrailerId + 1);
    }
    const handlePrev = () => {
        if (currentTrailerId > 0) setCurrentTrailerId(currentTrailerId - 1);
    }

    const scrollLeft = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: -sliderRef.current.ofsetWidth, behavior: 'smooth' })
    }

    const scrollRight = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: sliderRef.current.ofsetWidth, behavior: 'smooth' })
    }

    if (isLoading) return (
        <div className='min-h-screen bg-black p-10'>
            <WatchPageSkeleton />
        </div>

    )
    if (!content) {
        return (
            <div className='bg-black text-white h-screen'>
                <div className='max-w-6xl mx-auto'>
                    <Navbar />
                    <div className='text-center mx-auto px-4 py-8 h-full mt-40'>
                        <h2 className='text-2xl sm:text-5xl font-bold text-balance'> Content not found 🥲</h2>

                    </div>
                </div>

            </div>
        );
    }
    return (
        <div className='bg-black min-h-screen text-white'>
            <div className='mx-auto container px-4 py-8 h-full'>
                <Navbar />
                {trailers?.length > 0 && (
                    <div className='flex justify-between items-center mb-4'>

                        <button
                            className={` bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerId === 0 ?
                                'opacity-50 cursor-not-allowed' : ""}
                                `}
                            disabled={currentTrailerId === 0}
                            onClick={handlePrev}
                        >
                            <ChevronLeft size={24} />

                        </button>

                        <button
                            className={` bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerId === trailers.length - 1 ?
                                'opacity-50 cursor-not-allowed' : ""} 
                                `}
                            disabled={currentTrailerId === trailers.length - 1}
                            onClick={handleNext}
                        >
                            <ChevronRight size={24} />
                        </button>

                    </div>
                )}

                <div className='aspect-video mb-8 p-2 sm:px-10 md:px-32'>

                    {trailers?.length > 0 && (
                        <ReactPlayer
                            controls={true}
                            width={"100%"}
                            height={"70vh"}
                            className='mx-auto overflow-hidden rounded-lg'
                            url={`https://www.youtube.com/watch?v=${trailers[currentTrailerId]?.key}`}
                        // playing={true}
                        />
                    )}
                    {trailers?.length === 0 && (
                        <h2 className='text-xl text-center mt-5'>
                            No Trailers Available{" "}
                            <span className='font-bold text-red-600'>{content?.title || content?.name}</span> 🥲
                        </h2>
                    )}

                </div>
                {/* Content Details */}
                <div
                    className='flex flex-col md:flex-row items-center justify-between gap-20
                    max-w-6xl mx-auto'
                >
                    <div
                        className='mb-4 md:mb-0'
                    >
                        <h2 className='text-5xl font-bold text-balance'>
                            {content?.title || content?.name}
                        </h2>
                        <p className='mt-2 text-lg'>
                            {formatReleaseDate(content?.release_date || content?.first_air_date)}  {" "}
                            {content?.adult ? (
                                <span className='text-red-600'>18+</span>
                            ) : (
                                <span className='text-green-600'>PG-13</span>
                            )}{" "}
                        </p>

                        <p className='mt-4 text-lg'>
                            {content?.overview}
                        </p>
                    </div>
                    <img src={ORIGINAL_IMG_BASE_URL + content?.poster_path} alt="Poster image"
                        className='max-h-[600px] rounded-md'
                    />
                </div>

                {similerContent?.length > 0 && (
                    <div className='mt-12 max-w-5xl mx-auto relative'>
                        <h3 className='text-3xl font-bold mb-4'>
                            Similar Movies/TV shows
                        </h3>
                        <div className='flex overflow-x-scroll  no-scrollbar gap-4 pb-4 group' ref={sliderRef}>
                            {similerContent.map((content) => {
                                if (content.poster_path === null) return null;
                                return (
                                    <Link to={`/watch/${content?.id}`} key={content?.id} className='min-w-[250px] relative group'>
                                        <div className='rounded-lg overflow-hidden'>
                                            <img src={SMALL_IMG_BASE_URL + content?.backdrop_path} alt="Movie image"
                                                className='transition-transform duration-300 ease-in-out group-hover:scale-125'
                                            />
                                        </div>

                                        <p className='mt-2 text-center'>
                                            {content?.title || content?.name}
                                        </p>
                                    </Link>
                                )
                            })}

                            <ChevronRight
                                className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
                                opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
                                bg-red-600 text-white rounded-full'
                                onClick={scrollRight}
                            />

                            <ChevronLeft
                                className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8
                                opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
                                bg-red-600 text-white rounded-full'
                                onClick={scrollLeft}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchPage;