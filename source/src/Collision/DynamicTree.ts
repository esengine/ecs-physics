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
            // let proxyId = 
        }
    }
}