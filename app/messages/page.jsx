// "use client"
import React from 'react'
import { Suspense } from 'react';
import Messages from './Messages'

const page = () => {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <Messages/>
    </Suspense>
  )
}

export default page
