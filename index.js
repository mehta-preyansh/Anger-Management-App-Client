/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { AuthProvider } from './context/authContext';

AppRegistry.registerComponent(appName, () => App);
