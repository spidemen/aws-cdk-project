
import {expect, test} from '@jest/globals';
import { MerkelTree, Node } from '../lambda/merkelTree';
import { treeData } from '../data/treeInitData';


/*    meta data tree
       index                          level
          0                          -- 0 
    1             2                  -- 1
3      4      5      6               -- 2

*/

test('merkel tree build with meta data', () => {
    
  let root = MerkelTree.getInstance().buildTree(treeData);
  expect(root.hashVal.length).toBe(64);
  expect(root.index).toBe(0);
  expect(root.offset).toBe(0);

});

test('merkel tree query leave', () => {
    
    MerkelTree.getInstance().buildTree(treeData);
    let node = MerkelTree.getInstance().query(3);
    expect(node.hashVal.length).toBe(64);
    expect(node.index).toBe(3);
    expect(node.offset).toBe(0);
    expect(node.isLeave).toBe(true);


    node = MerkelTree.getInstance().query(6);
    expect(node.hashVal.length).toBe(64);
    expect(node.index).toBe(6);
    expect(node.offset).toBe(3);
    expect(node.isLeave).toBe(true);


});

test('merkel tree query no leave', () => {
    
    MerkelTree.getInstance().buildTree(treeData);
    let node = MerkelTree.getInstance().query(1);
    expect(node.hashVal.length).toBe(64);
    expect(node.index).toBe(1);
    expect(node.offset).toBe(0);
    expect(node.isLeave).toBe(false);

    node = MerkelTree.getInstance().query(2);
    expect(node.hashVal.length).toBe(64);
    expect(node.index).toBe(2);
    expect(node.offset).toBe(1);
    expect(node.isLeave).toBe(false);

});

test('merkel tree query no exit', () => {
    
    MerkelTree.getInstance().buildTree(treeData);
    let node = MerkelTree.getInstance().query(8);
    expect(node.hashVal.length).toBe(0);
    expect(node.index).toBe(-1);
    expect(node.offset).toBe(-1);
    expect(node.isLeave).toBe(false);

    node = MerkelTree.getInstance().query(-1);
    expect(node.hashVal.length).toBe(0);
    expect(node.index).toBe(-1);
    expect(node.offset).toBe(-1);
    expect(node.isLeave).toBe(false);


});