import { useContext, useEffect, useState } from "react";
import { CurrentRadioContext } from "../../App";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import { BiRadio } from "react-icons/bi";
import { BsPlayFill, BsStopFill } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart, AiOutlineLoading } from "react-icons/ai";
import { BsVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Tooltip } from '@mantine/core';

function AudioPlayer() {
    
    // Variables for user authentication
    let [user, setUser] = useState<User | null>(null);
    let [verified, setVerified] = useState(false);

    // Global radio station context
    let { currentRadioStation } = useContext<any>(CurrentRadioContext);

    // Local state variables for the audio player
    let [stationName, setStationName] = useState('No station selected');
    let [thumbnailPresent, setThumbnailPresent] = useState(false);
    let [audio, setAudio] = useState(new Audio(''));
    let [audioVolume, setAudioVolume] = useState(50);
    let [audioPlaying, setAudioPlaying] = useState('stopped');
    let [muted, setMuted] = useState({muted: false, volumeBeforeMute: 50})
    let [stationLiked, setStationLiked] = useState(false);
    
    /* Check if user is logged in -> used to show/hide like button */
    useEffect(function getUserAuth() {
        let auth = getAuth();
        onAuthStateChanged(auth, user => {
            if(user) {
                setUser(user);
                if(user.emailVerified) setVerified(true);
                else setVerified(false);
            }
        });
    }, []);

    /* Extract global radio station information and set local states */
    useEffect(function getRadioStationContext() {
        // Reset previous audio stream
        audio.load();
        audio.src = '';
        setAudioPlaying('stopped');
        
        setStationName(currentRadioStation.stationName);
        
        if(currentRadioStation.stationThumbnail !== '') setThumbnailPresent(true);
        else setThumbnailPresent(false); 

        let initialPlayStream = async () => {
            try {
                audio.load();
                audio.src = '';
                setAudio(new Audio(currentRadioStation.streamUrl));
                await audio.play();
                audio.volume = audioVolume / 100;
                setAudioPlaying('playing');
            } catch (error) {
                console.log(error);
            }
        }

        if(currentRadioStation.streamUrl !== '') {
            initialPlayStream();            
            let button = document.getElementById('playButton');
            setTimeout(() => {
                button?.click();
            }, 500);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRadioStation]);

    async function playStream(): Promise<void> {
        if(audioPlaying === 'playing') {
            audio.pause();
            //audio.load();
            //audio.src = '';
            //setAudio(new Audio(currentRadioStation.streamUrl));
            setAudioPlaying('stopped');
        } else {
            try {
                // if muted.muted -> set volume to 0
                audio.volume = audioVolume / 100;
                audio.load();
                setAudioPlaying('loading');
                await audio.play();
                setAudioPlaying('playing');
            } catch (error) {
                console.log(error);
            }
        }
    }

    function likeStation(): void {
        if(verified === false) {
            console.log('You must verify your email address before you can like a station.');
            return;
        }
        stationLiked ? setStationLiked(false) : setStationLiked(true);
    }

    function handleVolumeChange(event: any): void {
        let newVolume: number = event.target.value;

        if(Math.abs(newVolume - 50) <= 3) {
            setAudioVolume(50);
            audio.volume = 0.5;
        } else {
            setAudioVolume(newVolume);
            audio.volume = newVolume / 100;
        }
    }

    function muteAudio(): void {
        if(muted.muted === true) {
            audio.volume = muted.volumeBeforeMute / 100;
            setMuted({muted: false, volumeBeforeMute: audioVolume});
        } else {
            setMuted({muted: true, volumeBeforeMute: audioVolume});
            audio.volume = 0;
        }
    }

    return (
        <div className='grid grid-cols-3 gap-10 justify-items-center items-center fixed bottom-0 w-screen h-20 border-t border-gray-800 bg-gray-100'>
            {/* Radio name + radio thumbnail */}
            <div className='flex flex-row items-center'>
                <div className='w-14 h-14 bg-gray-300 rounded-lg mr-6 flex items-center justify-center'>
                    {
                        thumbnailPresent ?
                        <img src={currentRadioStation.stationThumbnail} alt='radio thumbnail' className='w-6 h-6' />
                        :
                        <IconContext.Provider value={{ className: 'text-gray-500 w-6 h-6' }}>
                            <BiRadio/>
                        </IconContext.Provider>
                    }
                </div>
                <h1>{stationName}</h1>
            </div>
            
            {/* Radio play button */}
            <div>
                <button
                    id="playButton" 
                    onClick={playStream} 
                    disabled={audioPlaying === 'loading' || currentRadioStation.streamUrl === ''} 
                    className={
                        `rounded-full border border-gray-800 bg-gray-800 hover:bg-gray-700 w-12 h-12 flex items-center justify-center 
                        ${audioPlaying === 'loading' && 'cursor-progress'}
                        ${currentRadioStation.streamUrl === '' && 'cursor-not-allowed'}`
                    }
                    aria-labelledby='playButtonLabel'
                >
                    {
                        audioPlaying === 'stopped' &&
                        <IconContext.Provider value={{ className: 'text-white pl-0.5 w-6 h-6' }}>
                            <BsPlayFill/>
                        </IconContext.Provider>
                    }
                    {
                        audioPlaying === 'playing' &&
                        <IconContext.Provider value={{ className: 'text-white w-6 h-6' }}>
                            <BsStopFill/>
                        </IconContext.Provider>
                    }
                    {
                        audioPlaying === 'loading' &&
                        <IconContext.Provider value={{ className: 'animate-spin text-white w-6 h-6' }}>
                            <AiOutlineLoading/>
                        </IconContext.Provider>
                    }
                    <span id='playButtonLabel' hidden>Play/Stop</span>
                </button>
            </div>
            
            {/* Radio volume + like button */}
            <div className='flex flex-row items-center'>
                <div className={`${user !== null ? 'mr-10' : ''}`}>
                    <div className='flex flex-row items-center'>
                        <p className='text-sm mr-14'>Volume</p>
                        <button 
                            onClick={muteAudio} 
                            className={
                                `rounded-full hover:bg-gray-200 w-8 h-8 pl-1.5 first-letter
                                ${currentRadioStation.streamUrl === '' && 'cursor-not-allowed'}`
                            }
                            disabled={currentRadioStation.streamUrl === ''}
                            aria-labelledby='muteLabel'
                        >
                            <IconContext.Provider value={{className: 'h-5 w-5'}}>
                                { muted.muted === false ? <BsFillVolumeUpFill/> : <BsVolumeMuteFill/> }
                            </IconContext.Provider>
                            <span id='muteLabel' hidden>Mute</span>
                        </button>
                    </div>
                    <span id='volumeLabel' hidden>Volume</span>
                    <input 
                        type='range' 
                        min='0' max='100' step='1' 
                        value={audioVolume} 
                        onChange={handleVolumeChange} 
                        className={`w-full hover:cursor-grab accent-gray-800 ${currentRadioStation.streamUrl === '' && 'hover:cursor-not-allowed'}`}
                        disabled={currentRadioStation.streamUrl === ''}
                        list='volumeDataList'
                        aria-labelledby='volumeLabel'
                    />
                    <datalist id='volumeDataList'>
                        <option value='50'/>
                    </datalist>
                </div>
                
                {/* Logged in, verified user -> can like stations */}
                {
                    (user !== null) && (verified === true) &&
                    <>
                        <button  
                            onClick={likeStation} 
                            className={`rounded-full hover:bg-red-100 w-10 h-10 flex items-center justify-center ${currentRadioStation.streamUrl === '' && 'hover:cursor-not-allowed'}`}
                            disabled={currentRadioStation.streamUrl === ''}
                            aria-labelledby='likeLabel'
                        >
                        {
                            stationLiked === false &&
                            <IconContext.Provider value={{ className: 'text-red-600 w-8 h-8 pt-0.5' }}>
                                <AiOutlineHeart/>
                            </IconContext.Provider>
                        }
                        {
                            stationLiked === true &&
                            <IconContext.Provider value={{ className: 'text-red-600 w-8 h-8 pt-0.5' }}>
                                <AiFillHeart/>
                            </IconContext.Provider>
                        }
                            <span id='likeButtonLabel' hidden>Like button</span>
                        </button>
                    </>
                }

                {/* Logged in, unverified user -> can't like stations -> show tooltip */}
                {
                    (user !== null) && (verified === false) &&
                    <Tooltip 
                        wrapLines 
                        position='left' 
                        width={200} 
                        withArrow 
                        transition='fade' 
                        transitionDuration={200} 
                        label='Your account must be verified to like stations.'
                    >
                        <button  onClick={likeStation} className="rounded-full hover:cursor-not-allowed w-10 h-10 flex items-center justify-center">
                        {
                            stationLiked === false &&
                            <IconContext.Provider value={{ className: 'text-red-600 w-8 h-8 pt-0.5' }}>
                                <AiOutlineHeart/>
                            </IconContext.Provider>
                        }
                        {
                            stationLiked === true &&
                            <IconContext.Provider value={{ className: 'text-red-600 w-8 h-8 pt-0.5' }}>
                                <AiFillHeart/>
                            </IconContext.Provider>
                        }
                        </button>
                    </Tooltip>
                }
            </div>
        </div>
    );
}
export default AudioPlayer;