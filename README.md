# Avent - AI Travel Planner Mobile App

<p align="center">
  <img src="./assets/images/splash.png" alt="Avent Logo" width="200"/>
</p>

## 🚀 About

A smart travel planning mobile application that leverages AI to create personalized travel itineraries. Plan your trips with customized recommendations for flights, accommodations, and places to visit based on your preferences and budget.

## 🚀 Stack Used
- React Native with Expo and Expo Router for file-based navigation
- TypeScript for type safety
- Gemini AI API for trip generation
- Google Places API for location search
- Async Storage for local data persistence
- NativeWind (TailwindCSS) for styling
- User Authentication (Email and Password) with Firebase
- Database is Firebase's Firestore DB
- Google Maps API for mapping features

## Custom Color Palette

| Usage | Tailwind name | HEX |
|-------|---------------|-----|
| Primary | `primary` | #7C3AED |
| Secondary | `secondary` | #E9D5FF |
| Background | `background` | #FAF5FF |
| Text (dark) | `text-primary` | #1E1B4B |
| Accent | `accent` | #8B5CF6 |
| Hover | `accent-hover` | #6D28D9 |
| Success | `success` | #22C55E |
| Alert | `alert` | #EF4444 |

## Video Demo
- Because deploying is hard :(
https://drive.google.com/file/d/1UbQjPsd1CdqOqducUJLfNspNC3GU2N6Z/view?usp=sharing

## ⚡ Key Features

### 👤 User Experience
- Seamless and Secure Email & Password Authentication
- Interactive Date Selection Calendar
- Budget-based Trip Planning
- Real-time Trip Updates

### 🌍 Travel Planning
- AI-Powered Custom Itinerary Generation
- Smart Hotel Recommendations
- Flight Details and Booking Links
- Points of Interest Discovery
- Google Places Integration for Destination Search
- Direct Google Maps Integration for Navigation


-----------------------------------------------------------------

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root and add your keys:

   ```env
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   GEMINI_API_KEY=your_gemini_api_key

   EXPO_PUBLIC_TRAVELPAYOUTS_MARKER=your_travelpayouts_marker
   EXPO_PUBLIC_TRAVELPAYOUTS_TOKEN=your_travelpayouts_token
   ```

   The `GOOGLE_PLACES_API_KEY` and `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` should be the same key with the Places and Maps APIs enabled for search and photos.
   The `GEMINI_API_KEY` powers AI trip generation.

   The Travelpayouts marker and token enable affiliate links and API access for flights, hotels, and activities. Affiliate links are generated with program-specific `tp.media` URLs (Aviasales for flights, Hotellook for hotels, Welcome Pickups for tours and transfers, and Searadar for cruises) to avoid 404 errors.

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
