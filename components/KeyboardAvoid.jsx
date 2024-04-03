import { KeyboardAvoidingView, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'

const KeyboardAvoid = ({children}) => {
  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default KeyboardAvoid