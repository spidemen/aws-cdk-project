import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { S3Bucket } from './S3Bucket';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const tree = new lambda.Function(this, 'TreeHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'tree.handler',                // file is "tree", function is "handler",
    });

    const S3Object = new S3Bucket(this, 'MerkelTree');
   // S3Object.loadMerkelTree();  this should be done in lambda function
  
     // defines an API Gateway REST API resource backed by our "tree" function.
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: tree
    });

  }
}
