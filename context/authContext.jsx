import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{createContext, useEffect, useState} from "react";

const AuthContext = createContext()

const AuthProvider = ({children})=>{
  const [state, setState] = useState({
    user: null,
  })

  useEffect(()=>{
    const localStorageData = async () => {
      const data = await AsyncStorage.getItem('user')
      const parsedData =  JSON.parse(data)
      setState({...state, user: parsedData})
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