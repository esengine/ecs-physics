module physics {
    export enum JointType {
        unknown,
        revolute,
        prismatic,
        distance,
        pulley,

        gear,
        wheel,
        weld,
        friction,
        rope,
        motor,

        angle,
        fixedMouse
    }

    export enum LimitState {
        inactive,
        atLower,
        atUpper,
        equal
    }

    /**
     * 关节边用于在一个关节图中将实体和关节连接在一起，其中每个实体是一个节点，每个关节是一个边。 
     * 关节边属于每个附加主体中维护的双向链表。 
     * 每个关节都有两个关节节点，每个连接的节点一个
     */
    export class JointEdge {
        /** joint */
        public joint: Joint;
        /** 人体关节列表中的下一个关节边缘 */
        public next: JointEdge;
        /** 提供快速访问连接的另一个主体的方法 */
        public other: Body;
        /** 人体关节列表中的上一个关节边缘 */
        public prev: JointEdge;
    }

    export abstract class Joint {
        /**
         * 指示是否启用了此联接。 禁用关节意味着该关节仍在仿真中，但是不活动
         */
        public enabled: boolean = true;

        /** 
         * 获取或设置关节的类型
         */
        public jointType: JointType;

        /**
         * 获取第一个附着在此关节上的物体
         */
        public bodyA: Body;

        /**
         * 获取第二个附着在此关节上的物体
         */
        public bodyB: Body;

        /**
         * 在世界坐标中获取bodyA上的锚点。 
         * 在某些关节上，此值指示世界范围内的锚点
         */
        public abstract worldAnchorA: es.Vector2;

        /**
         * 在世界坐标中获取bodyB上的锚点。 
         * 在某些关节上，此值指示世界范围内的锚点。
         */
        public abstract woldAnchorB: es.Vector2;
        
        /**
         * 设置用户数据指针
         */
        public userData: any;

        /**
         * 如果附着的物体发生碰撞，请将此标志设置为true
         */
        public collideConnected: boolean;

        /**
         * 断点只是表示JointError在中断之前可以达到的最大值。 
         * 默认值为Number.MaxValue，这表示它永不中断。
         */
        public get breakpoint() {
            return this._breakpoint;
        }

        public set breakpoint(value: number) {
            this._breakpoint = value;
            this._breakpointSquared = this._breakpoint * this._breakpoint;
        }

        /**
         * 关节断开时触发
         */
        public onJointBroke: (joint: Joint, value: number) => void;

        _breakpoint: number;
        _breakpointSquared: number;

        public edgeA: JointEdge = new JointEdge();
        public edgeB: JointEdge = new JointEdge();
        public islandFlag: boolean;

        protected constructor(bodyA?: Body, bodyB?: Body) {
            if (bodyA && bodyB) {
                // 无法将关节两次连接到同一实体
                console.assert(bodyA != bodyB);
                this.bodyA = bodyA;
                this.bodyB = bodyB;
            } else if(bodyA) {
                this.bodyA = bodyA;
            }
            
            this.breakpoint = Number.MAX_VALUE;
            
            // 默认情况下，连接的物体不应碰撞 
            this.collideConnected = false;
        }

        /**
         * 在牛顿的关节锚点处获得对身体的反作用力
         * @param invDt 
         */
        public abstract getReactionForce(invDt: number): es.Vector2;

        /**
         * 以N * m为单位获取关节锚点处的车身反作用扭矩
         * @param invDt 
         */
        public abstract getReacionTorque(invDt: number): number;

        protected wakeBodies() {
            if (this.bodyA != null)
                this.bodyA.isAwake = true;

            if (this.bodyB != null)
                this.bodyB.isAwake = true;
        }

        public isFixedType() {
            return this.jointType == JointType.fixedMouse || this.bodyA.isStatic || this.bodyB.isStatic;
        }
    }
}