import storage from 'electron-json-storage';

export const getFileContents = (type, callback) => {
  storage.get(type, callback);
};

// Load State is called from the App component, passing in the
export const loadState = (type, callback) => {
  try {
    // Try to pull the state from the localStorage
    const serializedState = localStorage.getItem(type);

    if (serializedState !== null) {
      // If the localStorage value was there, fire off the loadstate handler
      callback(null, serializedState);
      // End the process here, we don't need to load from disk
      return;
    }

    // Fetch the state from the disk. Callback will be fired as the
    // loadstate handler
    storage.get(type, callback);
  } catch (err) {
    console.log(err);
  }
};

export const saveState = state => {
  if (state.user !== null && state.user.id !== '') {
    try {
      // If there is a user in the state, we serialize it
      const serializedState = JSON.stringify(state.user);
      // And store it on the disk
      storage.set('user', serializedState, err => {
        if (err) console.log(err);
      });
      // As well as in the local storage.
      localStorage.setItem('user', serializedState);
    } catch (err) {
      console.log(err);
    }
  }
  if (state.backupProfile !== null && state.backupProfile.updatedAt !== '') {
    try {
      // If there is a user in the state, we serialize it
      const serializedState = JSON.stringify(state.backupProfile);
      // And store it on the disk
      storage.set('backupProfile', serializedState, err => {
        if (err) console.log(err);
      });
      // As well as in the local storage.
      localStorage.setItem('backupProfile', serializedState);
    } catch (err) {
      console.log(err);
    }
  }
  if (state.tour !== null && state.tour.updatedAt !== '') {
    try {
      // If there is a user in the state, we serialize it
      const serializedState = JSON.stringify(state.tour);
      // And store it on the disk
      storage.set('tour', serializedState, err => {
        if (err) console.log(err);
      });
      // As well as in the local storage.
      localStorage.setItem('tour', serializedState);
    } catch (err) {
      console.log(err);
    }
  }
  if (state.syncVersion !== null && state.syncVersion.deviceId !== '') {
    try {
      // If there is a syncVersion in the state, we serialize it
      const serializedState = JSON.stringify(state.syncVersion);
      // And store it on the disk
      storage.set('syncVersion', serializedState, err => {
        if (err) console.log(err);
      });
      // As well as in the local storage.
      localStorage.setItem('syncVersion', serializedState);
    } catch (err) {
      console.log(err);
    }
  }
};
