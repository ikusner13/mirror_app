import styled from 'styled-components'

const SpotifyPlaying = styled.div`
  line-height: 1.05;
  max-width: 400px;
`
const SongImg = styled.img`
  width: 200px;
  height: 200px;
`
const SongInfo = styled.div`
  font-size: 0.85rem;
  max-width: 30ch;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:last-of-type {
    margin-bottom: 0;
  }
`
export { SpotifyPlaying, SongImg, SongInfo }
