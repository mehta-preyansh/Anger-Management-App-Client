import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AngerLog({level, reason, date, startTime, endTime, isLast, id}) {
  const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      minHeight: 80,
      alignItems: 'stretch',
      paddingHorizontal: 10,
      paddingBottom: 10,
      marginBottom: 10,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: '#a4a4a456',
      flexDirection: 'row',
      gap: 20,
    },
    details: {
      gap: 10,
      flex: 1,
    },
    timestamp: {
      alignItems: 'flex-end',
      gap: 10,
    },
    editLog: {
      flexDirection: 'row',
      gap: 20,
      marginTop: 'auto',
    },
  });
  const formattedDate = date => {
    const newDate = new Date(date)
    return `${newDate.getHours()}:${
      newDate.getMinutes() < 10 ? '0' : ''
    }${newDate.getMinutes()}`;
  }

  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const deleteLog = () => {
    Alert.alert('Delete Log', 'Are you sure you want to delete this log?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          setLoading(true);
          fetch(
            `https://anger-management-app-server.onrender.com/user/${state.user.id}/logs/${id}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
            .then(response => {
              fetch(
                `https://anger-management-app-server.onrender.com/events?username=${state.user.info.username}`,
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
                  setLoading(false);
                  console.log(err);
                });
            })
            .catch(e => setLoading(false));
        },
      },
    ]);
  };
  // const editLog = () => {};

  return (
    <View style={styles.wrapper}>
      <View style={styles.details}>
        <Text
          style={{
            color: '#fff',
            fontSize: 25,
            fontWeight: 'bold',
          }}>{`${level}`}</Text>
        <Text style={{color: '#fff', fontSize: 14}}>{`${reason}`}</Text>
      </View>
      <View style={styles.timestamp}>
        <Text style={{color: '#fff'}}>{`${new Date(
          date,
        ).toLocaleDateString()}`}</Text>
        <Text style={{color: '#fff'}}>{`${formattedDate(startTime)} - ${formattedDate(endTime)}`}</Text>
        <View style={styles.editLog}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity onPress={deleteLog}>
              <Icon name="delete" size={22} color="#fff" />
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity onPress={editLog}>
            <Icon name="edit" size={22} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}
