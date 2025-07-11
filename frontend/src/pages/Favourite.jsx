import React from 'react'
import { dummyShowsData } from '../assets/assets.js'
import MovieCard from '../components/MovieCard'

const Favourite = () => {
  return dummyShowsData.length>0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <h1 className='text-lg font-medium my-4'>Your Favourite Movies</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.map((movie)=>{
          return <MovieCard movie={movie} key={movie._id}/>
        })}
      </div>
    </div>
  ):(
    <div>
      <h1 className='text-3xl font-bold text-center '>No movies available</h1>
    </div>
  )
}

export default Favourite
