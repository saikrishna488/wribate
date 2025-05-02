import React from 'react'
import Sidebar from '../components/WhyWribate/Sidebar'
import Mainsection from '../components/WhyWribate/Mainsection'

const page = () => {
  return (
    <div className='flex flex-row h-[90vh] overflow-y-hidden'>
      <Sidebar/>
      <Mainsection/>
    </div>
  )
}

export default page
