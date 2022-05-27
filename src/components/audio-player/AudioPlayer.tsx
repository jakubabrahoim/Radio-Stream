import { useState } from "react";
import { BiRadio } from "react-icons/bi";
import { BsPlayFill, BsStopFill } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart, AiOutlineLoading } from "react-icons/ai";
import { IconContext } from "react-icons";

function AudioPlayer() {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [thumbnailPresent, setThumbnailPresent] = useState(false);
    let [audioPlaying, setAudioPlaying] = useState('stopped');
    let [stationLiked, setStationLiked] = useState(false);

    let streamUrl: string = 'http://stream.funradio.sk:8000/fun128.mp3';
    let [audio, setAudio] = useState(new Audio(streamUrl));
    let [audioVolume, setAudioVolume] = useState(50);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [stationName, setStationName] = useState('Fun Rádio');

    async function playStream() {
        console.log(audioPlaying);
        if(audioPlaying === 'playing') {
            audio.pause();
            setAudio(new Audio(streamUrl));
            setAudioPlaying('stopped');
        } else {
            // Set loading state here
            try {
                audio.volume = audioVolume / 100;
                setAudioPlaying('loading');
                await audio.play();
                setAudioPlaying('playing');
            } catch (error) {
                console.log(error);
            }

            // while the state is loading, display loading animation in the button
        }
        console.log(audioPlaying);
    }

    function likeStation() {
        stationLiked ? setStationLiked(false) : setStationLiked(true);
        // like/unlike station
    }

    function handleVolumeChange(event: any) {
        let newVolume: number = event.target.value;
        setAudioVolume(newVolume);
        
        audio.volume = newVolume / 100;
    }

    return (
        <div className='grid grid-cols-3 gap-10 justify-items-center items-center fixed bottom-0 w-screen h-20 border-t border-gray-800 bg-gray-100'>
            <div className='flex flex-row items-center'>
                <div className='w-14 h-14 bg-gray-300 rounded-lg mr-6 flex items-center justify-center'>
                    {
                        thumbnailPresent === false &&
                        <IconContext.Provider value={{ className: 'text-gray-500 w-6 h-6' }}>
                            <BiRadio/>
                        </IconContext.Provider>
                    }
                    
                </div>
                <h1>{stationName}</h1>
            </div>
        
            <div className=''>
                {/* @ts-ignore */}
                {/*<audio ref={audioRef} src={streamUrl}></audio>*/}
                <button onClick={playStream} disabled={audioPlaying === 'loading'} className={`rounded-full border border-gray-800 bg-gray-700 hover:bg-gray-500 w-12 h-12 flex items-center justify-center ${audioPlaying === 'loading' ? 'cursor-progress' : ''}`}>
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
                    
                </button>
            </div>

            <div className='flex flex-row items-center'>
                <div className='mr-10'>
                    <label className='text-sm'>Volume</label>
                    <input type='range' min='0' max='100' step='1' value={audioVolume} onChange={handleVolumeChange} className='w-full accent-gray-800'/>
                </div>

                <button onClick={likeStation} className="rounded-full hover:bg-red-100 w-10 h-10 flex items-center justify-center">
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
                
            </div>
        </div>
    );
}
export default AudioPlayer;