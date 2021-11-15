import styled from 'styled-components'

const SpotifyPlaying = styled.div`
  font-size: 65%;
  line-height: 1.05;
  max-width: 400px;
`
const SongImg = styled.img`
  width: 240px;
  height: 240px;
`
const SongInfo = styled.div`
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:last-of-type {
    margin-bottom: 0;
  }
`
export { SpotifyPlaying, SongImg, SongInfo }
