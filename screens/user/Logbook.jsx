import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AngerLog from '../../components/AngerLog';
import { SERVER_URL } from '@env';

export default function Logbook() {
  const [loading, setLoading] = useState(true); // Track loading state
  const [state, setState] = useContext(AuthContext); // Access the global state from AuthContext

  // Fetch anger logs from server or AsyncStorage on component mount
  useEffect(() => {
    const fetchAngerLogs = async () => {
      setLoading(true); // Set loading to true while fetching data

      // If there are no events in state, fetch from server
      if (!state.events.length) {
        try {
          // Fetch events for the user from the server
          const response = await fetch(
            `${SERVER_URL}/events?username=${state.user.info.username}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await response.json();
          
          // Store the fetched events in AsyncStorage and update the state
          await AsyncStorage.setItem('events', JSON.stringify(data.events));
          setState({ ...state, events: data.events });
        } catch (err) {
          console.error(err);
          Alert.alert('Error', 'There was an issue fetching anger logs.');
        } finally {
          setLoading(false); // Set loading to false after data fetching
        }
      } else {
        setLoading(false); // If events are already available in state, stop loading
      }
    };

    fetchAngerLogs();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        {/* Show loading spinner while data is being fetched */}
        {loading ? (
          <ActivityIndicator style={{ margin: 20 }} />
        ) : (
          <View style={styles.container}>
            {/* Show list of events if they exist, otherwise display a message */}
            {state.events.length ? (
              <FlatList
                data={state.events}
                keyExtractor={(item) => item._id} // KeyExtractor for better performance
                initialNumToRender={10} // Renders the first 10 items initially
                contentContainerStyle={{ padding: 10 }}
                renderItem={({ item, index }) => (
                  <AngerLog
                    id={item._id}
                    level={item.angerLevel || item.level} // Display anger level
                    date={item.date}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    reason={item.reason}
                    isLast={index === state.events.length - 1} // Highlight the last item
                  />
                )}
              />
            ) : (
              // Display message if there are no logs
              <Text style={styles.noLogsText}>No Logs yet</Text>
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
  noLogsText: {
    color: '#919191',
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
