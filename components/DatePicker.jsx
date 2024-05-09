import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { CustomInput } from './DatePickerInput';

const DatePicker = ({data, setData}) => {

  const [todayDate, setTodayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const onChangeTimeStart = (event, selectedStartTime) => {
    const currentStartTime = selectedStartTime;
    setStartTime(currentStartTime);
  };
  const onChangeTimeEnd = (event, selectedEndTime) => {
    const currentEndTime = selectedEndTime;
    setEndTime(currentEndTime);
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setSelectedDate(currentDate);
  };

  const showMode = (currentMode, feature = null) => {
    DateTimePickerAndroid.open({
      value: selectedDate || new Date(),
      onChange:
        feature !== null
          ? feature === 'start'
            ? onChangeTimeStart
            : onChangeTimeEnd
          : onChangeDate,
      mode: currentMode,
      is24Hour: true,
    });
  };


  useEffect(() => {
    if (
      endTime?.getTime() - startTime?.getTime() > 60 * 60 * 1000 ||
      startTime?.getTime() - endTime?.getTime() > 0
    ) {
      Alert.alert(
        `Invalid Duration`,
        'Please enter a valid range of time (max 1hr difference).',
      );
      setEndTime(null);
      setStartTime(null);
    } else if (todayDate.getDate() < selectedDate?.getDate()) {
      Alert.alert(`Invalid Date`, 'Please enter a past event.');
      setSelectedDate(null);
    }
    //if selected month is higher than the current month
    else if (todayDate?.getFullYear() - selectedDate?.getFullYear() < 0) {
      //one of the past years
      Alert.alert(
        `Invalid Date`,
        'Please enter a date not more than 7 days before',
      );
      setSelectedDate(null);
    } else if (
      todayDate.getMonth() - selectedDate?.getMonth() > 0 &&
      todayDate.getDate() > 7
    ) {
      Alert.alert(
        `Invalid Date`,
        'Please enter a date not more than 7 days before',
      );
      setSelectedDate(null);
    } else if (
      todayDate.getMonth() - selectedDate?.getMonth() > 0 &&
      selectedDate.getDate() - todayDate.getDate() < 23
    ) {
      Alert.alert(
        `Invalid Date`,
        'Please enter a date not more than 7 days before',
      );
      setSelectedDate(null);
    } else if (todayDate.getDate() - selectedDate?.getDate() > 7) {
      Alert.alert(
        `Invalid Date`,
        'Please enter a date not more than 7 days before',
      );
      setSelectedDate(null);
    } else {
      setData({...data, date: selectedDate, startTime, endTime});
    }
  }, [selectedDate, startTime, endTime]);

  return (
    <>
      <View style={{alignItems: 'center'}}>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={()=> showMode('date')}>
            <View>
              <Text style={styles.text}>{!selectedDate? 'Select Date':`${selectedDate.toLocaleDateString()}`}</Text>
            </View>
          </TouchableOpacity>
          {selectedDate ? (
            <>
            <Text style={styles.text}> - </Text>
              <TouchableOpacity onPress={()=> showMode('time', 'start')}>
                <View>
              <Text style={styles.text}>{!startTime? 'Begin Time':`${startTime.toLocaleTimeString()}`}</Text>
            </View>
              </TouchableOpacity>
              <Text style={styles.text}>:</Text>
              <TouchableOpacity onPress={()=> showMode('time', 'end')}>
                <View>
              <Text style={styles.text}>{!endTime? 'End Time':`${endTime.toLocaleTimeString()}`}</Text>
            </View>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  text:{
    fontSize: 18,
    color: '#878787',
  }
});

export default DatePicker;
