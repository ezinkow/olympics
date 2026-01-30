import React from 'react'
import Navbar from '../components/Navbar'
import MyRoster from '../components/MyRoster'

export default function PicksContainer() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <MyRoster />
            </div>
        </div>
    )
}