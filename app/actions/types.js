// User Actions
export const SET_USER = 'SET_USER';
export const LOAD_USER_FROM_DISK = 'LOAD_USER_FROM_DISK';
export const SAVE_USER_NOTES = 'SAVE_USER_NOTES';

// Backup Profile
export const SET_BACKUP_PROFILE = 'SET_BACKUP_PROFILE';
export const LOAD_BACKUP_PROFILE_FROM_DISK = 'LOAD_BACKUP_PROFILE_FROM_DISK';

// Tour
export const SET_TOUR_COMPLETE = 'SET_TOUR_COMPLETE';
export const LOAD_TOUR_FROM_DISK = 'LOAD_TOUR_FROM_DISK';

// Sync Version
export const SET_SYNC_VERSION = 'SET_SYNC_VERSION';
export const LOAD_SYNC_VERSION_FROM_DISK = 'LOAD_SYNC_VERSION_FROM_DISK';

export const UserStruct = {
  schemaVersion: '1.0.0',
  id: '',
  name: '',
  notes: ''
};

export const BackupProfileStruct = {
  schemaVersion: '1.0.0',
  type: 's3', // type: formigio-sync (future state)
  updatedAt: '',
  verifiedAt: '',
  config: {}
};

export const S3BackupConfigStruct = {
  schemaVersion: '1.0.0',
  accessKey: '',
  secretKey: '',
  bucket: '',
  region: '',
  location: ''
};

export const UserToursStruct = {
  schemaVersion: '1.0.0',
  tours: {},
  updatedAt: ''
};

export const UserTourStruct = {
  schemaVersion: '1.0.0',
  id: '',
  status: 'pending' // pending, complete
};

export const SyncMetaData = {
  schemaVersion: '1.0.0',
  deviceId: '',
  currentVersion: ''
};

export const getS3BackupConfigStruct = (config = {}) =>
  Object.assign({}, S3BackupConfigStruct, config);

export const getBackupProfileStruct = (profile = {}) => {
  let config = {};
  if (profile.type === 's3') config = getS3BackupConfigStruct(profile.config);

  return Object.assign({}, BackupProfileStruct, profile, { config });
};

export const getUserToursStruct = (userTours = UserToursStruct) =>
  Object.assign({}, UserToursStruct, userTours, {
    tours: Object.assign({}, userTours.tours)
  });

export const getUserTourStruct = (userTour = {}) =>
  Object.assign({}, UserTourStruct, userTour);

export const InitialStateStruct = {
  user: UserStruct,
  backupProfile: BackupProfileStruct,
  tour: getUserToursStruct(),
  syncVersion: SyncMetaData
};
