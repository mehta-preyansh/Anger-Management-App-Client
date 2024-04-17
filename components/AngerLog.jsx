import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function AngerLog({level, reason, date, isLast}) {
  const styles = StyleSheet.create({
    wrapper: {
      width: "100%",
      minHeight: 80,
      alignItems: 'stretch',
      paddingHorizontal: 10,
      marginBottom: 10,
      borderBottomWidth: isLast ? 0: 1,
      borderBottomColor: "#a4a4a456",
      flexDirection: 'row',
      gap: 20
    },
    details: {
      gap: 10,
      flex: 1,
    }
    ,
    timestamp: {
      alignItems: 'flex-end',
      gap: 10,
    }
  })
  const newDate = new Date(date)
  const formattedDate = `${newDate.getHours()}:${newDate.getMinutes()<10? '0':""}${newDate.getMinutes()}`
  return (
    <View style={styles.wrapper}>
      <View style={styles.details}>
      <Text style={{color: "#fff", fontSize: 25, fontWeight: 'bold'}}>{`${level}`}</Text>
      <Text style={{color: "#fff", fontSize: 14}}>{`${reason}`}</Text>
      </View>
      <View style={styles.timestamp}>
      <Text style={{color: "#fff"}}>{`${new Date(date).toLocaleDateString()}`}</Text>
      <Text style={{color: "#fff"}}>{`${formattedDate}`}</Text>
      </View>
    </View>
  )
}

