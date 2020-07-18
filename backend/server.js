const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
//const e = require('express')

//SPOTIFY SETUP
var client_id = '581e5b75c37e47d7a27eeaf6ffedd3c4'; // Your client id
var client_secret = '070fe4c6987e40999ee110c046253e67'; // Your secret
var redirect_uri = 'http://localhost:8888/callback';
const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
})


const access_token = 'BQCJWrT6UxR6S9TEAARjxXDD6lHX4XSOwTHHk7Okh8FoFfwUtWKjHtJY1ewrcqDzuFJxCmjQQ3n_usugPS1vhyPYwI4q5hwuTdofxBSl2NcDQYIVGMeUArbZnxQ2WuJVerGtlp-DOVJWG7GY2FANONdopkJlo_nfBtpV'
const refresh_token = 'AQDQxKfVLsis9sX_UCrGRntOTiUbGjT9L5a1AEUkxu1qDx8Wwy_1UN9MfS5Spbh26Enjh4Eo-xBrha8K6TRuPKmEgNm9_mNabnwtn1zFdcnvs94I07uamrm3exnx-E3OCrc'
let tokenExpirationEpoch = new Date().getTime() / 1000 + 3600
console.log(
    'Retrieved token. It expires in ' +
    Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
    ' seconds!'
);

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
        console.log(origin);
        next();
    }
})



app.use(express.static(__dirname + '/index.html'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const delay = ms => new Promise(res => setTimeout(res, ms))

const logs = () => {
    let time = new Date()
    console.log('spotify', time.toLocaleString(), 'sent')
    //const result = await spotifyApi.getMyCurrentPlaybackState({})
    time = new Date()
    console.log('spotify', time.toLocaleString(), 'recieved')
}

const config = {
    CURRENT_PULL: 3000,
    MIN_PULL: 3000
}

//SOCKET SETUP
io.on('connect', socket => {
    config.SOCKET = socket
    console.log('socket Connected')

    setNowPlaying()
})

io.on('disconnect', () => {
    console.log('disconnected ')
})

let calls = 0;
let time = new Date()
const setNowPlaying = () => {
    let time = new Date()
    console.log('spotify', time.toLocaleString(), 'sent')
    spotifyApi.getMyCurrentPlaybackState({}).then(result => {
        time = new Date()
        console.log('spotify', time.toLocaleString(), 'recieved')
        if (Object.keys(result.body).length > 0) {
            config.SOCKET.emit("getPlayBackState", sendablePayload(result.body))
            calls = 0

        }
        else {
            config.SOCKET.emit("getPlayBackState", { noSong: true })

        }
    }).catch(error => {
        console.error(error)
        if (error.message === 'Unauthorized') {
            console.log('unauthorized')
            refresh()
        }
        if (error.statusCode === 429) {
            //await delay(10000)
            console.log('waited 5 seconds')
        }
        if (error.message === 'connect ETIMEDOUT 35.186.224.25:443') {
            //await delay(5000)
            console.log('waited 5 seconds')
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
        console.log(
            'Refreshed token. It now expires in ' +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
            ' seconds!'
        );
    } catch (err) {
        console.log(err.message)
    }
    //setTimeout(refresh, tokenExpirationEpoch)
}


http.listen(5000, () => {
    console.log('listening on port 5000')
})

//module.exports = app