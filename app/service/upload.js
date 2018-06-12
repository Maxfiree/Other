const path = require('path');
const uuidv4 = require('uuid/v4');

module.exports = app => {
  class Upload extends app.Service {
    /**
     * 准备附件上传地址
     * @param {string} filename 文件名
     * @param {string} storage 存储后端
     * @return {object} 附件待上传地址、文件获取地址
     */
    async prepareUpload(filename, storage) {
      if (!storage) {
        storage = app.config.upload.default;
      }
      if (storage === 'minio') {
        return await this.prepareUploadMinio(filename);
      }
    }

    async prepareUploadMinio(filename) {
      const minioClient = app.minioClient;
      // 业务逻辑, 准备文件名
      const ext = path.extname(filename);
      const name = uuidv4() + ext;
      const bucket = app.config.upload.minio.bucket;
      const uploadPayload = await new Promise((resolve, reject) => {
        // minioClient.presignedPutObject('course', 'user.jpg', 24 * 60 * 60, function(err, presignedUrl) {
        //   if (err) { reject(); return; }
        //   resolve(presignedUrl);
        // });
        const policy = minioClient.newPostPolicy();
        // Policy restricted only for bucket.
        policy.setBucket(bucket);
        policy.setKey(name);
        const expires = new Date();
        expires.setSeconds(6 * 60 * 60);
        // Policy expires in 6 hours.
        policy.setExpires(expires);
        minioClient.presignedPostPolicy(policy, function(err, presignedUrl) {
          if (err) { reject(err); }
          resolve(presignedUrl);
        });
      });
      return { storage: 'minio', url: path.join(bucket, name), uploadPayload };
    }
  }
  return Upload;
};
