# Porkascout

## Initial Installation

Run `npm install` in the root folder, and also in the `functions` directory to install the required npm packages.

Edit the information in `environment.example.ts` and `environment.prod.example.ts`, and afterwards rename them to `environment.ts` and `environment.prod.ts`.

Change `2018` to the current year in `firestore.rules`.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Deploy

Run `firebase deploy` to deploy the project to your firebase application, you might need to do `firebase login` before deployment works.

## Year-to-year Maintenance

For a new season, you will need to change the `year` value in `environment.ts` and `environment.prod.ts` to the current year, and also update the year in `firestore.rules`.

The Match Scouting layout will also need to be updated to reflect the current game.


**TODO**:
- Instructions on creating the Match Scouting file.