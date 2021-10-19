import React from 'react'

const AlertInfo = ({alerts, close, color, title}) => {

    const showAllAlertsInfo = () => {

        const infos = []

        alerts.forEach(alert => {
            infos.push(
                <div key={alert.properties.id}>
                    <p style={{fontWeight: 900}}>{alert.properties.headline}</p>
                    <p>{alert.properties.description}</p>
                    <p>{alert.properties.instruction}</p><br />
                </div>
            )
        })

        return infos
    }

    return (
        <div style={{position: 'fixed'}} className="modal">
            <div className="wrapper">
                <div className="dialog">

                    <div className="title">
                        <h3 style={{color}}>{title} &nbsp; &nbsp; <span className="material-icons float_r f22 pointer" title="Close" onClick={() => close(false)}>cancel</span></h3>
                    </div>

                    <div className="body txt_left">
                        {showAllAlertsInfo()}
                        <div className="txt_center pointer" onClick={() => close(false)}><button type="button" className="btn btn-primary">Close</button></div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AlertInfo