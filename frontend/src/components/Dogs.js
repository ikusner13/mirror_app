import React, { useState, useEffect } from 'react'
import helper from '../services/helper'

const dog_url = 'https://dog.ceo/api/breeds/image/random'

const Dog = () => {
  const [imgSource, setImgSource] = useState('')

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(dog_url)
      const json = await res.json()
      const img_uri = json.message

      setImgSource(img_uri)

      const time = helper.closestRefresh(10, 22)
      setTimeout(fetchData, time)
    }
    fetchData()
  }, [])

  if (!imgSource) {
    return <div>no image</div>
  } else {
    return (
      <div className="float-right">
        <img src={imgSource} alt="dog" width="300" height="300"></img>
      </div>
    )
  }
}

export default Dog
