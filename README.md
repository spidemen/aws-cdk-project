# Welcome to your Merkel Tree TypeScript project


## API

# Get request to retrieve tree node data
Endpoint:  retrieve 
Path param:  index -- the index of node

example:  curl 'https://8l1c2dtfn7.execute-api.ap-northeast-1.amazonaws.com/prod/retrieve?index=1'


## Get Start

1. set your aws account
2. create access key 
3. install aws-cli on your local machine
4. config aws configure and put your access key
5. install node and cdk in your machine
6. git clone git@github.com:spidemen/aws-cdk-project.git
7. cd aws-cdk-project
8. cd lambda && npm install 
8. cd ../ && cdk bootstrap
9.  cdk synth
10. cdk deploy 

once you finish test, then you can run  `cdk destroy`


Once finish deploy, feel free to go to your aws account to check, is everything correct created.

## local merkel tree teset

we can use merkel tree metadata to test and load it.

and then run command `npm run test`. 


## tech consideration   

since I do not have too much time, so I just finish most of part, like upload S3 tree file meta data and create api gate and other aws resource.

storage:  I use S3 bucket since the tree is not frequenctly change, so we dynamic update tree by schedule a cron job like every one minutes, on the other side
it can push merkel tree data to S3 like every day or every hours.

Scale:  1. tree storage: S3 is good to handle big data store, the only need to optimize the code for dynamic load and update tree in memory.
        2. QPS: every query retrive data from memory, so it would be super fast. 


something to improve: get S3 bucket data and some typescript stuffs. I am not so profession in typescription.

build tree: tree construct is based on metadata.  



## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
