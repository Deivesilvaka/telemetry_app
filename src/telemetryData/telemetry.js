
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Accelerometer, Gyroscope } from 'expo-sensors'

export default function Telemetry({socket}) {

    //As apis de acelerometro e giroscópio estão com os valores trocados!

    const [aX, setAX] = useState(0)
    const [aY, setAY] = useState(0)
    const [aZ, setAZ] = useState(0)

    const [oX, setOX] = useState(0)
    const [oY, setOY] = useState(0)
    const [oZ, setOZ] = useState(0)
    const updateTelemetry = 300

    const telemetryChunk = {
        rocketOrientation: {
            x: oX,
            y: oY,
            z: oZ
        },
        rocketVelocity: {
            x: aX,
            y: aY,
            z: aZ
        }
    }

    const [subscription, setSubscription] = useState(null)

    const _setVelocity = () => {
        Accelerometer.setUpdateInterval(updateTelemetry)
        Gyroscope.setUpdateInterval(updateTelemetry)
    }

    const sendTelemetry = () => {
        setInterval(() => {
            socket.emit("teleData", telemetryChunk)
        }, updateTelemetry);
    }

    const _subscribe = () => {
        setSubscription(
          Accelerometer.addListener(accelerometerData => {
            const { x, y, z } = accelerometerData
            setOX(x)
            setOY(y)
            setOZ(z)

            telemetryChunk.rocketOrientation = {
                x: x.toFixed(3),
                y: y.toFixed(3),
                z: z.toFixed(3)
            }
          })
        )
        setSubscription(
            Gyroscope.addListener(gyroscopeData => {
                const { x, y, z } = gyroscopeData
                setAX(x)
                setAY(y)
                setAZ(z)

                telemetryChunk.rocketVelocity = {
                    x: x.toFixed(3),
                    y: y.toFixed(3),
                    z: z.toFixed(3)
                }
            })
        )
        setSubscription(sendTelemetry())
    }

    const _unsubscribe = () => {
        subscription && subscription.remove()
        setSubscription(null)
    }

    useEffect(() => {
        _setVelocity()
        _subscribe()
        return () => _unsubscribe()
    }, [])

    return (
        <View style={styles.telemetry}>
            <View style={styles.accelerometer}>
                <Text style={styles.simpleText}>Accelerometer</Text>
                <Text style={styles.simpleText}>X: {aX.toFixed(3)} Y: {aY.toFixed(3)} Z: {aZ.toFixed(3)}</Text>
            </View>
            <View style={styles.orientation}>
                <Text style={styles.simpleText}>Orientation</Text>
                <Text style={styles.simpleText}>X: {oX.toFixed(3)} Y: {oY.toFixed(3)} Z: {oZ.toFixed(3)}</Text>
            </View>
        </View>
    )

}

const styles = new StyleSheet.create({
    telemetry: {
        top: 30
    },
    accelerometer: {
        paddingBottom: 7
    },
    simpleText: {
        fontSize: 16
    }
})