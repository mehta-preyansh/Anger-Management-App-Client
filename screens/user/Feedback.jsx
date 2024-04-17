import React, {useContext, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AuthContext} from '../../context/authContext';
import DatePicker from '../../components/DatePicker';
import Slider from 'react-native-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feedback = () => {
  const [state, setState] = useContext(AuthContext);
  const [details, setDetails] = useState({
    reason: '',
    date: null,
    level: 2,
  });

  const submit = async () => {
    // console.log(details);
    if (details.reason && details.date) {
      //Store in async storage
      const addedEvents = state.events.push({
        reason: details.reason,
        date: details.date,
        angerLevel: details.level,
      });
      await AsyncStorage.setItem('events', JSON.stringify(addedEvents));
      setState({...state, evets: addedEvents});
      //Submit to server
      fetch(`https://anger-management-app-server.onrender.com/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: state.user.username,
          details: details,
        }),
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.status == 201) {
            Alert.alert('Submitted', `${res.message}`);
          } else {
            Alert.alert('Error', `${res.message}`);
          }
        })
        .catch(err => {
          Alert.alert('Server error');
        });
      setDetails({
        reason: '',
        date: null,
        level: 2,
      })
    } else {
      Alert.alert(
        'All fields required.',
        'Please enter all the event details.',
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        <View style={{width: '100%', padding: 20}}>
          <Text style={{color: '#fff', marginBottom: 10, fontSize: 16}}>
            What was the cause of the event?
          </Text>
          <TextInput
            multiline
            style={styles.input}
            placeholder="Enter here..."
            placeholderTextColor="#949494"
            onChangeText={e => setDetails({...details, reason: e})}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 150,
            alignItems: 'center',
            padding: 20,
          }}>
          <Text
            style={{
              color: '#fff',
              marginBottom: 10,
              fontSize: 16,
              alignSelf: 'flex-start',
            }}>
            When did the event happen?
          </Text>
          <DatePicker data={details} setData={setDetails} />
        </View>
        <View style={{width: '100%', alignItems: 'center', padding: 20}}>
          <Text
            style={{
              color: '#fff',
              marginBottom: 10,
              fontSize: 16,
              alignSelf: 'flex-start',
            }}>
            How much rage you felt on a scale of 1-10?
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={details.level}
            style={{width: '100%'}}
            onValueChange={value => {
              setDetails(prev => ({...prev, level: value}));
            }}
            trackStyle={{backgroundColor: '#45015d'}}
            thumbStyle={{backgroundColor: 'white'}}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
            }}>
            <Text style={styles.label}>1</Text>
            <Text style={styles.label}>2</Text>
            <Text style={styles.label}>3</Text>
            <Text style={styles.label}>4</Text>
            <Text style={styles.label}>5</Text>
            <Text style={styles.label}>6</Text>
            <Text style={styles.label}>7</Text>
            <Text style={styles.label}>8</Text>
            <Text style={styles.label}>9</Text>
            <Text style={styles.label}>10</Text>
          </View>
        </View>
        <TouchableOpacity onPress={submit} style={{marginRight: 10}}>
          <View style={styles.submitBtn}>
            <Text style={{color: '#fff', fontSize: 20}}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 40,
    backgroundColor: '#0b0909',
  },
  logoutBtn: {
    backgroundColor: '#4B20F3',
    padding: 15,
    borderRadius: 10,
  },
  submitBtn: {
    backgroundColor: '#4B20F3',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    width: '100%',
    height: 120,
    textAlignVertical: 'top',
    backgroundColor: '#292929',
    color: '#fff',
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  label: {
    fontSize: 12,
    color: '#fff',
  },
});