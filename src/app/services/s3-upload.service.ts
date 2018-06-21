import { Injectable, isDevMode } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { ConstantsService } from './constants.service';

@Injectable()
export class S3UploadService {

  constructor() { }

  // Each retailer will have their own folder - thus key passed should be in '<url_part>/<file_name>' format
  static uploadFile(file, key) {

    const s3_details = ConstantsService.getS3Details();

    return new Promise((resolve, error) => {

      // Define the S3 Bucket
      const bucket = new S3({
        accessKeyId: s3_details.ACCESS_KEY_ID,
        secretAccessKey: s3_details.SECRET_ACCESS_KEY,
        region: s3_details.S3_REGION
      });

      // Define the file details
      const params = {
        Bucket: s3_details.BUCKET,
        Key: key,
        Body: file,
        ACL: 'public-read'
      };

      // Finally upload - If the key already exists, the image will get overwritten
      bucket.upload(params, function(err, data){
        if (err) {
          console.log('There was an error uploading your file: ', err);
          error(err);
        } else {
          console.log('Successfully uploaded file.', data);
          resolve(data);
        }
      });
    });

  }

  // Function to delete the image from the bucket
  static deleteObject(key) {

    // No need to return promise since it doesn't matter even if the file is not deleted

    const s3_details = ConstantsService.getS3Details();

    // Define bucket / S3
    const bucket = new S3({
      accessKeyId: s3_details.ACCESS_KEY_ID,
      secretAccessKey: s3_details.SECRET_ACCESS_KEY,
      region: s3_details.S3_REGION
    });

    // Define file details
    const params = {
      Bucket: s3_details.BUCKET,
      Key: key
    };

    // Finally delete the object
    bucket.deleteObject(params, function(err, data){
      if (err && isDevMode()) {
        console.log('There was an error deleting your file: ', err);
        return false;
      } else {
        return true;
      }
    });


  }

}
