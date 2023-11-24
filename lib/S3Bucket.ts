import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import { GetObjectCommand, GetObjectCommandOutput , S3Client} from '@aws-sdk/client-s3'

import { Construct } from 'constructs';
import { MerkeleTreeBucket,MerkeleTreeRootKey } from '../utils/constants';
import { treeData } from '../data/treeInitData';
import { MerkelTree } from '../lambda/merkelTree';
export class S3Bucket extends Construct {

  /** allows accessing the Bucket == */
  public readonly bucket: s3.Bucket;

  public client: S3Client
  constructor(scope: Construct, id: string, props ?: cdk.StackProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, MerkeleTreeBucket, {
        bucketName: MerkeleTreeBucket,
        publicReadAccess: false,
        versioned: true,
    });

     new s3deploy.BucketDeployment(this, MerkeleTreeBucket+'deploy', {
      sources: [s3deploy.Source.data(MerkeleTreeRootKey, treeData)],
      destinationBucket: bucket,
    });

    this.client = new S3Client({});
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
         console.log(str);
      }
    } catch (err) {
      console.error(err);
    }

    // bucketName is treeData, later if have time, will use json file to load
    // tree data
     MerkelTree.getInstance().buildTree(treeData);
  }
}