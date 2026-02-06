import React from 'react'
import Navbar from '../components/Navbar'
import Scoreboard from '../components/Scoreboard'

export default function ScoreboardPage() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <Scoreboard />
            </div>
        </div>
    )
}