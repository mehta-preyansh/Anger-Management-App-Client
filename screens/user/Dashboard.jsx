import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  // useEffect(()=>{
  //   
  // })
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.wrapper}>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 40,
    backgroundColor: '#0b0909',
  },
  
});