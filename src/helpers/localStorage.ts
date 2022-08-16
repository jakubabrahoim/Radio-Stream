interface Station {
    stationName: string, 
    streamUrl: string, 
    stationThumbnail: string,
    autoPlay: boolean
}

/** 
 * Save the last played station to local storage and set autoPlay to false. 
 * Set it to false so the audio player doesn't try to play it on page load.
*/
export function saveLastStation(currentStation: Station): void {
    currentStation.autoPlay = false;
    localStorage.setItem('lastStation', JSON.stringify(currentStation));
}

/**
 * @returns the last played station from local storage
*/
export function loadLastStation(): Station {
    let lastStation = localStorage.getItem('lastStation');
    
    if(lastStation !== null) {
        return JSON.parse(lastStation);
    }

    return { stationName: 'No station selected', streamUrl: '', stationThumbnail: '', autoPlay: true };
}