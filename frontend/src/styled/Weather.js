import styled from 'styled-components'

const Weather = styled.div`
  width: 100%;
  font-size: 70%;
  line-height: 1.05;
  text-align: right;
`
const HighLow = styled.div`
  margin-bottom: 5px;
`
const Condition = styled.div`
  display: flex;
  font-size: 2rem;
  justify-content: flex-end;
`
const Temp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  margin-right: 3px;
`
const Description = styled.div``
const Feel = styled.div``
export { Weather, HighLow, Condition, Temp, Description, Feel }
