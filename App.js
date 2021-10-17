import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import SocketServer from './src/socketServer/socket'
import Telemetry from './src/telemetryData/telemetry'
import { Restart } from 'fiction-expo-restart'

export default function App() {
  
  const [log, setLog] = useState("Awaiting an connection...")
  const [socket, setSocket] = useState({})
  const [socketLink, setSocketLink] = useState("")

  const connectToSocketServer = async() => {
    if(!socket.id){
      const Socket = await SocketServer(socketLink)
      Socket.emit("rocketConnected", Socket.id)
      return Socket
    }

    else {
      await setLog(`You are already connected!`)
      return ""
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.log}>log: {log}</Text>
      <View>
        <Text>telemetry systema link: </Text>
        <TextInput
          keyboardType="url"
          onChangeText={async (value) => {
            await setSocketLink(value)
          }}
          style={styles.link}
        />
        <TouchableOpacity style={styles.btn} onPress={async() => {
          const Socket = await connectToSocketServer()
          setTimeout(async() => {
            if(Socket.id){
              await setSocket(Socket) 
              await setLog(`Connected as socket: ${Socket.id}`)
            }
          }, 1000)
        }}>
          <Text style={styles.btnText}>Conectar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnStop} onPress={() => {
          Restart()
        }}>
          <Text style={styles.btnText}>Parar telemetria</Text>
        </TouchableOpacity>

        { socket.id ? <Telemetry style={styles.telemetry} socket={socket} /> : <Text></Text> }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  link: {
    borderWidth: 1,
    height: 40,
    width: 250
  },

  log: {
    bottom: 15,
  },

  btn: {
    borderWidth: 1,
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "green",
    borderRadius: 5,
    marginTop: 5
  },

  btnStop: {
    borderWidth: 1,
    width: 140,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "red",
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-end',
    position: "absolute",
    marginTop: 65
  },

  btnText: {
    color: "white",
    marginBottom: 2
  }

});
