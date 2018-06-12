const ContextLogger = require('./context-logger');
const MinioClient = Symbol('Application#MinioClient');
const Minio = require('minio');
const BackgroundTaskScheduling = Symbol('Application#BackgroundTaskScheduling');
const SyncTaskScheduling = Symbol('Application#SyncTaskScheduling');
const BackgroundTasksList = Symbol('Application#BackgroundTasksList');
const SyncTasksList = Symbol('Application#SyncTasksList');

module.exports = {
  get minioClient() {
    if (!this[MinioClient]) {
      this[MinioClient] = new Minio.Client(this.config.upload.minio);
    }
    return this[MinioClient];
  },

  get backgroundTaskScheduling() {
    return this[BackgroundTaskScheduling];
  },

  set backgroundTaskScheduling(scheduling) {
    this[BackgroundTaskScheduling] = scheduling;
  },

  get syncTaskScheduling() {
    return this[SyncTaskScheduling];
  },

  set syncTaskScheduling(scheduling) {
    this[SyncTaskScheduling] = scheduling;
  },

  get backgroundTasksList() {
    if (!this[BackgroundTasksList]) this[BackgroundTasksList] = [];
    return this[BackgroundTasksList];
  },

  get syncTasksList() {
    if (!this[SyncTasksList]) this[SyncTasksList] = [];
    return this[SyncTasksList];
  },

  ContextLogger,
};
