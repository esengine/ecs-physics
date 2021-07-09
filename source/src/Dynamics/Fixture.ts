module physics {
    export enum Category {
        none = 0,
        all = Number.MAX_VALUE,
        cat1 = 1,
        cat2 = 2,
        cat3 = 4,
        cat4 = 8,
        cat5 = 16,
        cat6 = 32,
        cat7 = 64,
        cat8 = 128,
        cat9 = 256,
        cat10 = 512,
        cat11 = 1024,
        cat12 = 2048,
        cat13 = 4096,
        cat14 = 8192,
        cat15 = 16384,
        cat16 = 32768,
        cat17 = 65536,
        cat18 = 131072,
        cat19 = 262144,
        cat20 = 524288,
        cat21 = 1048576,
        cat22 = 2097152,
        cat23 = 4194304,
        cat24 = 8388608,
        cat25 = 16777216,
        cat26 = 33554432,
        cat27 = 67108864,
        cat28 = 134217728,
        cat29 = 268435456,
        cat30 = 536870912,
        cat31 = 1073741824
    }

    /**
     * 该代理在内部用于将Fixture连接到广相
     */
    export class FixtureProxy {
        public aabb: AABB;
        public childIndex: number;
        public fixture: Fixture;
        public proxyId: number;
    }

    /**
     * Fixture用于将Shape附加到主体以进行碰撞检测。 
     * Fixture从其父级继承其变换。 Fixture包含其他非几何数据，例如摩擦，碰撞过滤器等。
     * Fixture是通过Body.CreateFixture创建的。
     *  警告：您不能重复使用Fixture。 
     */
    export class Fixture {
        public proxies: FixtureProxy[];
        public proxyCount: number;
        public ignoreCCDWith: Category;

        /**
         * 默认为0
         * 如果Settings.useFPECollisionCategories设置为false：
         * 碰撞组允许某个对象组从不碰撞（负向）或始终碰撞（正向）。
         * 零表示没有碰撞组。 非零组过滤始终会赢得掩码位。
         * 如果Settings.useFPECollisionCategories设置为true：
         * 如果2个fixture在同一个碰撞组中，它们将不会发生碰撞。 
         */
        public set collisionGroup(value: number) {
            if (this._collisionGroup == value)
                return;

            this._collisionGroup = value;
            this.refilter();
        }

        public get collisionGroup() {
            return this._collisionGroup;
        }

        /**
         * 默认为Category.All
         * 
         * 碰撞掩码位。 
         * 这说明了该灯具将接受碰撞的类别。 
         * 使用Settings.UseFPECollisionCategories更改行为。 
         */
        public get collidesWith() {
            return this._collidesWith;
        }

        public set collidesWith(value: Category) {
            if (this._collidesWith == value)
                return;

            this._collidesWith = value;
            this.refilter();
        }

        /**
         * 此设备属于碰撞类别。
         * 如果Settings.UseFPECollisionCategories设置为false：
         * 默认设置为Category.Cat1
         * 
         * 如果Settings.UseFPECollisionCategories设置为true：
         * 默认设置为Category.All 
         */
        public get collisionCategories() {
            return this._collisonCategories;
        }

        public set collisionCategories(value: Category) {
            if (this._collisonCategories == value)
                return;

            this._collisonCategories = value;
            this.refilter();
        }
        
        /**
         * 得到子形状。 
         * 您可以修改子Shape，但是不应更改顶点数，因为这会使某些碰撞缓存机制崩溃
         */
        public shape: Shape;

        /**
         * 获取或设置一个值，该值指示此灯具是否是传感器
         */
        public get isSensor() {
            return this._isSensor;
        }

        public set isSensor(value: boolean) {
            if (this.body != null)
                this.body.isAwake = true;
            
            this._isSensor = value;
        }

        /**
         * 获取此fixture的父实体。 如果未连接fixture，则为null。 
         */
        public body: Body;

        /**
         * 设置用户数据。 使用它来存储您的应用程序特定的数据
         */
        public userData: any;

        /**
         * 设置摩擦系数。 这将不会改变现有触点的摩擦
         */
        public get friction() {
            return this._friction;
        }

        public set friction(value: number) {
            console.assert(!Number.isNaN(value));
            this._friction = value;
        }

        /**
         * 设置恢复系数
         */
        public get restitution() {
            return this._restitution;
        }

        public set restitution(value: number) {
            console.assert(!Number.isNaN(value));
            this._restitution = value;
        }

        public fixtureId: number;

        /**
         * 两种形状发生碰撞并解决后便会触发。
         */
        public afterCollision: afterCollisionEventHandler[];
        /**
         * 当两个fixture彼此靠近时触发。 
         * 由于广义相的工作方式，因此使用AABB近似形状时可能会非常不准确
         */
        public beforeCollision: beforeCollisionEventHandler[];
        /**
         * 当两个形状发生碰撞并在它们之间创建接触时触发。
         * 注意：第一个fixture参数始终是代表所预订的fixture。 
         */
        public onCollision: onCollisionEventHandler[];
        /**
         * 当两个形状分开并且它们之间的接触被移除时触发。 
         * 注意：由于fixture可以有多个触点，因此在某些情况下可以多次调用。 
         * 注意：第一个fixture参数始终是代表所预订的fixture
         */
        public onSeperation: onSeperationEventHandler[];

        static _fixtureIdCounter: number;
        _isSensor: boolean;
        _friction: number;
        _restitution: number;

        public _collidesWith: Category;
        public _collisonCategories: Category;
        public _collisionGroup: number;
        public _colisionIgnores: Set<number>;

        constructor(body?: Body, shape?: Shape, userData = null){
            this.body = body;
            this.userData = userData;
            this.shape = shape.clone();

            this.fixtureId = Fixture._fixtureIdCounter ++;

            this._collisonCategories = Settings.defaultFixtureCollisionCategories;
            this._collidesWith = Settings.defaultFixtureCollidesWith;
            this._collisionGroup = 0;
            this._colisionIgnores = new Set();

            this.ignoreCCDWith = Settings.defaultFixtureIgnoreCCDWith;

            this.friction = 0.2;
            this.restitution = 0;
        }

        public isDisposed: boolean;

        public dispose() {
            if (!this.isDisposed) {
                // this.body.de
                // TODO: destoryFixture
            }
        }

        /**
         * 恢复此fixture与提供的fixture之间的碰撞
         * @param fixture 
         */
        public restoreCollisionWith(fixture: Fixture) {
            if (this._colisionIgnores.has(fixture.fixtureId)) {
                this._colisionIgnores.delete(fixture.fixtureId);
                this.refilter();
            }
        }

        /**
         * 忽略此fixture与提供的fixture之间的碰撞
         * @param fixture 
         */
        public ignoreCollisionWith(fixture: Fixture) {
            if (!this._colisionIgnores.has(fixture.fixtureId)) {
                this._colisionIgnores.add(fixture.fixtureId);
                this.refilter();
            }
        }

        /**
         * 确定是否忽略此Fixture与提供的Fixture之间的碰撞
         * @param fixture 
         * @returns 
         */
        public isFixtureIgnored(fixture: Fixture) {
            return this._colisionIgnores.has(fixture.fixtureId);
        }

        /**
         * contact是持久性的，除非标记为进行过滤，否则它们将保持持久性。 
         * 此方法标记与主体关联的所有contact以进行过滤
         */
        refilter() {
            // 标记关联的contact以进行过滤
            let edge = this.body.contactList;
            while (edge != null) {
                let contact = edge.contact;
                let fixtureA = contact.fixtureA;
                let fixtureB = contact.fixtureB;
                if (fixtureA == this || fixtureB == this) {
                    contact.filterFlag = true;
                }

                edge = edge.next;
            }

            let world = this.body._world;

            if (world == null) {
                return;
            }

            let broadPhase = world.contactManager.broadPhase;
            // for (let i = 0; i < this.proxyCount; ++ i)
                // broadPhase
            // TODO: touchProxy
        }

        registerFixture() {
            this.proxies = [];
            this.proxyCount = 0;

            if (this.body.enabled) {
                let broadPhase = this.body._world.contactManager.broadPhase;
                this.cre
            }
        }

        public createProxies(broadPhase: DynamicTreeBroadPhase, xf: Transform) {
            console.assert(this.proxyCount == 0);

            this.proxyCount = this.shape.childCount;

            for (let i = 0; i < this.proxyCount; ++ i) {
                let proxy = new FixtureProxy();
                this.shape.computeAABB(proxy.aabb, xf, i);
                proxy.fixture = this;
                proxy.childIndex = i;

                proxy.proxyId = broadPhase.addProxy(proxy);

                this.proxies[i] = proxy;
            }
        }

        public destroyProxies(broadPhase: DynamicTreeBroadPhase) {
            for (let i = 0; i < this.proxyCount; ++ i) {
                broadPhase.remo
            }
        }
    }
}