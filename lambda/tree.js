
const { MerkelTree } = require('./merkelTree.js')
const AWS = require('aws-sdk');

const MissQueyParameterError = new Error("miss query parameter")
const RETRIVE_ENDPOINT = "retrieve"
const MerkeleTreeBucket = "binary-merkele-tree"
const MerkeleTreeRootKey = "root-hash"
const treeData = "[0,0,0]&[1,1,0]&[2,1,1]&[3,2,0]&[4,2,1]&[5,2,2&[6,2,3]";

exports.handler = async function (event) {
    try {

        const method = event.httpMethod;
        // Get endpoint 
        const pathName = event.path.startsWith('/') ? event.path.substring(1) : event.path;
        if (method == "GET") {
            if (pathName == RETRIVE_ENDPOINT) {
                let index = event.queryStringParameters.index;
                if (index != undefined) {
                    // get node hash value
                    var node = MerkelTree.getInstance().query(index);
                    if (node != undefined) {
                        if (node.index == -1) {
                            // tree is not yet load from S3, start to load tree
                            const s3 = new AWS.S3();
                            var params = {
                                Bucket: MerkeleTreeBucket,
                                Key: MerkeleTreeRootKey
                            };
                            try {
                                const data = await s3.getObject(params).promise();
                                console.log('tree data:' + JSON.stringify(data));
                                MerkelTree.getInstance().buildTree(JSON.stringify(data));
                                node = MerkelTree.getInstance().query(index);
                            } catch (err) {
                                console.log(err);
                                MerkelTree.getInstance().buildTree(treeData);
                                node = MerkelTree.getInstance().query(index);
                            }
                        }
                        let reponseJson = {
                            offset: node.offset,
                            index: node.index,
                            value: node.hashVal
                        };
                        return {
                            statusCode: 200,
                            headers: {},
                            body: JSON.stringify(reponseJson)
                        };
                    } else {
                        return {
                            statusCode: 200,
                            headers: {},
                            body: "not exit in merkel tree"
                        };
                    }
                } else {
                    // miss index paramater 
                    return {
                        statusCode: 422,
                        headers: {},
                        body: MissQueyParameterError.toString()
                    };
                }
            }
        }
        // not define endpoint , return 404 
        return {
            statusCode: 404,
            headers: {},
            body: "endpoint not define"
        };

    } catch (error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
            statusCode: 400,
            headers: {},
            body: body
        }
    }
};

