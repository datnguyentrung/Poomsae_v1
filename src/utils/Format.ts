export const formatDateDMY = (dateString: Date) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const formatDateDM = (dateString: Date) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}-${month}`;
};

export const formatTimeHM = (dateString: Date) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export const formatDateYMD = (dateString: Date) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const formatDurationHM = (duration: string | number | null | undefined): string => {
    if (!duration) return '--:--';

    let totalSeconds = 0;

    // If it's a string (ISO 8601 Duration like PT5M, PT1H30M, PT45S)
    if (typeof duration === 'string') {
        // Parse ISO 8601 Duration format: PT[nH][nM][nS]
        const regex = /^PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/;
        const matches = duration.match(regex);

        if (!matches) {
            console.warn('Invalid duration format:', duration);
            return '--:--';
        }

        const hours = parseFloat(matches[1] || '0');
        const minutes = parseFloat(matches[2] || '0');
        const seconds = parseFloat(matches[3] || '0');

        totalSeconds = Math.floor(hours * 3600 + minutes * 60 + seconds);
    }
    // If it's a number (assume nanoseconds for backward compatibility)
    else if (typeof duration === 'number') {
        if (duration <= 0) return '--:--';
        // Convert nanoseconds to seconds if the number is very large
        if (duration > 1000000000) {
            totalSeconds = Math.floor(duration / 1000000000);
        } else {
            // Assume it's already in seconds or milliseconds
            totalSeconds = Math.floor(duration > 1000 ? duration / 1000 : duration);
        }
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    // If duration is less than 1 hour, show MM:SS format
    if (hours === 0) {
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // If duration is 1 hour or more, show HH:MM:SS format
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
