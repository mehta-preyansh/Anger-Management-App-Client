import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AngerLog from '../../components/AngerLog';
import {SERVER_URL} from '@env';

export default function Logbook() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useContext(AuthContext);
  useEffect(() => {
    const fetchAngerLogs = async () => {
      setLoading(true);
      const eventsLength = state.events.length;
      if (!eventsLength) {
        fetch(
          `${SERVER_URL}/events?username=${state.user.info.username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then(res => {
            return res.json();
          })
          .then(async response => {
            await AsyncStorage.setItem(
              'events',
              JSON.stringify(response.events),
            );
            setState({...state, events: response.events});
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
      }
      setLoading(false);
    };
    fetchAngerLogs();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        {loading ? (
          <ActivityIndicator style={{margin: 20}} />
        ) : (
          <View style={styles.container}>
            {state.events.length ? (
              <FlatList
                data={state.events}
                contentContainerStyle={{padding: 10}}
                renderItem={({item, index}) => (
                  <AngerLog
                    id={item._id}
                    level={item.angerLevel || item.level}
                    date={item.date}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    reason={item.reason}
                    isLast={index == state.events.length - 1 ? true : false}
                  />
                )}
              />
            ) : (
              <Text style={{color: "#919191", alignSelf: 'center'}}>No Logs yet</Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 40,
    backgroundColor: '#0b0909',
    paddingHorizontal: 15,
  },
  container: {
    width: '100%',
    marginBottom: 100,
    marginTop: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingVertical: 15,
    paddingLeft: 15,
  },
});
