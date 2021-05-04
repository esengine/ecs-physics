module physics {
    /**
     * Body类型
     */
    export enum BodyType {
        /**
         * 零速度，可以手动移动。 注意：即使是静态物体也有质量
         */
        static,

        /**
         * 零质量，用户设定的非零速度，由求解器移动 
         */
        kinematic,

        /**
         * 正质量，由力确定的非零速度，由求解器移动 
         */
        dynamic
    }

    export class Body {
        public physicsLogicFilter: PhysicsLogicFilter;
        public controllerFilter: ControllerFilter;

        /**
         * 此主体的唯一ID
         */
        public bodyId: number;

        public islandIndex: number;
        /**
         * 缩放施加到此物体的重力。
         * 默认值为1。值2表示对该实体施加了两倍的重力。 
         */
        public gravityScale: number;

        public get world() {
            return this._world;
        }

        /**
         * 设置用户数据。 使用它来存储您的应用程序特定的数据
         */
        public userData: any;

        /**
         * 获取身体旋转的总数
         */
        public get revolutions() {
            return this.rotation / Math.PI;
        }

        /**
         * 获取或设置主体类型。
         * 警告：调用此中间更新可能会导致崩溃。
         */
        public get bodyType() {
            return this._bodyType;
        }

        public set bodyType(value: BodyType) {
            if (this._bodyType == value)
                return;

            this._bodyType = value;

        }

        /**
         * 获取或设置质心的线速度
         */
        public get linearVelocity() {
            return this._linearVelocity;
        }

        /**
         * 获取或设置质心的线速度
         */
        public set linearVelocity(value: es.Vector2) {
            console.assert(!Number.isNaN(value.x) && !Number.isNaN(value.y));

            if (this._bodyType == BodyType.static)
                return;

            if (es.Vector2.dot(value, value) > 0)
                this.isAwake = true;

            this._linearVelocity = value;
        }

        /**
         * 获取或设置角速度。 弧度/秒
         */
        public get angularVelocity() {
            return this._angularVelocity;
        }

        public set angularVelocity(value: number) {
            console.assert(!Number.isNaN(value));

            if (this._bodyType == BodyType.static)
                return;

            if (value * value > 0)
                this.isAwake = true;

            this._angularVelocity = value;
        }

        /**
         * 获取或设置线性阻尼
         */
        public get linearDamping() {
            return this._linearDamping;
        }

        public set linearDamping(value: number) {
            console.assert(!Number.isNaN(value));
            this._linearDamping = value;
        }

        /**
         * 获取或设置角度阻尼
         */
        public get angularDamping() {
            return this._angularDamping;
        }

        public set angularDamping(value: number) {
            console.assert(!Number.isNaN(value));
            this._angularDamping = value;
        } 

        /**
         * 获取或设置一个值，该值指示是否应将此主体包含在CCD求解器中
         */
        public isBullet: boolean;

        /**
         * 您可以禁用此身体上的睡眠。 如果禁用睡眠，身体将被唤醒
         */
        public get isSleepingAllowed() {
            return this._sleepingAllowed;
        }
        
        public set isSleepingAllowed(value: boolean) {
            if (!value)
                this.isAwake = true;

            this._sleepingAllowed = value;
        }
        
        /**
         * 设置身体的睡眠状态。 睡觉的身体具有非常低的CPU成本
         */
        public set isAwake(value: boolean) {
            if (value) {
                if (!this._awake){
                    this._sleepTime = 0;
                    // this._world.contactManager.u

                }
            }
        }

        public get isAwake() {
            return this._awake;
        }

        /**
         * 设置身体的活动状态。 不活动的物体不会被模拟，因此无法与之碰撞或唤醒。 
         * 如果传递true标记，则所有fixtures都将添加到广义阶段。 
         * 如果传递错误标志，则将从固定阶段移除所有Fixture，并销毁所有触点。 
         * Fixture和关节不受影响。 
         * 您可以继续在不活动的实体上创建/销毁Fixture和关节。
         * 处于非活动状态的实体的fixtures是隐式处于非活动状态的，并且不会参与碰撞，射线投射或查询。
         * 与处于非活动状态的实体连接的关节处于隐式处于非活动状态。 
         * 不活动的主体仍归b2World对象所有，并保留在主体列表中。 
         */
        public set enabled(value: boolean) {
            if (value == this._enabled)
                return;

            if (value) {
                let broadPhase = this._world.contactManager.broadPhase;
                // for (let i = 0; i < this.fixtureList.length; i ++)
                //     this.fixtureList[i].create

                // TODO: createProxies
            }
        }

        /**
         * 将此主体设置为固定旋转。 这导致质量被重置
         */
        public set fixedRotation(value: boolean) {
            if (this._fixedRotation == value)
                return;

            this._fixedRotation = value;

            this._angularVelocity = 0;
            // this.res
            // TODO: resetMassData
        }

        public get fixedRotation() {
            return this._fixedRotation;
        }

        /** 获取连接到此实体的所有Fixture */
        public fixtureList: Fixture[];

        /** 获取连接到该实体的所有关节的列表 */
        public jointList: JointEdge;

        public contactList: ContactEdge;

        /**
         * 获取世界原点位置
         */
        public get position() {
            return this._xf.p;
        }

        public set position(value: es.Vector2) {
            console.assert(!Number.isNaN(value.x) && !Number.isNaN(value.y));
            // this.setTra
            // TODO: setTransform
        }

        /**
         * 以显示单位获取/设置世界原点位置
         */
        public get displayPosition() {
            return es.Vector2.multiplyScaler(this._xf.p, FSConvert.simToDisplay);
        }

        public set displayPosition(value: es.Vector2) {
            this.position = es.Vector2.multiplyScaler(value, FSConvert.displayToSim);
        }

        public get rotation() {
            return this._sweep.a;
        }

        public set rotation(value: number) {
            console.assert(!Number.isNaN(value));
            // this.set
            // TODO: setTransform
        }

        /**
         * 获取或设置一个值，该值指示此主体是否为静态
         */
        public get isStatic() {
            return this._bodyType ==BodyType.static;
        }

        public set isStatic(value: boolean) {
            this.bodyType = value ? BodyType.static : BodyType.dynamic;
        }

        /**
         * 获取或设置一个值，该值指示此物体是否运动
         */
        public get isKinematic() {
            return this._bodyType == BodyType.kinematic;
        }

        public set isKinematic(value: boolean) {
            this.bodyType = value ? BodyType.kinematic : BodyType.dynamic;
        }

        /**
         * 获取或设置一个值，该值指示此主体是否为动态的
         */
        public get isDynamic() {
            return this._bodyType ==BodyType.dynamic;
        }

        public set isDynamic(value: boolean) {
            this.bodyType = value ? BodyType.dynamic : BodyType.kinematic;
        }

        /** 获取或设置一个值，该值指示此物体是否忽略重力 */
        public ignoreGravity: boolean;

        /** 获取质心的世界位置 */
        public get worldCenter() {
            return this._sweep.c;
        }

        /**
         * 获取质心的本地位置
         */
        public get localCenter() {
            return this._sweep.localCenter;
        }

        public set localCenter(value: es.Vector2) {
            if (this._bodyType != BodyType.dynamic)
                return;

            let oldCenter = this._sweep.c.clone();
            this._sweep.localCenter = value;
            this._sweep.c0 = this._sweep.c = MathUtils.mul_tv(this._xf, this._sweep.localCenter);

            let a = es.Vector2.subtract(this._sweep.c, oldCenter);
            this._linearVelocity.add(new es.Vector2(-this._angularVelocity * a.y, this._angularVelocity * a.x));
        }

        /**
         * 获取或设置质量。 通常以千克（kg）为单位
         */
        public get mass() {
            return this._mass;
        }

        public set mass(value: number) {
            console.assert(!Number.isNaN(value));

            if (this._bodyType != BodyType.dynamic)
                return;

            this._mass = value;

            if (this._mass <= 0)
                this._mass = 1;

            this._invMass = 1 / this._mass;
        }

        /**
         * 获取或设置物体绕局部原点的旋转惯量。 通常以kg-m ^ 2为单位
         */
        public get inertia() {
            return this._inertia + this.mass * es.Vector2.dot(this._sweep.localCenter, this._sweep.localCenter);
        }
        
        public set inertia(value: number) {
            console.assert(!Number.isNaN(value));

            if (this._bodyType != BodyType.dynamic)
                return;

            if (value> 0 && !this._fixedRotation) {
                this._inertia = value - this.mass * es.Vector2.dot(this.localCenter, this.localCenter);
                console.assert(this._inertia > 0);
                this._invI = 1 / this._inertia;
            }
        }

        public get restitution() {
            let res = 0;

            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                res += f.restitution;
            }

            return this.fixtureList.length > 0 ? res / this.fixtureList.length : 0;
        }

        public set restitution(value: number) {
            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                f.restitution = value;
            }
        }

        public get friction() {
            let res = 0;

            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                res += f.friction;
            }

            return this.fixtureList.length > 0 ? res / this.fixtureList.length : 0;
        }

        public set friction(value: number) {
            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                f.friction = value;
            }
        }

        public set collisionCategories(value: Category) {
            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                f.collisionCategories = value;
            }
        }

        public set collidesWith(value: Category) {
            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                f.collidesWith = value;
            }
        }

        /**
         * 2×2矩阵。 
         * 以主要列的顺序存储。
         * 身体对象可以定义希望忽略CCD的身体的类别。 
         * 这使得某些物体可以配置为忽略CCD，而由于内容的制备方式，这些物体不是渗透问题。 
         * 将此与World.SolveTOI中另一个Body的灯具CollisionCategories进行比较。
         */
        public set ignoreCCDWith(value: Category) {
            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                f.ignoreCCDWith = value;
            }
        }

        public set collisionGroup(value: number) {
            for (let i = 0; i < this.fixtureList.length; i++) {
                let f = this.fixtureList[i];
                f.collisionGroup = value;
            }
        }

        public set isSensor(value: boolean) {
            for (let i = 0; i < this.fixtureList.length; i ++) {
                let f = this.fixtureList[i];
                f.isSensor = value;
            }
        }

        public ignoreCCD: boolean;

        /**
         * 为身体上的每个fixture连接onCollision事件 
         */
        public addOnCollision(value: onCollisionEventHandler) {
            for (let i = 0; i < this.fixtureList.length; i ++) {
                this.fixtureList[i].onCollision.push(value);
            }
        }

        public removeOnCollision(value: onCollisionEventHandler) {
            for (let i = 0; i < this.fixtureList.length; i ++) 
                new es.List(this.fixtureList[i].onCollision).remove(value);
        }

        /**
         * 为身体上的每个fixture连接onSeparation事件 
         * @param value 
         */
        public addOnSeparation(value: onSeperationEventHandler) {
            for (let i = 0; i < this.fixtureList.length; i ++)
                this.fixtureList[i].onSeperation.push(value);
        }

        public removeOnSeparation(value: onSeperationEventHandler) {
            for (let i = 0; i < this.fixtureList.length; i ++)
                new es.List(this.fixtureList[i].onSeperation).remove(value);
        }

        static _bodyIdCounter: number;
        _angularDamping: number;
        _bodyType: BodyType;
        _inertia: number;
        _linearDamping: number;
        _mass: number;
        _sleepingAllowed: boolean;
        _awake: boolean;
        _fixedRotation: boolean;

        _enabled: boolean;
        _angularVelocity: number;
        _linearVelocity: es.Vector2;
        _force: es.Vector2;
        _invI: number;
        _invMass: number;
        _sleepTime: number;
        _sweep: Sweep;
        _torque: number;
        _world: World;
        _xf: Transform;
        _island: boolean;

        constructor(world: World,position: es.Vector2 = new es.Vector2(), rotation = 0,
            bodyType: BodyType = BodyType.static, userdata = null) {
                this.fixtureList = [];
                this.bodyId = Body._bodyIdCounter ++;

                this._world = world;
                this._enabled = true;
                this._awake = true;
                this._sleepingAllowed = true;

                this.userData = userdata;
                this.gravityScale = 1;
                this.bodyType = bodyType;
            
                this._xf.q.set(rotation);

                if (!position.equals(es.Vector2.zero)) {
                    this._xf.p = position;
                    this._sweep.c0 = this._xf.p;
                    this._sweep.c = this._xf.p;
                }

                if (rotation != 0) {
                    this._sweep.a0 = rotation;
                    this._sweep.a = rotation;
                }

                // world.add
                // TODO: addbody
        }
    }
}
