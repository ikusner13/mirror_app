import React from 'react'

const SpotifyPlaying = ({ songInfo }) => {
    return (
        <div >
            <div className="songInfo">
                <img
                    src={songInfo.imgURL}
                    alt="album"
                    width="200"
                    height="200"
                >
                </img>
            </div>
            <div className="songInfo below-album-img">
                <i className="fa fa-music" />
                {songInfo.songTitle}
            </div>
            <div className="songInfo">
                <i className="fa fa-user" />
                {songInfo.artist}
            </div>
            <div className="songInfo">
                <i className="fa fa-folder" />
                {songInfo.album}
            </div>

        </div>
    )
}

export default SpotifyPlaying