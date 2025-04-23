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
import {AuthContext} from '../../context/authContext'; // Importing the authentication context
import DatePicker from '../../components/DatePicker'; // Importing DatePicker component for selecting date
import Slider from 'react-native-slider'; // Importing Slider component for rating scale
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importing AsyncStorage for local storage
import {SERVER_URL, MODEL_URL} from '@env'; // Importing environment variables for server and model URLs
import {fetchDataFromFitbit} from '../../utils/fetchDataFromFitbit'; // Utility function to fetch data from Fitbit API

const Feedback = () => {
  // Using context to access the authentication state and user details
  const [state, setState] = useContext(AuthContext);
  
  // Initial details state, storing event-related information
  const initialDetails = {
    reason: '', // Reason for the event
    date: null, // Date of the event
    startTime: null, // Start time of the event
    endTime: null, // End time of the event
    level: 5, // Intensity level of the event (1-10)
    features: null, // Features related to the event (for machine learning)
  };
  const [details, setDetails] = useState(initialDetails); // Local state to manage feedback form details

  // Function to format date in 'YYYY-MM-DD' format
  const formattedDate = date => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Function to format time in 'HH:MM' format (24-hour)
  const formattedTime = time => {
    const dateObject = new Date(time);
    const options = {hour: '2-digit', minute: '2-digit', hour12: false};
    return dateObject.toLocaleTimeString('en-US', options);
  };

  // Function to check if model prediction is needed (if there are at least 5 events)
  const checkPredictionNeeded = () => {
    if (state.events.length >= 5) {
      // Extract features and targets for model training from the event data
      const featuresArr = state.events.map(event => event.features);
      const targetsArr = state.events.map(event => event.level > 6 ? 0 : 1); // Binary classification: 1 for low intensity, 0 for high intensity

      // Send features and targets to the server for model fine-tuning
      fetch(`${MODEL_URL}/fine_tune`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: featuresArr,
          target: targetsArr,
        }),
      })
        .then(res => res.json())
        .then(res => {
          Alert.alert('Prediction', 'The model prediction was successful');
          console.log(res);
        })
        .catch(err => {
          Alert.alert('Prediction', 'The model prediction failed');
          console.log(err);
        });
    }
  };

  // Function to handle the submission of the feedback form
  const submit = async () => {
    // Check if all required fields are filled
    if (
      details.reason &&
      details.date &&
      details.startTime &&
      details.endTime
    ) {
      try {
        // Fetch relevant data from Fitbit based on user input (date, start time, end time)
        const response = await fetchDataFromFitbit(
          state.tokens.accessToken,
          state.tokens.user_id,
          formattedDate(details.date),
          formattedTime(details.startTime),
          formattedTime(details.endTime),
        );
        
        // Send event details to the server
        fetch(`${SERVER_URL}/event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: state.user.info.username, // Username from the context
            details, // Feedback details entered by the user
          }),
        })
          .then(res => res.json())
          .then(async res => {
            if (res.status == 201) {
              // If the event is successfully submitted
              Alert.alert('Submitted', `${res.message}`);
              setDetails({...details, features: response}); // Save the Fitbit response (features) to the details
              
              // Store the new event in AsyncStorage and update the context
              await AsyncStorage.setItem(
                'events',
                JSON.stringify([...state.events, details]),
              );
              setState({
                ...state,
                events: [...state.events, details], // Update events in global state
              });
              
              // Check if model fine-tuning/prediction is needed based on the event count
              checkPredictionNeeded();
            } else {
              // If there's an error in submission
              Alert.alert('Error', `${res.message}`);
              setDetails(initialDetails); // Reset the form
            }
          })
          .catch(err => {
            Alert.alert('Server error');
            setDetails(initialDetails); // Reset the form if server request fails
          });
      } catch (e) {
        // Handle error if Fitbit data fetch fails
        Alert.alert('Error', 'Error fetching data from Fitbit');
        setDetails(initialDetails); // Reset the form
      }
    } else {
      // Alert if any field is left empty
      Alert.alert(
        'All fields required.',
        'Please enter all the event details.',
      );
      setDetails(initialDetails); // Reset the form
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        {/* Input field for reason of event */}
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
            value={details.reason}
          />
        </View>
        
        {/* DatePicker component to select the date of the event */}
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
        
        {/* Slider component to rate the intensity level of the event */}
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
          
          {/* Labels for the slider scale (1 to 10) */}
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

        {/* Submit button to submit the event details */}
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
