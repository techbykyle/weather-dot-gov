import React from 'react'
import GetSvg from './Svg'

const Split = ({endTime, forecastedRelHumiditity, isDaytime, precipPossibilities, shortForecast, startTime, temperature, windDirection, windSpeed}) => {

    const style = {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        margin: 0,
        width: '100%',
        height: '50%',
        verticalAlign: 'middle',
        borderBottom: isDaytime ? '1px solid #2b2b2b': 'none'
    }
    
    const icon_side = isDaytime ? {marginLeft: 'auto'}: {marginRight: 'auto'} 

    const showWindMetrics = () => {
        if(shortForecast.length > 17) {
            return null
        }
        return <><br />{windDirection} {windSpeed}</>
    }

    const showPrecipPossibility = () => {

        let precip_possibility = false

        if(precipPossibilities.length > 0) {
            precipPossibilities.forEach((p) => {

                if(precip_possibility) {
                    return
                }

                p.validTime = p.validTime.split('/')
                p.validTime = p.validTime[0]

                const dcompare_f_start = new Date(startTime).getTime()
                const dcompare_f_end = new Date(endTime).getTime()
                const dcompare_p = new Date(p.validTime).getTime()

                if(dcompare_p > dcompare_f_start && dcompare_p < dcompare_f_end) {
                    precip_possibility = p.value
                }
            })
        }

        if(precip_possibility) {
            return (
                <span title={`${precip_possibility}% chance of precipitation`} style={{paddingLeft: 10}}>
                    {GetSvg(18, 18, "LightRain")}{precip_possibility}%
                </span>
            )
        }
    }

    const showHumidity = () => {

        let relative_humiditity = false

        if(forecastedRelHumiditity.length > 0) {
            forecastedRelHumiditity.forEach((p) => {

                p.validTime = p.validTime.split('/')
                p.validTime = p.validTime[0]

                const dcompare_f_start = new Date(startTime).getTime()
                const dcompare_f_end = new Date(endTime).getTime()
                const dcompare_p = new Date(p.validTime).getTime()

                if(dcompare_p > dcompare_f_start && dcompare_p < dcompare_f_end) {
                    relative_humiditity = p.value
                }
            })
        }

        if(relative_humiditity) {
            return (
                <span title={`${relative_humiditity}% Relative Humiditity`} style={{paddingLeft: 10}}>
                    {GetSvg(15, 15, "HumidityDrop")}{relative_humiditity}%
                </span>
            )
        }
    }

    return (
        <div className="txt_left" style={style}>

            <p style={{width: '73%', padding: '0 5px 0 10px'}}>
                <span style={{fontWeight: 900, fontSize: 22}}>{temperature}&deg;</span>
                {showHumidity()}
                {showPrecipPossibility()}
                <br />
                {shortForecast}
                {showWindMetrics()}
            </p>

            <p style={{width: '27%', padding: '0 10px 0 0', ...icon_side}}>{GetSvg(50, 50, shortForecast.replace(/\s/g, ''))}</p>

        </div>
    )
}

export default Split