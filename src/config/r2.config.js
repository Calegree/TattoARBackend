const AWS = require('aws-sdk');

const r2 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.R2_ENDPOINT),  
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: process.env.R2_REGION || 'auto',
});

module.exports = r2;