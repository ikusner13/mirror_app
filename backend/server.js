const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const { PORT } = require('../config')
const path = require('path')
const ical = require('ical')
const request = require('request')
const moment = require('moment')


const { spotify } = require('../config')
const { duration, min } = require('moment')

//SPOTIFY SETUP
var client_id = spotify.client_id // Your client id
var client_secret = spotify.client_secret; // Your secret
var redirect_uri = spotify.redirect_uri;
const access_token = spotify.access_token
const refresh_token = spotify.refresh_token

const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
})

let tokenExpirationEpoch = new Date().getTime() / 1000 + 3600

spotifyApi.setAccessToken(access_token)
spotifyApi.setRefreshToken(refresh_token)

//app.use(cors())
app.use(function (req, res, next) {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        //console.log('origin', origin);
        next();
    }
})

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('build'))

const config = {
    CURRENT_PULL: 3000,
    MIN_PULL: 3000,
    CALENDAR_PULL: 100000000//300000
}


//SOCKET SETUP
let connections = 0
io.on('connect', socket => {
    //console.log(io.sockets.eventNames())
    connections++
    config.SOCKET = socket
    console.log('socket Connected')
    if (connections <= 1) { //stops multiple socket connections from calling fetch loop
        //setNowPlaying()
        getICS()
    }
})


const setNowPlaying = async () => {

    spotifyApi.getMyCurrentPlaybackState({}).then(result => {
        config.CURRENT_PULL = config.MIN_PULL
        //if body return something (is playing)
        if (Object.keys(result.body).length > 0) {
            config.SOCKET.emit("getPlayBackState", sendablePayload(result.body))
            calls = 0

        }
        // isn't playing or has been paused for too long
        else {
            config.SOCKET.emit("getPlayBackState", { noSong: true })

        }
    }).catch(error => {
        console.error(error)
        if (error.message === 'Unauthorized') {
            refresh()
        }
        else {
            config.CURRENT_PULL = (config.CURRENT_PULL < 5000) ? config.CURRENT_PULL + 1000 : 5000
        }
    })

    setTimeout(setNowPlaying, config.CURRENT_PULL)
}

const getImgUrl = (images) => {
    let filtered = images.filter((image) => {
        return image.width >= 240 && image.width <= 350
    })
    return filtered[0].url
}

const getArtists = (artists) => {
    return artists.map((artist) => {
        return artist.name
    }).join(', ')
}

const sendablePayload = (songInfo) => {
    const payload = {
        imgURL: getImgUrl(songInfo.item.album.images),
        songTitle: songInfo.item.name,
        artist: getArtists(songInfo.item.artists),
        album: songInfo.item.album.name,
    }
    return payload
}

const refresh = async () => {
    try {
        const newToken = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(newToken.body['access_token'])
        tokenExpirationEpoch =
            new Date().getTime() / 1000 + newToken.body['expires_in'];
        /*console.log(
            'Refreshed token. It now expires in ' +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
            ' seconds!'
        );*/
    } catch (err) {
        console.log(err.message)
    }

}

//calendar
const ical_uri = 'https://calendar.google.com/calendar/ical/splgvglb55q2kpbnjbsrab75f4%40group.calendar.google.com/private-928abe1b658ce5021f7b473cef3a6faf/basic.ics'
const getICS = async () => {
    let events = []
    request(ical_uri, (err, r, Rdata) => {
        const data = ical.parseICS(Rdata)

        //console.log(data)

        const dataArr = Object.values(data)
        //console.log(dataArr)
        events = dataArr.reduce(getUpcoming, []).map(({ start, end, summary }) => {
            //console.log('start', start)
            //console.log('local', start.toLocaleString())
            //console.log(moment(start).local())

            let startLocal = start.toLocaleString().split(" ")
            let endLocal = end.toLocaleString().split(" ")

            startLocal[0] = startLocal[0].slice(0, -1)
            endLocal[0] = endLocal[0].slice(0, -1)

            return { startLocal, endLocal, summary }
        })

        console.log('events', events)
        config.SOCKET.emit("getEvents", events)

        setTimeout(getICS, config.CALENDAR_PULL)
    })
}

const getUpcoming = (filter, obj) => {
    //console.log(obj)
    let newObj = []
    if (obj.type === 'VEVENT') {
        if (obj.rrule) {
            //console.log('object', obj)
            const rule = obj.rrule
            const past = moment().startOf('day').toDate()
            const future = moment().add(14, 'd').toDate()
            //console.log('past', past)
            //console.log('future', future)
            rule.options.dtstart = past
            let dates = rule.between(past, future, true)

            if (typeof dates[0] !== 'undefined' &&
                new Date(dates[0]).getUTCHours() < 4) {
                dates.forEach((date) => {
                    date = date.setUTCDate(date.getUTCDate() + 1)
                })
            }

            newObj = dates.map((e) => {
                let start = moment(e).local().format('HH:mm')
                let end = moment(obj.end).local().format('HH:mm')

                const diff = timeDiff(start, end)
                console.log(diff)
                //console.log(moment(e).local().format('HH:mm'))
                let endDate =
                    obj.start.dateOnly
                        ? moment.utc(e).add(1, 'd').format('YYYY-MM-DD')
                        : moment.utc(e)
                            .add(diff[0], 'hour')
                            .add(diff[1], 'minute')
                            .add(diff[2], 'second')
                            .format('YYYY-MM-DD')
                //console.log('endDate', endDate)
                //console.log('start', e)
                const endTime = moment.utc(obj.end).format('HH:mm:ss')
                const UTCstring = `${endDate}T${endTime}.000Z`
                let endDateUTC = new Date(UTCstring)
                const newEvent = {
                    start: e,
                    end: endDateUTC,
                    summary: obj.summary,
                }

                return newEvent
            })
        }
        else {
            newObj.push({ start: obj.start, end: obj.end, summary: obj.summary })
        }

        newObj.forEach(element => {
            //console.log(element)
            const parsed = new Date(Date.parse(element.end))
            if (parsed - Date.now() > 0) {
                //console.log(element)
                filter.push(element)
            }
        });
    }
    return filter.sort((a, b) => {
        return new Date(a.start) - new Date(b.start)
    })
}

const timeDiff = (start, end) => {
    start = start.split(':')
    end = end.split(':')

    let hour = end[0] - start[0] < 0
        ? (end[0] - start[0]) + 24
        : end[0] - start[0]

    let minute
    if (end[1] - start[1] < 0) {
        minute = end[1] - start[1] + 60
        hour = hour - 1
    }
    else {
        minute = end[1] - start[1]
    }
    const result = [
        hour,
        minute,
    ]
    return result
}

//getICS()



http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
