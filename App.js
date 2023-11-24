import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
  FlatList,
} from 'react-native';
import Ping from 'react-native-ping';
import PipHandler, {usePipModeListener} from 'react-native-pip-android';

const App = () => {
  const [ip, setIp] = useState('');
  const [results, setResults] = useState([]);
  const [isPinging, setIsPinging] = useState(false);
  const intervalRef = useRef();

  const getStatus = async () => {
    const {
      receivedNetworkSpeed,
      sendNetworkSpeed,
      receivedNetworkTotal,
      sendNetworkTotal,
    } = await Ping.getTrafficStats();

    return {
      receivedNetworkSpeed,
      sendNetworkSpeed,
      receivedNetworkTotal,
      sendNetworkTotal,
    };
  };

  const handlePing = async () => {
    try {
      const ms = await Ping.start(ip, {timeout: 1000});
      setResults(prevResults =>
        [
          {ms, message: `Reply from ${ip}: time ${ms} ms.`},
          ...prevResults,
        ].slice(0, 10),
      );
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case '0':
          errorMessage = 'Timeout';
          break;
        case '1':
          errorMessage = 'Previous Ping Is Still Running';
          break;
        case '2':
          errorMessage = 'HostError Not Set';
          break;
        case '3':
          errorMessage = 'HostError Unknown';
          break;
        case '4':
          errorMessage = 'HostError HostNotFound';
          break;
        default:
          errorMessage = 'Unknown';
      }
      setResults(prevResults =>
        [{ms: Infinity, message: `${errorMessage}`}, ...prevResults].slice(
          0,
          10,
        ),
      );
    }
  };

  const startPing = () => {
    setIsPinging(true);
    intervalRef.current = setInterval(handlePing, 1000); // Ping every second
  };

  const stopPing = () => {
    setIsPinging(false);
    clearInterval(intervalRef.current);
  };

  // Use this boolean to show / hide ui when pip mode changes
  const inPipMode = usePipModeListener();

  if (inPipMode) {
    return (
      <View>
        <FlatList
          data={results}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => {
            let color;
            if (item.ms < 100) {
              color = 'green';
            } else if (item.ms < 150) {
              color = 'yellow';
            } else {
              color = 'red';
            }
            return (
              <Text>
                Reply from {ip}: time <Text style={{color}}>{item.ms}</Text> ms.
              </Text>
            );
          }}
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Text>App</Text>
      <TouchableOpacity onPress={() => PipHandler.enterPipMode()}>
        <Text>Click to Enter Pip Mode</Text>
      </TouchableOpacity>

      <View>
        <TextInput
          value={ip}
          onChangeText={val => setIp(val)}
          placeholder="Enter IP Address"
        />
        {!isPinging ? (
          <Button title="Start Ping" onPress={() => startPing()} />
        ) : (
          <Button title="Stop Ping" onPress={() => stopPing()} />
        )}
        <FlatList
          data={results}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{padding: 10}}
          renderItem={({item}) => {
            let color;
            if (item.ms < 100) {
              color = 'green';
            } else if (item.ms < 150) {
              color = 'yellow';
            } else {
              color = 'red';
            }
            return (
              <View
                style={{
                  flex: 1,
                  paddingStart: 10,
                  paddingEnd: 10,
                  marginVertical: 5,
                }}>
                <View
                  style={{
                    borderWidth: 2,
                    borderColor: color,
                    borderRadius: 10,
                    padding: 10,
                  }}>
                  <Text>
                    Reply from {ip}: time{' '}
                    <Text style={{color}}>{item.ms} ms.</Text>
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default App;
