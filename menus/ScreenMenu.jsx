import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';
import Feedback from '../screens/Feedback';
import {AuthContext} from '../context/authContext';

const ScreenMenu = () => {
  const Stack = createNativeStackNavigator();
  const [state,setState] = useContext(AuthContext);
  const authenticatedUser = state.user;
  return (
    <Stack.Navigator>
      {authenticatedUser ? (
        <Stack.Screen
          name="feedback"
          component={Feedback}
          options={{headerShown: false}}
        />
        ) : ( 
        <>
          <Stack.Screen
            name="login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="register"
            component={Register}
            options={{headerShown: false}}
          />
        </>
      )} 
    </Stack.Navigator>
  );
};

export default ScreenMenu;
