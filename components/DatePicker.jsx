import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'

const DatePicker = () => {
  useEffect(() => {
    console.log(selectedDate.toLocaleString())
  })
  const [todayDate, setTodayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    // console.log(todayDate.getDate()-selectedDate.getDate())
    if(todayDate.getMonth()-selectedDate.getMonth()>0 && todayDate.getDate()-selectedDate.getDate()<27){
      Alert.alert(`Invalid Date`, 'Please enter a date not more than 7 days before')
    }
    if(todayDate.getDate()<selectedDate.getDate()){
      Alert.alert(`Invalid Date`, 'Can you predict the future?')
    }
    else{
      const currentDate = selectedDate;
      setSelectedDate(currentDate);
    }
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: selectedDate,
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
  return (
    <>
    <View style={{alignItems:'center'}}>
      <View style={styles.wrapper}>
        <Text style={{ color: "#fff" }}>When did the event happened?</Text>
        <TouchableOpacity onPress={showDatepicker} >
          <View style={{padding:5}}>
            <Text style={{color: "#ffffff92"}}>Select Date</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={showTimepicker} >
          <View style={{padding:5}}>
            <Text style={{color: "#ffffff92"}}>Select Time</Text>
          </View>
        </TouchableOpacity>
      </View>
      {selectedDate && (
        <Text style={{color: "#fff"}}>Selected Date : {selectedDate.toLocaleString()}</Text>
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