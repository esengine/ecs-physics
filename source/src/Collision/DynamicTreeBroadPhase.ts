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
            this._tree.
        }

        bufferMove(proxyId: number) {
            if (this._moveCount == this._moveCapacity) {
                let oldBuffer = this._moveCapacity
            }
        }

        unBufferMove(proxyId: number) {
            for (let i = 0; i < this._moveCount; ++i){
                if (this._move)
            }
        }

        queryCallback(proxyId: number): boolean {
            if (proxyId == this._queryProxyId)
                return true;

            if (this._pair)
        }
    }
}