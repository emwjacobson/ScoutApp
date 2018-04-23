// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// The contents for these values can be found in the Project Settings of your firebase project.
export const environment = {
  production: true,
  name: 'Scout',
  version: '0.0.1',
  year: 2018,
  firebase: {
    apiKey: '<firebase-api-key>',
    authDomain: '<firebase-auth-domain>',
    databaseURL: '<firebase-database-url>',
    projectId: '<firebase-project-id>',
    storageBucket: '<firebase-storage-bucket>',
    messagingSenderId: '<firebase-sender-id>'
  },
  tba: {
    api: '<tba-api-key>',
    endpoint: 'https://www.thebluealliance.com/api/v3/'
  }
};

