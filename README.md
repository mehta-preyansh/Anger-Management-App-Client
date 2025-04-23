# Anger Management App

This is a React Native application designed to track and log anger-related events. Users can input their anger levels, reasons, and the times of occurrence for each event. The app integrates with Fitbit data to fetch relevant user health data and predicts possible anger patterns using machine learning.

## Features

- **Track Anger Events**: Users can log events by specifying the reason, anger level (1-10), and time details.
- **Prediction Model**: The app uses machine learning to predict future anger events if sufficient data is available.
- **Sync Data**: Fetches anger logs from a server and stores them in AsyncStorage for offline use.
- **Data Integration**: Integrates with Fitbit to collect relevant health data for a better understanding of the user's emotional state.

## Screens

1. **Feedback Screen**:
   - Allows users to log their anger events.
   - Inputs for event reason, anger level, start and end times, and date.
   - Displays a slider for selecting anger levels.
   - Integrates with Fitbit to fetch health-related data.

2. **Logbook Screen**:
   - Displays a list of previously logged anger events.
   - Allows users to view all their event logs in a well-structured list.
   - Supports data fetching from the server if no logs exist in the local storage.

## Setup

### Prerequisites

- Node.js (v16 or higher)
- React Native (v0.66 or higher)
- Android Studio or Xcode (for building on respective platforms)
- A Fitbit developer account to fetch health data using their API

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/anger-management-app.git
   cd anger-management-app
2. Install dependencies:

   ```bash
   npm install
3. Setup environment variables:
   - Create a .env file in the root directory.
   - Add the following environment variables:
   ```bash
      SERVER_URL=<Your server URL>
      MODEL_URL=<Your model URL>
4. Run the app on your preferred platform:
    ```bash
   npx react-native run-android   # For Android
   npx react-native run-ios       # For iOS

### API Endpoints
- POST /event: Submit a new anger event to the server.

- GET /events: Fetch all anger events associated with the logged-in user.

### Technologies Used
- React Native: Framework for building native apps.

- AsyncStorage: To persist data locally on the device.

- Fitbit API: For fetching health data.

- Redux/Context API: For global state management.

- Slider: React Native component for selecting anger level.

### Contributing
- Fork the repository.

- Create a new branch (git checkout -b feature-name).

- Commit your changes (git commit -am 'Add new feature').

- Push to the branch (git push origin feature-name).

- Open a pull request.


### Explanation of Sections:

- **App Description**: An overview of the app's functionality.
- **Features**: A quick list of key functionalities.
- **Screens**: Describes the main screens in the app.
- **Setup Instructions**: Details on how to get the project up and running locally.
- **API Endpoints**: Specifies the server API endpoints being used in the app.
- **Technologies Used**: Lists the core technologies and tools used in the project.
- **Contributing**: Basic guidelines on how to contribute to the project.

