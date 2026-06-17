# Building SwiftDrop (Android & iOS)

Builds run in the cloud with **EAS Build** — no Android Studio and **no Mac required** (iOS is built on Expo's cloud machines).

## One-time setup
1. Create a free Expo account at **expo.dev**.
2. Install the CLI: `npm install -g eas-cli`
3. From the `swiftdrop` folder:
   ```bash
   eas login
   eas init        # links the project and writes your projectId into app.json
   ```

## Android — APK (free, do this now)
```bash
eas build -p android --profile preview
```
- Produces a downloadable **`.apk`** you can install on any Android phone or hand to a buyer.
- On the first build, accept the prompt to generate a keystore (EAS stores it for you).
- Takes ~10–20 min on the free queue; you get a download link when it’s done.
- For the **Play Store**, use `--profile production` instead (produces an `.aab`).

## iOS — needs an Apple Developer account
EAS builds iOS in the cloud, but Apple requires code signing:
1. Enroll in the **Apple Developer Program ($99/year)**.
2. Build:
   ```bash
   eas build -p ios --profile preview
   ```
   EAS will ask for your Apple login and handle certificates/provisioning automatically.
3. To test on specific iPhones (ad-hoc), register each device first: `eas device:create`, then rebuild.
4. For the **App Store**, use `--profile production`.

> Without a paid Apple account, iOS can only build for the **Simulator** (which needs a Mac), so a real installable iPhone build requires the $99 enrollment. Android has no such requirement.

## Maps in a production build
- **iOS:** works out of the box (Apple Maps, no key).
- **Android:** needs a free **Google Maps API key**. Add it to `app.json`:
  ```json
  "android": {
    "package": "com.kelvin14rush.swiftdrop",
    "config": { "googleMaps": { "apiKey": "YOUR_GOOGLE_MAPS_KEY" } }
  }
  ```
  Get a key at console.cloud.google.com → enable **“Maps SDK for Android.”** Until it’s added, the Android map area appears blank (the rest of the app works).

## Before you ship
- Make sure your Supabase keys are set (see `.env.example`) and the SQL migrations have been run.
- Bump `version` in `app.json` for each store release.
