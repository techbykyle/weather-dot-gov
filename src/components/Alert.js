import React, { useState } from 'react'
import AlertInfo from './AlertInfo'

const Alert = ({alerts, color, title, total}) => {

    const style = {
        display: 'inline-block',
        backgroundColor: color, 
        width: 22,
        height: 22,
        fontSize: 18,
        fontWeight: 900,
        margin: '0 5px',
        verticalAlign: 'middle',
        color: '#2b2b2b',
        border: '6px solid #2b2b2b',
        boxSizing: 'content-box'
    }

    const [show_info, setShowInfo] = useState(false)

    const showAlertInfo = () => {
        if(show_info) {
            console.log('about to show info')
            return <AlertInfo alerts={alerts} close={setShowInfo} color={color} title={title} />
        }
    }

    return (
        <>
            {showAlertInfo()}
            <div onClick={() => setShowInfo(true)} title={title} className="circ" style={style}>{total}</div>
        </>
    )
}

export default Alert