import React from 'react'
import Navbar from '../components/Navbar'
import MyTeam from '../components/MyTeam'

export default function PicksContainer() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <MyTeam />
            </div>
        </div>
    )
}