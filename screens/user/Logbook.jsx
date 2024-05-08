import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AngerLog from '../../components/AngerLog';

export default function Logbook() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useContext(AuthContext);
  useEffect(() => {
    // console.log(typeof(state.events))
    const fetchAngerLogs = async () => {
      setLoading(true);
      const events = state.events
      if (events===null) {
        fetch(
          `https://anger-management-app-server.onrender.com/events?username=${state.user.username}`,
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
            <FlatList
              data={state.events}
              contentContainerStyle={{padding: 10}}
              renderItem={({item, index}) => (
                <AngerLog
                  id={item._id}
                  level={item.angerLevel}
                  date={item.date}
                  reason={item.reason}
                  isLast={index == state.events.length - 1 ? true : false}
                />
              )}
            />
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
    paddingVertical:15
  },
});
