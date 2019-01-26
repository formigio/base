import S3 from 'aws-sdk/clients/s3';

const pushArchiveToS3 = (profile, file) => {
  const client = new S3({
    accessKeyId: profile.accessKey,
    secretAccessKey: profile.secretKey
  });
  client.upload(
    {
      Bucket: profile.bucket,
      Key: profile.location,
      Body: file
    },
    {},
    (err, data) => {
      console.log(err, data);
    }
  );
};

export default pushArchiveToS3;
