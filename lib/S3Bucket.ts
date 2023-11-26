import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import { GetObjectCommand, GetBucketLocationCommand, S3Client } from '@aws-sdk/client-s3'

import { Construct } from 'constructs';
import { MerkeleTreeBucket, MerkeleTreeRootKey } from '../utils/constants';
import { treeData } from '../data/treeInitData';
import { MerkelTree } from '../lambda/merkelTree';
export class S3Bucket extends Construct {

  /** allows accessing the Bucket == */
  public readonly bucket: s3.Bucket;

  public client: S3Client


  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    this.client = new S3Client({});
    
    this.checkBucket();
    

  }

  public async checkBucket() {

    const input = {
      "Bucket": MerkeleTreeBucket
    };
    const command = new GetBucketLocationCommand(input);
    try {
      const response = await this.client.send(command);
      console.log('find bucket success code :' + response.$metadata.httpStatusCode);
    } catch (err) {
      console.log('error not exit bucket error, create bucket and upload meta data in cdk...... ');
      const bucket = new s3.Bucket(this, MerkeleTreeBucket, {
        bucketName: MerkeleTreeBucket,
        publicReadAccess: true,
        versioned: true,
      });

      new s3deploy.BucketDeployment(this, MerkeleTreeBucket + 'deploy', {
        sources: [s3deploy.Source.data(MerkeleTreeRootKey, treeData)],
        destinationBucket: bucket,
      });
      console.error(err);
    }

  }

  public async loadMerkelTree() {

    const command = new GetObjectCommand({
      Bucket: MerkeleTreeBucket,
      Key: MerkeleTreeRootKey,
    });

    try {
      const response = await this.client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      if (response.Body != undefined) {
        const str = await response.Body.transformToString();
        MerkelTree.getInstance().buildTree(str);
        console.log(str);
      }
    } catch (err) {
      console.log('there is no merkel tree bucket on S3, cannot build tree in memory');
      console.error(err);
    }
  }
}