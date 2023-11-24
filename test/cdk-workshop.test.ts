import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as CdkWorkshop from '../lib/cdk-workshop-stack';

test('SQS Queue and SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

 
  // Assert it creates the function with the correct properties...
  template.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "hello.handler",
    Runtime: "nodejs16.x",
  });

});
