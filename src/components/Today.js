import React from 'react'
import GetSvg from './Svg'
import Alerts from './Alerts'

const Today = ({active_alerts, day, forecast, high_temp, humidity, low_temp, precipPossibilities, temperature, timestamp, wind_dir, wind_speed}) => {

    const today_card = {
        width: 255,
        height: 235,
        padding: 10,
        margin: 0,
        backgroundColor: '#424242',
        borderRadius: 3,
        lineHeight: 1,
        position: 'relative',
    }
    const alert_totals = { high: 0, medium: 0, low: 0 }
    const alerts = { high: [], medium: [], low: [] }
    let main_icon_dim = { width: 95, height: 95 }
    const forecast_len = forecast.shortForecast.length
    const showPrecipPossibility = () => {

        let precip_possibility = false

        if(precipPossibilities.length > 0) {
            precipPossibilities.forEach((p) => {

                if(precip_possibility) {
                    return
                }

                p.validTime = p.validTime.split('/')
                p.validTime = p.validTime[0]

                const dcompare_f_start = new Date(timestamp).getTime()
                const dcompare_f_end = new Date()
                dcompare_f_end.setUTCHours(23,59,59,999)
                const dcompare_p = new Date(p.validTime).getTime()

                if(dcompare_p > dcompare_f_start && dcompare_p < dcompare_f_end.getTime()) {
                    precip_possibility = p.value
                }
            })
        }

        if(precip_possibility) {
            return (
                <span title={`${precip_possibility}% chance of precipitation`} style={{padding: '0 10px'}}>
                    {GetSvg(18, 18, "LightRain")}{precip_possibility}%
                </span>
            )
        }
    }

    const showWindSpeed = () => {
        if(wind_speed > 0) {
            return <span title="Current Wind Direction/Speed" style={{padding: '0 10px'}}>{GetSvg(16, 16, "WindPointer")}{wind_dir}{wind_speed}</span>
        }
    }

    if(forecast_len >= 15 && forecast_len < 30) {
        main_icon_dim = {width: 85, height: 85}
    }

    if(forecast_len >= 30 && forecast_len < 45) {
        main_icon_dim = {width: 70, height: 70}
    }

    if(forecast_len >= 45) {
        main_icon_dim = {width: 55, height: 55}
    }

    if(active_alerts.length > 0) {

        alert_totals.all = active_alerts.length

        active_alerts.forEach(alert => {
            if(alert.properties.severity === 'Extreme' || alert.properties.severity === 'Severe') {
                alert_totals.high++
                alerts.high.push(alert)
            }
            if(alert.properties.severity === 'Moderate') {
                alert_totals.medium++
                alerts.medium.push(alert)
            }
            if(alert.properties.severity === 'Minor' || alert.properties.severity === 'Unknown') {
                alert_totals.low++
                alerts.low.push(alert)
            }
        })
    }

    return (
        <div className="txt_left" style={today_card}>

            <Alerts alerts={alerts} totals={alert_totals} />

            <div style={{lineHeight: '.77', height: 40, fontWeight: 850, width: '50%', padding: 0, margin: 0, fontSize: 54}} className="float_l">
                {temperature}<span style={{fontSize: 52, fontWeight: 500}}>&deg;</span>
            </div>
            
            <div style={{verticalAlign: 'top', height: 40, width: '50%', padding: 0, margin: 0}} className="txt_right float_l">
                <div style={{width: '%98', margin: '0 auto', fontSize: 21}}>{day}</div>
                <div>
                    <span style={{fontSize: 18}}>{high_temp}&deg; / {low_temp}&deg;</span>
                </div>
            </div>

            <div className="clear txt_center" style={{padding: '5px 10px 10px 10px'}}>
                {GetSvg(main_icon_dim.width, main_icon_dim.height, forecast.shortForecast.replace(/\s/g, ''))}
            </div>

            <div className="clear txt_center" style={{fontSize: 20}}>{forecast.shortForecast}</div>

            <div className="txt_center" style={{width: '98%', padding: 0, margin: '10px auto 0 auto'}} >
                <span title="Current Relative Humidity" style={{padding: '0 10px'}}>{GetSvg(16, 16, "HumidityDrop")}{Math.round(humidity * 10) / 10}%</span>
                {showWindSpeed()}
                {showPrecipPossibility()}
            </div>

        </div>
    )
}

export default Today