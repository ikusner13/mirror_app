import styled from 'styled-components'

const Grid = styled.div`
  display: grid;
  height: 100vh;
  color: #aaa;
  grid-template-columns: repeat(5, 1fr);
  align-content: space-between;
  grid-template-areas:
    'TL . . TR TR'
    '. . . . .'
    'M M M M M'
    'BL . . . BR';
  padding: 1rem;
  justify-items: center;
  justify-content: space-between;
`

const TopLeft = styled.div`
  grid-area: TL;
  justify-self: start;
`
const TopRight = styled.div`
  grid-area: TR;
  justify-self: end;
`
const Middle = styled.div`
  grid-area: M;
`
const BottomLeft = styled.div`
  grid-area: BL;
  align-self: end;
`
const BottomRight = styled.div`
  grid-area: BR;
  align-self: end;
`
export { Grid, TopLeft, TopRight, Middle, BottomLeft, BottomRight }
