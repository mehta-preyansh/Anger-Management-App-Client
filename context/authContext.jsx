import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{createContext, useEffect, useState} from "react";
import { initialState } from "./initialState";
const AuthContext = createContext()

const AuthProvider = ({children})=>{
  const [state, setState] = useState(initialState)

  useEffect(()=>{
    const localStorageData = async () => {
      const user = await AsyncStorage.getItem('user')
      const events = await AsyncStorage.getItem('events')
      const parsedUser =  JSON.parse(user)
      const parsedEvents =  JSON.parse(events)
      setState({...state, user: {...state.user, info: parsedUser}, events: parsedEvents ? parsedEvents : []})
    }
    localStorageData()
  },[])

  return(
    <>
      <AuthContext.Provider value={[state, setState]}>
        {children}
      </AuthContext.Provider>
    </>
  )
}

export {AuthContext, AuthProvider}