import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import PipHandler, {usePipModeListener} from 'react-native-pip-android';

const App = () => {
  // Use this boolean to show / hide ui when pip mode changes
  const inPipMode = usePipModeListener();

  if (inPipMode) {
    return (
      <View>
        <Text>PIP Mode</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>App</Text>
      <TouchableOpacity onPress={() => PipHandler.enterPipMode(300, 214)}>
        <Text>Click to Enter Pip Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
