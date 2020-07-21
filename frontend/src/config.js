const updateTimes = {
    weather: 15, //minutes
    dogFirst: 10, //hour
    dogSecond: 20, //hour
}

const calculateTimeTil = (hour) => {
    let now = new Date()
    let timeTil = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0) - now;
    if (timeTil < 0) {
        timeTil += 86400000
    }

    return timeTil
}

const closestRefresh = (...times) => {
    const timesTil = times.map(hour => {
        return calculateTimeTil(hour)
    })

    return (Math.min(...timesTil))
}



export default { updateTimes, calculateTimeTil, closestRefresh }
