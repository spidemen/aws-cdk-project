
const { Keccak } = require('sha3');

export class Node {
    public index: number;
    public level: number;
    public offset: number;
    public hashVal: string;

    public parent: Node;
    public leftChild: Node;
    public rightChild: Node;
    public isLeave: boolean;

    private  hash = new Keccak(256);


    constructor (index:number, level: number, offset: number) {
        this.index = index;
        this.level = level;
        this.offset = offset;
        this.isLeave = false;
        this.hashVal = "";
    }

    public ComputeHashVal() {

        if (this.hashVal == "") {
            if (this.isLeave) {
                // index + level + offset will be unique in the tree
                // so use those three concrat string
                let nodeMetaData = String(this.index) + ":" + String(this.level) + ":" + String(this.offset);
                this.hash.update(nodeMetaData);
                this.hashVal = this.hash.digest('hex');
            } else {
                if (this.leftChild != undefined || this.rightChild != undefined) {
                    this.hash.update(this.leftChild.hashVal || this.rightChild.hashVal);
                    this.hashVal = this.hash.digest('hex');
                }
            }
        } 
        return this.hashVal;
    }
}

export class MerkelTree {
    public static instance: MerkelTree;
    
    // <index, Node object>
    private indexMp = new Map<number, Node>();

    private constructor() { }

    public root : Node;
    public static getInstance(): MerkelTree {
        if (!MerkelTree.instance) {
            MerkelTree.instance = new MerkelTree();
        }

        return MerkelTree.instance;
    }
    // by defition, deepest level nodes are all leave node
    // full binary tree, start contract from leave node all the way to root
    // level by level
    public buildTree(treeData: string) {
        let levelMp = new Map<number, Node[]>();
        let maxLevel = 0;
        let arr = treeData.split("&");    
        arr.forEach( (element) => {
            let nums = element.replace('[','').replace(']','').split(',');
            // input are always int 
            let level = Number(nums[1]);
            let node = new Node(Number(nums[0]),level, Number(nums[2]));
            if ( maxLevel < level) {
                maxLevel = level;
            }
            let nodeArr: Node[] = new Array();
            nodeArr.push(node);
            let nodeArr2 = levelMp.get(level);
            if (nodeArr2 == undefined) {
                levelMp.set(level, nodeArr);
            } else {
                let nodeArr3 = nodeArr2.concat(nodeArr);
                nodeArr3.sort(( a, b ) => (a.offset > b.offset ? 1 : -1)); 
                levelMp.set(level, nodeArr3);
            }
        });  
        
        // construct tree
        for (let i = maxLevel; i > 0; i--) {
            let rootNodes = levelMp.get(i-1);
            let childNodes = levelMp.get(i);
            rootNodes != undefined && rootNodes.forEach(root => {
                if (childNodes != undefined) {
                   root.leftChild =  childNodes[root.offset * 2];
                   root.rightChild =  childNodes[root.offset * 2 + 1];
                   if ( i  == maxLevel) {
                    // update leave node prop
                      root.leftChild.isLeave = true;
                      root.leftChild.ComputeHashVal();
                      this.indexMp.set(root.leftChild.index, root.leftChild);
                      if (root.rightChild != undefined) {
                        // not single leave
                        root.rightChild.isLeave = true;
                        root.rightChild.ComputeHashVal();
                        this.indexMp.set(root.rightChild.index, root.rightChild);
                      }
                   }

                 root.ComputeHashVal(); 
                 this.indexMp.set(root.index, root);
                } 
            });
        }
        let defaultRoot = this.indexMp.get(0);
        if (defaultRoot != undefined) {
           this.root = defaultRoot;
        } else {
            // create fake root
            this.root = new Node(-1,-1,-1);
        }
        
        // output whole tree
        console.log(this.root);
        return this.root;


    }

    public query (index: number) {
        let node = this.indexMp.get(index);
        if (node == undefined) {
            return new Node(-1,-1,-1);
        } 
        return node;
    }
}
