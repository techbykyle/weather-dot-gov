import React from 'react'

import Split from './Split'

const Forecast = ({forecast, forecastedRelHumiditity, precipPossibilities, top}) => {

    const forecast_card = {
        display: 'block',
        width: 265,
        height: 215,
        padding: 0,
        margin: '0 10px',
        backgroundColor: '#424242',
        borderRadius: 3,
        verticalAlign: 'bottom',
        lineHeight: 'normal',
    }

    return (
        <div style={forecast_card}>
            {top}
            <Split forecastedRelHumiditity={forecastedRelHumiditity} precipPossibilities={precipPossibilities} {...forecast} />
        </div>
    )
}

export default Forecast