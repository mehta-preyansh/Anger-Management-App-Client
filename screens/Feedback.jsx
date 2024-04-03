import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../context/authContext'
import DatePicker from '../components/DatePicker';

const Feedback = () => {
  const [state, setState] = useContext(AuthContext)
  const [angerLevel, setAngerLevel] = useState('')
  const [details, setDetails] = useState({
    reason: '',
    level: '',
    date: null,
  })
  const handleAngerChange = ()=>{

  }
  const logout = async () => {
    setState({ user: null, token: '' })
    await AsyncStorage.removeItem('user')
  }
  const submit = async () => {
    if(details.reason && details.date){
      //Submit to server
    }
    else{
      Alert.alert('All fields required.', 'Please enter all the event details.')
    }
  }
  return (
    <View style={styles.wrapper}>
      <Text style={{ color: "#fff", fontSize: 20 }}>
        Hey there! {state.user.username}
      </Text>
      <View style={{ width: '100%', padding: 20 }}>
        <Text style={{ color: "#fff", marginBottom: 10 }}>What was the cause of the event?</Text>
        <TextInput multiline style={styles.input} placeholder='Enter here...' placeholderTextColor='#949494'></TextInput>
      </View>
      <View>
        <Text style={{ color: "#fff"}}>How angry were you on a scale of 1 - 10</Text>
      </View>
      <DatePicker />
      <TouchableOpacity onPress={submit} style={{ marginRight: 10 }}>
        <View style={styles.submitBtn}>
          <Text style={{ color: '#000', fontSize: 20 }}>Submit</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={logout} style={{ marginRight: 10, alignSelf: 'flex-end' }}>
        <View style={styles.logoutBtn}>
          <Text style={{ color: '#000', fontSize: 20 }}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

};

export default Feedback;


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: '#0b0909',
  },
  logoutBtn: {
    backgroundColor: '#4B20F3',
    padding: 15,
    borderRadius: 10
  },
  submitBtn: {
    backgroundColor: '#47a7d0',
    padding: 10,
    borderRadius: 5
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
  }
})