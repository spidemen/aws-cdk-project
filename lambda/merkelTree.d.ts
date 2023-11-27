export declare class Node {
    index: number;
    level: number;
    offset: number;
    hashVal: string;
    parent: Node;
    leftChild: Node;
    rightChild: Node;
    isLeave: boolean;
    private hash;
    constructor(index: number, level: number, offset: number);
    ComputeHashVal(): string;
}
export declare class MerkelTree {
    static instance: MerkelTree;
    private indexMp;
    private constructor();
    root: Node;
    static getInstance(): MerkelTree;
    buildTree(treeData: string): Node;
    query(index: number): Node;
}
