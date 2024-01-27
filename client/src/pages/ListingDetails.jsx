import React from 'react'
import { useParams } from 'react-router-dom'
const ListingDetails = () => {
    const {id} = useParams()
    console.log(params)
  return (
    <div>
      Listing Details - {id}
    </div>
  )
}

export default ListingDetails
