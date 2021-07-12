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
        public get proxyCount() {
            return this.contactManager.broadPhase.proxyCount;
        }

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

        _queryAABBCallback: (fixture: Fixture) => boolean;
        _queryAABBCallbackWrpper: (a: number) => boolean;
        _rayCastCallback: (fixture: Fixture, a: es.Vector2, b: es.Vector2, c: number) => number;
        _rayCastCallbackWrapper: (input: RayCastInput, a: number) => number;

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

            this._queryAABBCallbackWrpper = this.queryAABBCallbackWrapper;
            this._rayCastCallbackWrapper = this.raycastCallbackWrapper;
            this.gravity = gravity;
        }

        public processChanges() {

        }

        public addBody(body: Body) {
            console.assert(!this._bodyAddList.has(body), "You are adding the same body more than once.");

            if (!this._bodyAddList.has(body))
                this._bodyAddList.add(body);
        }

        public removeBody(body: Body) {
            console.assert(!this._bodyRemoveList.has(body), "The body is already marked for removal. You are removing the body more than once.");

            if (!this._bodyRemoveList.has(body))
                this._bodyRemoveList.add(body);

            if (this.awakeBodySet.has(body))
                this.awakeBodySet.delete(body);
        }

        public addBreakableBody(breakableBody: BreakableBody) {
            this.breakableBodyList.push(breakableBody);
        }

        public removeBreakableBody(breakableBody: BreakableBody) {
            console.assert(this.breakableBodyList.indexOf(breakableBody) != -1);
            this.breakableBodyList.splice(this.breakableBodyList.indexOf(breakableBody), 1);
        }

        queryAABBCallbackWrapper(proxyId: number) {
            let proxy = this.contactManager.broadPhase.getProxy(proxyId);
            return this._queryAABBCallback(proxy.fixture);
        }

        raycastCallbackWrapper(rayCastInput: RayCastInput, proxyId: number): number {
            const proxy = this.contactManager.broadPhase.getProxy(proxyId);
            const fixture = proxy.fixture;
            const index = proxy.childIndex;
            let output: RayCastOutput;
            const hit = fixture.rayCast(output, rayCastInput, index);

            if (hit) {
                const fraction = output.fraction;
                const point = rayCastInput.point1.scale(1 - fraction).add(rayCastInput.point2.scale(fraction));
                return this._rayCastCallback(fixture, point, output.normal, fraction);
            }

            return rayCastInput.maxFraction;
        }

        public step(dt: number) {
            if (!this.enabled)
                return;

            if (Settings.enableDiagnostics)
                this._watch.start();

            this.processChanges();

            if (Settings.enableDiagnostics)
                this.addRemoveTime = this._watch.getTime();

            if (this._worldHasNewFixture) {
                this.contactManager.findNewContacts();
                this._worldHasNewFixture = false;
            }

            if (Settings.enableDiagnostics)
                this.newContactsTime = this._watch.getTime() - this.addRemoveTime;

            let step: TimeStep = new TimeStep();
            step.inv_dt = dt > 0 ? 1 / dt : 0;
            step.dt = dt;
            step.dtRatio = this._invDt0 * dt;

            for (let i = 0; i < this.controllerList.length; i ++)
                this.controllerList[i].update(dt);

            if (Settings.enableDiagnostics)
                this.controllersUpdateTime = this._watch.getTime() - (this.addRemoveTime + this.newContactsTime);

            this.contactManager.collide();

            if (Settings.enableDiagnostics)
                this.ContactsUpdateTime = this._watch.getTime() - (this.addRemoveTime + this.newContactsTime + this.controllersUpdateTime);

            // TODO: solve
        }

        public clear() {
            this.processChanges();
        }
    }
}
