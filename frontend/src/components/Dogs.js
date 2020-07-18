import React, { useState, useEffect } from 'react';

const dog_url = 'https://dog.ceo/api/breeds/image/random'

const calculateTime = (hour) => {
    let now = new Date()
    let timeTil12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0) - now;
    if (timeTil12 < 0) {
        timeTil12 += 86400000
    }
    //console.log(timeTil12)
    return timeTil12
}

const closestRefresh = () => {
    const morning = calculateTime(10)
    const evening = calculateTime(22)

    return (morning < evening) ? morning : evening
}
const Dog = () => {

    const [imgSource, setImgSource] = useState('')

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(dog_url)
            const json = await res.json()
            const img_uri = json.message
            //console.log(json.message)

            setImgSource(img_uri)

            const time = closestRefresh()
            setTimeout(fetchData, time)
        }
        fetchData();
    }, [])

    if (!imgSource) {
        return (
            <div>
                no image
            </div>
        )
    }
    else {
        return (
            <div className="float-right">
                <img
                    src={imgSource}
                    alt='dog'
                    width='300'
                    height='300'
                ></img>
            </div>
        )
    }

}

export default Dog