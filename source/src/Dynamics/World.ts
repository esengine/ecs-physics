module physics {
    /**
     * 管理着所有物理实体，动态仿真和异步查询
     */
    export class World {
        public controllerList: Controller[];
        public breakableBodyList: BreakableBody[];
        public updateTime: number;
        public continuousPhysicsTime: number;
        public controllersUpdateTime: number;
        public addRemoveTime: number;
        public newContactsTime: number;
        public ContactsUpdateTime: number;
        public solveUpdateTime: number;

        /**
         * 获取广相代理的数量
         */
        // public get proxyCount() {
        //     return this.contactManager.broadPhase.proxyCount;
        // }

        /**
         * 更改全局重力向量
         */
        public gravity: es.Vector2;

        /**
         * 获取contact管理器进行测试
         */
        public contactManager: ContactManager;
        
        /**
         * 获取世界身体列表
         */
        public bodyList: Body[];

        public awakeBodySet: Set<Body>;
        awakeBodyList: Body[];

        islandSet: Set<Body>;

        TOISet: Set<Body>;

        public jointList: Joint[];
        /**
         * 获取世界contact列表。 
         * 对于返回的contact，请使用Contact.GetNext获取世界列表中的下一个contact。 
         * 空contact表示列表的末尾。 
         */
        public get contactList() {
            return this.contactManager.contactList;
        }

        /**
         * 如果为假，则整个模拟停止。 它仍然处理添加和删除的几何图形
         */
        public enabled: boolean;

        public island: Island;

        _tempOverlapCircle: CircleShape = new CircleShape();

        public onBodyAdded: bodyDelegate[];
        public onBodyRemoved: bodyDelegate[];
        public onFixtureAdded: fixtureDelegate[];
        public onFixtureRemoved: fixtureDelegate[];
        public onJointAdded: jointDelegate[];
        public onJointRemoved: jointDelegate[];
        public onControllerAdded: controllerDelegate[];
        public onControllerRemoved: controllerDelegate[];

        _invDt0: number;
        _stack: Body[] = [];
        _stepComplete: boolean;
        _bodyAddList: Set<Body> = new Set();
        _bodyRemoveList: Set<Body> = new Set();
        _jointAddList: Set<Joint> = new Set();
        _jointRemoveList: Set<Joint> = new Set();

        _queryAABBCallback: (fixture: Fixture, r: boolean) => void;
        _queryAABBCallbackWrpper: (a: number, r: boolean) => void;
        _rayCastCallback: (fixture: Fixture, a: es.Vector2, b: es.Vector2, c: number, d: number) => void;
        _rayCastCallbackWrapper: (input: RayCastInput, a: number, b: number) => void;

        _input: TOIInput = new TOIInput();
        _myFixture: Fixture;
        _point1: es.Vector2;
        _point2: es.Vector2;
        _testPointAllFixtures: Fixture[];
        _watch: es.Stopwatch = new es.Stopwatch();
        
        public _contactPool: Contact[] = [];
        public _worldHasNewFixture: boolean;

        constructor(gravity: es.Vector2) {
            this.island = new Island();
            this.enabled = true;
            this.controllerList = [];
            this.breakableBodyList = [];
            this.bodyList = [];
            this.jointList = [];

            this.awakeBodySet = new Set();
            this.awakeBodyList = [];

            this.islandSet = new Set();
            
            this.TOISet = new Set();

            // this._queryAABBCallbackWrpper = this.queryAABBCallbackWrapper;
            this.gravity = gravity;
        }

        queryAABBCallbackWrapper(proxyId: number) {
            // let proxy = this.contactManager.broadPhase.
            // TODO getProxy\
        }
    }
}
