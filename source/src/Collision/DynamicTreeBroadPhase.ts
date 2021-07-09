module physics {
    class Pair {
        public proxyIdA: number = 0;
        public proxyIdB: number = 0;
    
        public compareTo(other: Pair) {
            if (this.proxyIdA < other.proxyIdA) {
                return -1;
            }
    
            if (this.proxyIdA == other.proxyIdA) {
                if (this.proxyIdB < other.proxyIdB) {
                    return -1;
                }
    
                if (this.proxyIdB == other.proxyIdB) {
                    return 0;
                }
            }
    
            return 1;
        }
    }

    /**
     * 广义阶段用于计算对并执行体积查询和射线投射。 
     * 这个广义阶段不会持久存在对。 
     * 相反，这会报告潜在的新对。 
     * 客户端可以使用新的对并跟踪后续的重叠。 
     */
    export class DynamicTreeBroadPhase {
        public get proxyCount() {
            return this._proxyCount;
        }

        public get treeQuality() {
            return this._tree.areaRatio;
        }

        public get treeBalance() {
            return this._tree.maxBalance;
        }

        public get treeHeight() {
            return this._tree.height;
        }

        static readonly nullProxy = -1;
        _moveBuffer: number[];
        _moveCapacity: number = 0;
        _moveCount: number = 0;

        _pairBuffer: Pair[];
        _pairCapacity: number = 0;
        _pairCount: number = 0;
        _proxyCount: number = 0;
        _queryCallback: (id: number)=>boolean;
        _queryProxyId: number = 0;
        _tree: DynamicTree = new DynamicTree();

        constructor() {
            this._queryCallback = this.queryCallback;
            this._proxyCount = 0;
            
            this._pairCapacity = 16;
            this._pairCount = 0;
            this._pairBuffer = [];
            
            this._moveCapacity = 16;
            this._moveCount = 0;
            this._moveBuffer = [];
        }

        public addProxy(proxy: FixtureProxy){
            let proxyId = this._tree.addProxy(proxy.aabb, proxy);
            ++this._proxyCount;
            this.bufferMove(proxyId);
            return proxyId;
        }

        public removeProxy(proxyId: number) {
            this.unBufferMove(proxyId);
            --this._proxyCount;
            this._tree.removeProxy(proxyId);
        }
        
        public touchProxy(proxyId: number) {
            this.bufferMove(proxyId);
        }

        bufferMove(proxyId: number) {
            if (this._moveCount == this._moveCapacity) {
                const oldBuffer = this._moveBuffer;
                this._moveCapacity *= 2;
                this._moveBuffer = oldBuffer.slice(0, this._moveCount);
            }

            this._moveBuffer[this._moveCount] = proxyId;
            ++ this._moveCount;
        }

        unBufferMove(proxyId: number) {
            for (let i = 0; i < this._moveCount; ++i){
                if (this._moveBuffer[i] == proxyId)
                    this._moveBuffer[i] = DynamicTree.nullNode;
            }
        }

        queryCallback(proxyId: number): boolean {
            if (proxyId == this._queryProxyId)
                return true;

            if (this._pairCount == this._pairCapacity) {
                const oldBuffer = this._pairBuffer;
                this._pairCapacity *= 2;
                this._pairBuffer = oldBuffer.slice(0, this._pairCount);
            }

            this._pairBuffer[this._pairCount].proxyIdA = Math.min(proxyId, this._queryProxyId);
            this._pairBuffer[this._pairCount].proxyIdB = Math.max(proxyId, this._queryProxyId);
            ++ this._pairCount;

            return true;
        }

        public getProxy(proxyId: number) {
            return this._tree.getUserData(proxyId);
        }

        public testOverlap(proxyIdA: number, proxyIdB: number) {
            const aabbA = this._tree.getFatAABB(proxyIdA);
            const aabbB = this._tree.getFatAABB(proxyIdB);
            return AABB.testOverlap(aabbA, aabbB);
        }
    }
}