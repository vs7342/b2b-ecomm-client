// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:80',
  s3_details: {
    ACCESS_KEY_ID : 'dummy_access_key_id',
    SECRET_ACCESS_KEY : 'dummy_secret',
    S3_REGION : 'dummy_region',
    BUCKET : 'dummy_bucket_name',
  },
  firebase: {
    apiKey: 'api_key',
    authDomain: 'auth_domain',
    databaseURL: 'fcm_database_url',
    projectId: 'project_id',
    storageBucket: 'storage_bucket',
    messagingSenderId: 'messaging_sender_id'
  }
};
