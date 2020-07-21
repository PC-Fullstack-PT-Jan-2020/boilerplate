import React, { useEffect } from 'react'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'

export default (props) => {
    const {id, playing, timeRemaining, timeElapsed, startTimeBox, stopTimeBox, beginCountDown, overtime, timeOver, mode} = props
    const manageStop = (id) => {
        stopTimeBox(id)
    }
    const manageStart = (id) => {
        startTimeBox(id)
    }
    function msToTime(duration) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
        
        hours = (hours < 10) ? "0" + hours : hours
        minutes = (minutes < 10) ? "0" + minutes : minutes
        seconds = (seconds < 10) ? "0" + seconds : seconds
    
    return hours + ":" + minutes + ":" + seconds
    }

    useEffect(() => {
        let timer = null
        if (playing && !timeOver) {
            timer = setInterval(
            () => {
                if (timeRemaining - 500 > 0) {
                    beginCountDown({id: id, delta: 500})
                } else {
                    beginCountDown({id: id, delta: 500})
                    clearTimeout(timer)
                    if (mode == 'hard') {
                        stopTimeBox(id)
                    }
                }
            },
            500
            )
            return () => clearTimeout(timer)
        } else {
            clearTimeout(timer)
        }
    }, [playing, timeRemaining, id, timeOver, mode])

    useEffect(() => {
        let timer = null
        if (playing && timeRemaining <= 0 && mode == 'soft') {
            timer = setInterval(
            () => overtime({id: id, delta: 500}),
            500
            )
            return () => clearTimeout(timer)
        } else {
            clearTimeout(timer)
        }
    }, [playing, timeRemaining, id, mode])
    return (
        <>
            {
            playing ?
            <>
            <PauseIcon type="primary" onClick={() => manageStop(id)} />
            {msToTime(timeOver && timeElapsed || timeRemaining)}
            </>
            :
            <>
            <PlayArrowIcon type="primary" onClick={() => manageStart(id)} />
            {msToTime(timeOver && timeElapsed || timeRemaining)}
            </>
            }
        </>
    )
}