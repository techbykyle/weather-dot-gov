import React from 'react'
import Alert from './Alert'

const Alerts = ({alerts, totals}) => {

    if(totals.all === 0) {
        return null
    }

    const style = {
        cursor: 'pointer',
        margin: '0 auto',
        width: 135,
        height: 22,
        display: 'block',
        position: 'absolute',
        top: '-25px',
        right: 0,
    }

    const showHighAlerts = () => {
        if(totals.high > 0) {
            return <Alert alerts={alerts.high} title="Extreme/Severe Weather Alerts" color="#f59598" total={totals.high} />
        }
    }

    const showMediumAlerts = () => {
        if(totals.medium > 0) {
            return <Alert alerts={alerts.medium} title="Moderate Weather Alerts" color="#febd7d" total={totals.medium} />
        }
    }

    const showLowAlerts = () => {
        if(totals.low > 0) {
            return <Alert alerts={alerts.low} title="Minor Weather Alerts" color="#faeaaa" total={totals.low} />
        }
    }

    return (
        <div className="txt_center" style={style}>
            {showLowAlerts()}
            {showMediumAlerts()}
            {showHighAlerts()}
        </div>
    )
}

export default Alerts