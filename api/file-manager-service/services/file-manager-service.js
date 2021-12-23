'use strict';

/**
 *
 * @param bucket
 * @param key
 */
 async function get(bucket, key) {
  try {
    const file = await strapi.services['aws-service'].s3.getObject({
      Bucket: bucket,
      Key: key,
    }).promise();
    return file;
  } catch (error) {
    console.log('error', error);
  }
}

/**
 *
 * @param bucket
 * @param key
 * @param data
 */
async function put(bucket, key, data) {
  try {
    const file = await strapi.services['aws-service'].s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: data,
    }).promise();
    return file;
  } catch (error) {
    console.log('error', error);
  }
}

/**
 *
 * @param bucket
 * @param key
 */
async function remove(bucket, key) {
  try {
    const file = await strapi.services['aws-service'].s3.deleteObject({
      Bucket: bucket,
      Key: key,
    }).promise();
    return file;
  } catch (error) {
    console.log('error', error);
  }
}

module.exports = {
  get,
  put,
  remove
};
