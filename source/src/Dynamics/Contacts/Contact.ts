module physics {
    export enum ContactType {
        notSupported,
        polygon,
        polygonAndCircle,
        circle,
        edgeAndPolygon,
        edgeAndCircle,
        chainAndPolygon,
        chainAndCircle
    }

    /**
     * 该类管理两个形状之间的接触。 
     * 广相中每个重叠的AABB都有一个接触（除非经过过滤）。 
     * 因此，可能存在没有接触点的接触对象
     */
    export class Contact {
        public fixtureA: Fixture;
        public fixtureB: Fixture;
        public friction: number;
        public restitution: number;

        /**
         * 获取接触manifold。 除非您了解Box2D的内部结构，否则请勿修改manifold
         */
        public manifold: Manifold;

        /**
         * 获取或设置传送带行为所需的切线速度。 以米/秒为单位。 
         */
        public tangentSpeed: number;

        /**
         * 启用/禁用此contact。 可以在预解决的联系侦听器内部使用。 
         * 仅在当前时间步（或连续碰撞中的子步）禁用该接触。
         * 注意：如果将Enabled设置为true或false常数，请改用显式的Enable或Disable函数，以免CPU执行分支操作。
         */
        public enabled: boolean;

        /** 获取fixtureA的子基本索引 */
        public childIndexA: number;

        /** 获取fixtureB的子基本索引 */
        public childIndexB: number;

        /** 确定此contact是否在触摸 */
        public isTouching: boolean;

        public islandFlag: boolean;
        public toiFlag: boolean;
        public filterFlag: boolean;

        _type: ContactType;

        static _edge: EdgeShape = new EdgeShape();
        static _contactRegisters: ContactType[][] = [
            [
                ContactType.circle,
                ContactType.edgeAndCircle,
                ContactType.polygonAndCircle,
                ContactType.chainAndCircle
            ],
            [
                ContactType.edgeAndCircle,
                ContactType.notSupported,

                ContactType.edgeAndCircle,
                ContactType.notSupported,
            ],
            [
                ContactType.polygonAndCircle,
                ContactType.edgeAndPolygon,
                ContactType.polygon,
                ContactType.chainAndPolygon
            ],
            [
                ContactType.chainAndCircle,
                ContactType.notSupported,

                ContactType.chainAndPolygon,
                ContactType.notSupported
            ]
        ];

        public _nodeA: ContactEdge = new ContactEdge();
        public _nodeB: ContactEdge = new ContactEdge();
        public _toiCount: number;
        public _toi: number;

        constructor(fA: Fixture, indexA: number, fB: Fixture, indexB: number) {
            // reset
        }
    }
    
    /**
     * 接触边缘用于在接触图中将实体和接触连接在一起，其中每个实体是一个节点，每个接触是一个边缘。 
     * 接触边属于每个附加主体中维护的双向链表。 
     * 每个接触点都有两个接触点，每个附着体一个。 
     */
    export class ContactEdge {
        /** contact */
        public contact: Contact;

        /**
         * body的contact列表中的下一个接触边 
         */
        public next: ContactEdge;

        /**
         * 提供快速访问连接的另一个主体的方法
         */
        public other: Body;
        
        /**
         * 身体的联系人列表中的前一个接触边 
         */
        public prev: ContactEdge;
    }
}