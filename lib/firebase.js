const firebase = require('firebase');
const log = console.log;

module.exports = {
  storeData: async (data) => {
    const firebaseConfig = {
      apiKey: process.env.FBASE_API_KEY,
      authDomain: process.env.FBASE_AUTH_DOMAIN,
      databaseURL: process.env.FBASE_DATABASE_URL,
      projectId: process.env.FBASE_PROJECT_ID,
      storageBucket: process.env.FBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FBASE_MESSAGING_SENDER_ID,
      appId: process.env.FBASE_APP_ID,
      measurementId: process.env.FBASE_MEASUREMENT_ID
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);

    await firebase
        .database()
        .ref(process.env.FBASE_COLLECTION_NAME)
        .set(data, function(error) {
          if (!error) {
            log('Data pushed to firebase successfully');
            return;
          }

          log('There was an error while pushing data to firebase');
          log(error);
        });

    app.delete();
  },
};
