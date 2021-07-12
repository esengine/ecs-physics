module physics {
    /**
     * 动态树中的节点。 客户端不直接与此交互
     */
    export class TreeNode {
        /**
         * 扩大AABB 
         */
        public aabb: AABB;

        public child1: number;
        public child2: number;

        public height: number;
        public parentOrNext: number;
        public userData: FixtureProxy;

        public isLeaf() {
            return this.child1 == DynamicTree.nullNode;
        }
    }

    /**
     * 动态树将数据排列在二叉树中，以加速诸如体积查询和射线投射之类的查询。 
     * 叶子是带有AABB的代理。 
     * 在树中，我们通过Settings.b2_fatAABBFactor扩展代理AABB，以便代理AABB大于客户端对象。 
     * 这允许客户端对象少量移动而不会触发树更新。
     * 节点是可合并和可重定位的，因此我们使用节点索引而不是指针。
     */
    export class DynamicTree {
        /**
         * 以O（N）时间计算二叉树的高度。 不应该经常调用。 
         */
        public get height() {
            if (this._root == DynamicTree.nullNode)
                return 0;

            return this._nodes[this._root].height;
        }

        /**
         * 获取节点面积与根面积之和的比值
         */
        public get areaRatio() {
            if (this._root == DynamicTree.nullNode)
                return 0;

            let root = this._nodes[this._root];
            let rootArea = root.aabb.perimeter;

            let totalArea = 0;
            for (let i = 0; i < this._nodeCapacity; ++ i) {
                let node = this._nodes[i];
                if (node.height < 0) {
                    continue;
                }

                totalArea += node.aabb.perimeter;
            }

            return totalArea / rootArea;
        }

        /**
         * 获取树中节点的最大余额。 平衡是节点的两个子节点的高度差。 
         */
        public get maxBalance() {
            let maxBalance = 0;
            for (let i = 0; i < this._nodeCapacity; ++ i) {
                let node = this._nodes[i];
                if (node.height <= 1)
                    continue;

                console.assert(node.isLeaf() == false);

                let child1 = node.child1;
                let child2 = node.child2;
                let balance = Math.abs(this._nodes[child2].height - this._nodes[child1].height);
                maxBalance = Math.max(maxBalance, balance);
            }

            return maxBalance;
        }

        _raycastStack: number[] = [];
        _queryStack: number[] = [];
        _freeList: number;
        _nodeCapacity: number;
        _nodeCount: number;
        _nodes: TreeNode[];
        _root: number;
        public static nullNode = -1;

        /**
         * 构造树将初始化节点池
         */
        constructor() {
            this._root = DynamicTree.nullNode;

            this._nodeCapacity = 16;
            this._nodeCount = 0;
            this._nodes = [];

            for (let i = 0; i < this._nodeCapacity - 1; ++ i ) {
                this._nodes[i] = new TreeNode();
                this._nodes[i].parentOrNext = i + 1;
                this._nodes[i].height = 1;
            }

            this._nodes[this._nodeCapacity - 1] = new TreeNode();
            this._nodes[this._nodeCapacity - 1].parentOrNext = DynamicTree.nullNode;
            this._nodes[this._nodeCapacity - 1].height = 1;
            this._freeList = 0;
        }

        /**
         * 在树中创建一个代理作为叶节点。 我们返回节点的索引而不是指针，以便我们可以增加节点池
         * @param aabb 
         * @param userData 
         */
        public addProxy(aabb: AABB, userData: FixtureProxy) {
            let proxyId = this.allocateNode();

            const r = new es.Vector2(Settings.aabbExtension, Settings.aabbExtension);
            this._nodes[proxyId].aabb.lowerBound = aabb.lowerBound.sub(r);
            this._nodes[proxyId].aabb.upperBound = aabb.upperBound.add(r);
            this._nodes[proxyId].userData = userData;
            this._nodes[proxyId].height = 0;

            this.insertLeaf(proxyId);

            return proxyId;
        }

        public removeProxy(proxyId: number) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            console.assert(this._nodes[proxyId].isLeaf());

            this.removeLeaf(proxyId);
            this.freeNode(proxyId);
        }

        public moveProxy(proxyId: number, aabb: AABB, displacement: es.Vector2) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            console.assert(this._nodes[proxyId].isLeaf());

            if (this._nodes[proxyId].aabb.contains(aabb)) {
                return false;
            }

            this.removeLeaf(proxyId);

            const b = aabb;
            const r = new es.Vector2(Settings.aabbExtension, Settings.aabbExtension);
            b.lowerBound = b.lowerBound.sub(r);
            b.upperBound = b.upperBound.add(r);

            const d = displacement.scale(Settings.aabbExtension);
            if (d.x < 0)
                b.lowerBound.x += d.x;
            else 
                b.upperBound.x += d.x;

            if (d.y < 0)
                b.lowerBound.y += d.y;
            else
                b.upperBound.y += d.y;

            this._nodes[proxyId].aabb = b;

            this.insertLeaf(proxyId);
            return true;
        }

        public getUserData(proxyId: number) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            return this._nodes[proxyId].userData;
        }

        public getFatAABB(proxyId: number) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            const fatAABB = this._nodes[proxyId].aabb;
            return fatAABB;
        }

        allocateNode(): number {
            if (this._freeList == DynamicTree.nullNode) {
                console.assert(this._nodeCount == this._nodeCapacity);

                const oldNodes = this._nodes;
                this._nodeCapacity *= 2;
                this._nodes = oldNodes.slice(0, this._nodeCount);

                for (let i = this._nodeCount; i < this._nodeCapacity - 1; ++ i){
                    this._nodes[i] = new TreeNode();
                    this._nodes[i].parentOrNext = i + 1;
                    this._nodes[i].height = -1;
                }

                this._nodes[this._nodeCapacity - 1] = new TreeNode();
                this._nodes[this._nodeCapacity - 1].parentOrNext = DynamicTree.nullNode;
                this._nodes[this._nodeCapacity - 1].height = -1;
                this._freeList = this._nodeCount;
            }

            const nodeId = this._freeList;
            this._freeList = this._nodes[nodeId].parentOrNext;
            this._nodes[nodeId].parentOrNext = DynamicTree.nullNode;
            this._nodes[nodeId].child1 = DynamicTree.nullNode;
            this._nodes[nodeId].child2 = DynamicTree.nullNode;
            this._nodes[nodeId].height = 0;
            this._nodes[nodeId].userData = new FixtureProxy();
            ++this._nodeCount;
            return nodeId;
        }

        freeNode(nodeId: number) {
            console.assert(0 <= nodeId && nodeId < this._nodeCapacity);
            console.assert(0 < this._nodeCount);
            this._nodes[nodeId].parentOrNext = this._freeList;
            this._nodes[nodeId].height = -1;
            this._freeList = nodeId;
            --this._nodeCount;
        }

        insertLeaf(leaf: number) {
            if (this._root == DynamicTree.nullNode) {
                this._root = leaf;
                this._nodes[this._root].parentOrNext = DynamicTree.nullNode;
                return;
            }

            const leafAABB = this._nodes[leaf].aabb;
            let index = this._root;
            while (this._nodes[index].isLeaf() == false) {
                const child1 = this._nodes[index].child1;
                const child2 = this._nodes[index].child2;

                const area = this._nodes[index].aabb.perimeter;

                const combinedAABB = new AABB();
                combinedAABB.combineT(this._nodes[index].aabb, leafAABB);
                const combinedArea = combinedAABB.perimeter;

                const cost = 2 * combinedArea;
                const inheritanceCost = 2 * (combinedArea - area);

                let cost1 = 0;
                if (this._nodes[child1].isLeaf()) {
                    const aabb = new AABB();
                    aabb.combineT(leafAABB, this._nodes[child1].aabb);
                    cost1 = aabb.perimeter + inheritanceCost;
                } else {
                    const aabb = new AABB();
                    aabb.combineT(leafAABB, this._nodes[child1].aabb);
                    const oldArea = this._nodes[child1].aabb.perimeter;
                    const newArea = aabb.perimeter;
                    cost1 = (newArea - oldArea) + inheritanceCost;
                }

                let cost2 = 0;
                if (this._nodes[child2].isLeaf()) {
                    const aabb = new AABB();
                    aabb.combineT(leafAABB, this._nodes[child2].aabb);
                    cost2 = aabb.perimeter + inheritanceCost;
                } else {
                    const aabb = new AABB();
                    aabb.combineT(leafAABB, this._nodes[child2].aabb);
                    const oldArea = this._nodes[child2].aabb.perimeter;
                    const newArea = aabb.perimeter;
                    cost2 = newArea - oldArea + inheritanceCost;
                }

                if (cost < cost1 && cost1 < cost2) {
                    break;
                }

                if (cost1 < cost2)
                    index = child1;
                else
                    index = child2;
            }

            const sibling = index;

            const oldParent = this._nodes[sibling].parentOrNext;
            const newParent = this.allocateNode();
            this._nodes[newParent].parentOrNext = oldParent;
            this._nodes[newParent].userData = new FixtureProxy();
            this._nodes[newParent].aabb.combineT(leafAABB, this._nodes[sibling].aabb);
            this._nodes[newParent].height = this._nodes[sibling].height + 1;

            if (oldParent != DynamicTree.nullNode) {
                if (this._nodes[oldParent].child1 == sibling) {
                    this._nodes[oldParent].child1 = newParent;
                } else {
                    this._nodes[oldParent].child2 = newParent;
                }

                this._nodes[newParent].child1 = sibling;
                this._nodes[newParent].child2 = leaf;
                this._nodes[sibling].parentOrNext = newParent;
                this._nodes[leaf].parentOrNext = newParent;
            } else {
                this._nodes[newParent].child1 = sibling;
                this._nodes[newParent].child2 = leaf;
                this._nodes[sibling].parentOrNext = newParent;
                this._nodes[leaf].parentOrNext = newParent;
                this._root = newParent;
            }

            index = this._nodes[leaf].parentOrNext;
            while (index != DynamicTree.nullNode) {
                index = this.balance(index);

                const child1 = this._nodes[index].child1;
                const child2 = this._nodes[index].child2;

                console.assert(child1 != DynamicTree.nullNode);
                console.assert(child2 != DynamicTree.nullNode);

                this._nodes[index].height = 1 + Math.max(this._nodes[child1].height, this._nodes[child2].height);
                this._nodes[index].aabb.combineT(this._nodes[child1].aabb, this._nodes[child2].aabb);

                index = this._nodes[index].parentOrNext;
            }
        }

        removeLeaf(leaf: number) {
            if (leaf == this._root) {
                this._root = DynamicTree.nullNode;
                return;
            }

            const parent = this._nodes[leaf].parentOrNext;
            const grandParent = this._nodes[parent].parentOrNext;
            let sibling = 0;
            if (this._nodes[parent].child1 == leaf) {
                sibling = this._nodes[parent].child2;
            } else {
                sibling = this._nodes[parent].child1;
            }

            if (grandParent != DynamicTree.nullNode) {
                if (this._nodes[grandParent].child1 == parent) {
                    this._nodes[grandParent].child1 = sibling;
                } else {
                    this._nodes[grandParent].child2 = sibling;
                }

                this._nodes[sibling].parentOrNext = grandParent;
                this.freeNode(parent);

                let index = grandParent;
                while (index != DynamicTree.nullNode) {
                    index = this.balance(index);

                    const child1 = this._nodes[index].child1;
                    const child2 = this._nodes[index].child2;

                    this._nodes[index].aabb.combineT(this._nodes[child1].aabb, this._nodes[child2].aabb);
                    this._nodes[index].height = 1 + Math.max(this._nodes[child1].height, this._nodes[child2].height);

                    index = this._nodes[index].parentOrNext;
                }
            } else {
                this._root = sibling;
                this._nodes[sibling].parentOrNext = DynamicTree.nullNode;
                this.freeNode(parent);
            }
        }

        balance(iA: number): number {
            console.assert(iA != DynamicTree.nullNode);

            const A = this._nodes[iA];
            if (A.isLeaf() || A.height < 2)
                return iA;

            const iB = A.child1;
            const iC = A.child2;
            console.assert(0 <= iB && iB < this._nodeCapacity);
            console.assert(0 <= iC && iC < this._nodeCapacity);

            const B = this._nodes[iB];
            const C = this._nodes[iC];

            const balance = C.height - B.height;

            if (balance > 1) {
                const iF = C.child1;
                const iG = C.child2;
                const F = this._nodes[iF];
                const G = this._nodes[iG];
                console.assert(0 <= iF && iF < this._nodeCapacity);
                console.assert(0 <= iG && iG < this._nodeCapacity);

                C.child1 = iA;
                C.parentOrNext = A.parentOrNext;
                A.parentOrNext = iC;

                if (C.parentOrNext != DynamicTree.nullNode) {
                    if (this._nodes[C.parentOrNext].child1 == iA) {
                        this._nodes[C.parentOrNext].child1 = iC;
                    } else {
                        console.assert(this._nodes[C.parentOrNext].child2 == iA);
                        this._nodes[C.parentOrNext].child2 = iC;
                    }
                } else {
                    this._root = iC;
                }

                if (F.height > G.height) {
                    C.child2 = iF;
                    A.child2 = iG;
                    G.parentOrNext = iA;
                    A.aabb.combineT(B.aabb, G.aabb);
                    C.aabb.combineT(A.aabb, F.aabb);

                    A.height = 1 + Math.max(B.height, G.height);
                    C.height = 1 + Math.max(A.height, F.height);
                } else {
                    C.child2 = iG;
                    A.child2 = iF;
                    F.parentOrNext = iA;
                    A.aabb.combineT(B.aabb, F.aabb);
                    C.aabb.combineT(A.aabb, G.aabb);

                    A.height = 1 + Math.max(B.height, F.height);
                    C.height = 1 + Math.max(A.height, G.height);
                }

                return iC;
            }
        }
    }
}