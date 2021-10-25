import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import Today from './Today'
import Forecast from './Forecast'
import Split from './Split'

const degToCompass = (deg) => {
    const val = Math.floor((deg / 22.5) + 0.5)
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    return arr[(val % 16)]
}

const ForecastHorizontal = ({device, http, httpAction, tile, useHttp, useInterval}) => {

    const device_state = useSelector(state => state.DeviceController.data[tile.id], shallowEqual) || {}
    const user = useSelector(state => state.User)
    const [temperature_cache, setTemperatureCache] = useState({})
    const active_alerts = device_state[http['get_active_alerts']]?.features || []
    const forecasts = device_state[http['get_forecast']]?.properties?.periods || []
    const current_conditions = device_state[http['get_latest_observation']]?.properties || {}
    const day = new Date(current_conditions.timestamp).toLocaleDateString('en-US', { weekday: 'long' })
    const gridpoint_data = device_state[http['get_gridpoint']]?.properties || {}
    const humidity = Math.round(current_conditions?.relativeHumidity?.value) || 0
    const wind_dir = degToCompass(current_conditions?.windDirection?.value || 0)
    const wind_gust_speed = Math.round(current_conditions?.windGust?.value / 1.609344) || 0
    const high_temp = Math.round((gridpoint_data?.maxTemperature?.values[0].value * 9/5 + 32) * 10) / 10 || 0
    const low_temp = Math.round((gridpoint_data?.minTemperature?.values[0].value * 9/5 + 32) * 10) / 10 || 0
    const precipPossibilities = gridpoint_data.probabilityOfPrecipitation?.values || []
    const forecastedRelHumiditity = gridpoint_data.relativeHumidity?.values || []
    const observations = device_state[http['get_observations']] || {}
    const current_ts = new Date().getTime()
    const end_stamp = new Date().toISOString()
    const start_stamp = new Date(current_ts - (60 * 60 * 1000)).toISOString()
    const dispatch = useDispatch()

    let temperature = Math.round((current_conditions?.temperature?.value * 9/5 + 32) * 10) / 10 || 0
    let wind_speed = Math.round(current_conditions?.windSpeed?.value / 1.609344) || 0
    let top = null
    
    if(current_conditions?.temperature?.value === null && temperature_cache?.temperature?.value) {
        current_conditions.temperature.value = temperature_cache.temperature.value
        temperature = Math.round((current_conditions.temperature.value * 9/5 + 32) * 10) / 10
    }

    if(current_conditions?.temperature?.value === null) {
        if(observations?.features?.length > 0) {

            observations.features.sort((a, b) => {
                if(a.properties.timestamp > b.properties.timestamp) {
                    return 1
                }
                return -1
            })

            observations.features.forEach(feature => {
                if(current_conditions?.temperature?.value !== null) {
                    return
                }
                if(feature.properties.temperature !== null) {
                    current_conditions.timestamp = feature.properties.timestamp
                    current_conditions.temperature.value = feature.properties.temperature.value
                    temperature = Math.round((current_conditions.temperature.value * 9/5 + 32) * 10) / 10
                }
            })
        }
    }

    if(wind_speed == 0 && wind_gust_speed > 0) {
        wind_speed = wind_gust_speed
    }

    useHttp(device.id, tile.id, http['get_observations'], {start: start_stamp, end: end_stamp, limit: 4})
    useHttp(device.id, tile.id, http['get_active_alerts'])
    useHttp(device.id, tile.id, http['get_latest_observation'])
    useHttp(device.id, tile.id, http['get_forecast'])
    useHttp(device.id, tile.id, http['get_gridpoint'])
   
    useEffect(() => {
        if(current_conditions?.temperature !== null) {
            setTemperatureCache(current_conditions)
        }
    }, [current_conditions?.temperature?.value])

    useInterval(() => {
        httpAction(dispatch, user.token, device.id, tile.id, http['get_active_alerts'])
    }, 2 * 60000)

    useInterval(() => {
        httpAction(dispatch, user.token, device.id, tile.id, http['get_latest_observation'])
    }, 10 * 60000)

    useInterval(() => {
        httpAction(dispatch, user.token, device.id, tile.id, http['get_forecast'])
    }, 60 * 60000)

    //console.log('active_alerts', active_alerts)
    //console.log('latest_observation', current_conditions)
    //console.log('forecasts', forecasts)
    //console.log('gridpoint_data', gridpoint_data)
    //console.log('observations', observations)

    if(forecasts.length <= 0) {
        return <div className="txt_center"><br />
            <div className="button_loader button_loader_l"></div>
            <p>Loading Weather Data...</p>
        </div>
    }
    
    return (
        <div style={{height: 245, overflow: "hidden", verticalAlign: 'text-top', padding: 10, margin: 0}}>

            <div className="float_l" style={{padding: 10}}>
                <Today 
                    active_alerts={active_alerts}
                    precipPossibilities={precipPossibilities}
                    day={day}
                    wind_dir={wind_dir}
                    wind_speed={wind_speed}
                    high_temp={high_temp} 
                    low_temp={low_temp} 
                    forecast={forecasts[0]} 
                    timestamp={current_conditions.timestamp}
                    temperature={temperature}
                    humidity={humidity} />
            </div>

            {forecasts.map((forecast, i) => {

                const forecast_day = new Date(forecast.startTime).toLocaleDateString('en-US', { weekday: 'long' })
                
                if(forecast_day === day) {
                    return
                }

                const dcompare = new Date(forecast.startTime).getTime()
                const dcompare_now = new Date().getTime()

                if(dcompare_now > dcompare) {
                    return
                }

                if(forecast.isDaytime) {
                    top = <Split forecastedRelHumiditity={forecastedRelHumiditity} precipPossibilities={precipPossibilities} {...forecast} />
                    return
                }
                
                return (
                    <div key={`forecast-${i}`} className="float_l" >
                        <div style={{verticalAlign: 'bottom', fontSize: 18, padding: 0, margin: 0}} className="txt_center">{forecast_day}</div>
                        <Forecast forecastedRelHumiditity={forecastedRelHumiditity} top={top} forecast={forecast} precipPossibilities={precipPossibilities} />
                    </div>
                )
            })}
            
        </div>
    )
}

export default ForecastHorizontal