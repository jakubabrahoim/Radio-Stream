interface Station {
    stationName: string, 
    streamUrl: string, 
    stationThumbnail: string
}

export function saveLastStation(currentStation: Station): void {
    localStorage.setItem('lastStation', JSON.stringify(currentStation));
}

export function loadLastStation(): Station {
    let lastStation = localStorage.getItem('lastStation');
    
    if(lastStation !== null) {
        return JSON.parse(lastStation);
    }

    return { stationName: 'No station selected', streamUrl: '', stationThumbnail: '' };
}