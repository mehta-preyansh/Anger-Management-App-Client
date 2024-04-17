import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'

const DatePicker = ({data, setData}) => {
  const [todayDate, setTodayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setSelectedDate(currentDate)
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: selectedDate || new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  useEffect(()=>{
    if((todayDate.getMonth()-selectedDate?.getMonth()>0) && todayDate.getDate()>7){
      Alert.alert(`Invalid Date`, 'Please enter a date not more than 7 days before')
      setSelectedDate(null)
    }
    else if((todayDate.getMonth()-selectedDate?.getMonth()>0) && (selectedDate.getDate()-todayDate.getDate()<23)){
      Alert.alert(`Invalid Date`, 'Please enter a date not more than 7 days before')
      setSelectedDate(null)
    }
    else if(todayDate.getDate()-selectedDate?.getDate()>7){
      Alert.alert(`Invalid Date`, 'Please enter a date not more than 7 days before')
      setSelectedDate(null)
    }
    else if(todayDate.getDate()<selectedDate?.getDate()){
      Alert.alert(`Invalid Date`, 'Please enter a past event.')
      setSelectedDate(null)
    }
    else{
      setData({...data, date: selectedDate});
    }
  },[selectedDate])
  return (
    <>
    <View style={{alignItems:'center'}}>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={showDatepicker} >
          <View style={{padding:10, backgroundColor: "#ffffff18", borderRadius: 5}}>
            <Text style={{color: "#ffffff92"}}>Select Date</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={showTimepicker} >
          <View style={{padding:10, backgroundColor: "#ffffff18", borderRadius: 5}}>
            <Text style={{color: "#ffffff92"}}>Select Time</Text>
          </View>
        </TouchableOpacity>
      </View>
      {selectedDate && (
        <Text style={{color: "#fff", fontWeight: 'bold', fontSize: 12}}>Selected Date : {selectedDate.toLocaleString()}</Text>
        )}
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    padding:20,
    alignItems: 'center',
    gap:10
  }
})

export default DatePicker