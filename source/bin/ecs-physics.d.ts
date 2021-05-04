declare module physics {
    enum Category {
        none = 0,
        all,
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
    class FixtureProxy {
        aabb: AABB;
        childIndex: number;
        fixture: Fixture;
        proxyId: number;
    }
    /**
     * Fixture用于将Shape附加到主体以进行碰撞检测。
     * Fixture从其父级继承其变换。 Fixture包含其他非几何数据，例如摩擦，碰撞过滤器等。
     * Fixture是通过Body.CreateFixture创建的。
     *  警告：您不能重复使用Fixture。
     */
    class Fixture {
        proxies: FixtureProxy[];
        proxyCount: number;
        ignoreCCDWith: Category;
        /**
         * 默认为0
         * 如果Settings.useFPECollisionCategories设置为false：
         * 碰撞组允许某个对象组从不碰撞（负向）或始终碰撞（正向）。
         * 零表示没有碰撞组。 非零组过滤始终会赢得掩码位。
         * 如果Settings.useFPECollisionCategories设置为true：
         * 如果2个fixture在同一个碰撞组中，它们将不会发生碰撞。
         */
        collisionGroup: number;
        /**
         * 默认为Category.All
         *
         * 碰撞掩码位。
         * 这说明了该灯具将接受碰撞的类别。
         * 使用Settings.UseFPECollisionCategories更改行为。
         */
        collidesWith: Category;
        /**
         * 此设备属于碰撞类别。
         * 如果Settings.UseFPECollisionCategories设置为false：
         * 默认设置为Category.Cat1
         *
         * 如果Settings.UseFPECollisionCategories设置为true：
         * 默认设置为Category.All
         */
        collisionCategories: Category;
        /**
         * 得到子形状。
         * 您可以修改子Shape，但是不应更改顶点数，因为这会使某些碰撞缓存机制崩溃
         */
        shape: Shape;
        /**
         * 获取或设置一个值，该值指示此灯具是否是传感器
         */
        isSensor: boolean;
        /**
         * 获取此fixture的父实体。 如果未连接fixture，则为null。
         */
        body: Body;
        /**
         * 设置用户数据。 使用它来存储您的应用程序特定的数据
         */
        userData: any;
        /**
         * 设置摩擦系数。 这将不会改变现有触点的摩擦
         */
        friction: number;
        /**
         * 设置恢复系数
         */
        restitution: number;
        fixtureId: number;
        /**
         * 两种形状发生碰撞并解决后便会触发。
         */
        afterCollision: afterCollisionEventHandler[];
        /**
         * 当两个fixture彼此靠近时触发。
         * 由于广义相的工作方式，因此使用AABB近似形状时可能会非常不准确
         */
        beforeCollision: beforeCollisionEventHandler[];
        /**
         * 当两个形状发生碰撞并在它们之间创建接触时触发。
         * 注意：第一个fixture参数始终是代表所预订的fixture。
         */
        onCollision: onCollisionEventHandler[];
        /**
         * 当两个形状分开并且它们之间的接触被移除时触发。
         * 注意：由于fixture可以有多个触点，因此在某些情况下可以多次调用。
         * 注意：第一个fixture参数始终是代表所预订的fixture
         */
        onSeperation: onSeperationEventHandler[];
        static _fixtureIdCounter: number;
        _isSensor: boolean;
        _friction: number;
        _restitution: number;
        _collidesWith: Category;
        _collisonCategories: Category;
        _collisionGroup: number;
        _colisionIgnores: Set<number>;
        constructor(body?: Body, shape?: Shape, userData?: any);
        isDisposed: boolean;
        dispose(): void;
        /**
         * 恢复此fixture与提供的fixture之间的碰撞
         * @param fixture
         */
        restoreCollisionWith(fixture: Fixture): void;
        /**
         * 忽略此fixture与提供的fixture之间的碰撞
         * @param fixture
         */
        ignoreCollisionWith(fixture: Fixture): void;
        /**
         * 确定是否忽略此Fixture与提供的Fixture之间的碰撞
         * @param fixture
         * @returns
         */
        isFixtureIgnored(fixture: Fixture): boolean;
        /**
         * contact是持久性的，除非标记为进行过滤，否则它们将保持持久性。
         * 此方法标记与主体关联的所有contact以进行过滤
         */
        refilter(): void;
    }
}
declare module physics {
    class Settings {
        static maxFloat: number;
        static epsilon: number;
        static pi: number;
        /**
         * Farseer Physics Engine与Box2d相比具有不同的fixture过滤方法。
         * 引擎中同时包含FPE和Box2D过滤。
         * 如果要从FPE的早期版本升级，请将其设置为true，将defaultFixtureCollisionCategories设置为Category.All
         */
        static useFPECollisionCategories: boolean;
        /**
         * Fixture构造函数将其用作Fixture.collisionCategories成员的默认值。
         * 请注意，您可能需要根据上面的UseFPECollisionCategories设置进行更改
         */
        static defaultFixtureCollisionCategories: Category;
        /**
         * Fixture构造函数将其用作Fixture.collidesWith成员的默认值
         */
        static defaultFixtureCollidesWith: Category;
        /**
         * Fixture构造函数将其用作Fixture.ignoreCCDWith成员的默认值
         */
        static defaultFixtureIgnoreCCDWith: Category;
        /**
         * 用作碰撞和约束公差的小长度。
         * 通常，它被选择为在数值上有意义，但在视觉上却无关紧要
         */
        static linearSlop: number;
        /**
         * 多边形/边缘形状蒙皮的半径。 这不应该被修改。
         * 使其更小意味着多边形将没有足够的缓冲区来进行连续碰撞。
         * 使其更大可能会产生顶点碰撞的假象。
         */
        static polygonRadius: number;
        /**
         * 凸多边形上的最大顶点数
         */
        static maxPolygonVertices: number;
        /**
         * 如果为true，它将在所有多边形输入上运行GiftWrap凸包。
         * 在给定随机输入的情况下，这会使引擎更稳定，但是如果多边形的创建速度更为重要，则可能需要将其设置为false。
         */
        static useConvexHullPolygons: boolean;
        static mixFriction(friction1: number, friction2: number): number;
        static mixRestitution(restitution1: number, restitution2: number): number;
    }
}
declare module physics {
    class RayCastInput {
        /**
         * 光线从p1延伸到p1 + maxFraction *（p2-p1）。如果最大分数为1，则光线从p1延伸到p2。 0.5的最大分数使射线从p1到达p2的一半
         */
        maxFraction: number;
        /**
         * 射线的起点
         */
        point1: es.Vector2;
        /**
         * 射线的终点
         */
        point2: es.Vector2;
    }
    /**
     * 射线投射输出数据
     */
    class RayCastOutput {
        /**
         * 射线以p1 +分数*（p2-p1）命中，其中p1和p2来自RayCastInput。 包含光线具有交点的实际分数
         */
        fraction: number;
        /**
         * 射线击中的形状的法线
         */
        normal: es.Vector2;
    }
    enum ManifoldType {
        circles = 0,
        faceA = 1,
        faceB = 2
    }
    /**
     * 用于两个接触凸形的流形。Box2D支持多种类型的联系人：
     * - 剪辑点与具有半径的平面
     * -点与半径的点（圆）
     * 局部点的使用取决于流形类型：
     * -ShapeType.Circles：circleA的局部中心
     * -SeparationFunction.FaceA：faceA的中心
     * -SeparationFunction.FaceB：faceB的中心类似本地的正常用法：
     * -ShapeType.Circles：未使用
     * -SeparationFunction.FaceA：多边形A上的法线
     * -SeparationFunction.FaceB：多边形B的法线
     * 我们以这种方式存储，以便位置校正可以说明运动，这对于连续物理学至关重要。
     * 所有接触场景都必须用以下一种类型表示。
     * 此结构跨时间存储，因此我们将其保持较小。
     */
    class Manifold {
        /**
         * 不适用于Type.SeparationFunction.Points
         */
        localNormal: es.Vector2;
        /**
         * 用法取决于manifold类型
         */
        localPoint: es.Vector2;
        pointCount: number;
        points: FixedArray2<ManifoldPoint>;
        type: ManifoldType;
    }
    /**
     * ManifoldPoint是属于接触Manifold的接触点。
     * 它包含与接触点的几何形状和动力学有关的详细信息。
     * 局部点的使用取决于流形类型：
     * -ShapeType.Circles：圆B的本地中心
     * -SeparationFunction.FaceA：cirlceB的局部中心或polygonB的剪辑点
     * -SeparationFunction.FaceB：polygonA的剪辑点此结构跨时间步存储，因此我们将其保持较小。
     * 注意：这些脉冲用于内部缓存，可能无法提供可靠的接触力，尤其是对于高速碰撞。
     */
    class ManifoldPoint {
        /** 唯一标识两个形状之间的接触点  */
        id: ContactID;
        /** 用法取决于Manifold类型  */
        localPoint: es.Vector2;
        /**  */
        normalImpulse: number;
        /**  */
        tangentImpulse: number;
    }
    /**
     * ContactID有助于热启动
     */
    class ContactID {
        /** 相交以形成接触点的要素  */
        features: ContactFeature;
        /** 用于快速比较ContactID */
        key: number;
    }
    /**
     * 相交以形成接触点的要素此长度必须为4个字节或更少
     */
    class ContactFeature {
        /** ShapeA特征索引  */
        indexA: number;
        /** ShapeB特征索引 */
        indexB: number;
        /** ShapeA特征类型  */
        typeA: number;
        /** ShapeB特征类型 */
        typeB: number;
    }
    /**
     * 轴对齐的边界框
     */
    class AABB {
        /** 下顶点  */
        lowerBound: es.Vector2;
        /** 上顶点  */
        upperBound: es.Vector2;
        readonly width: number;
        readonly height: number;
        /** 获取AABB的中心 */
        readonly center: es.Vector2;
        /** 获取AABB的范围（半宽） */
        readonly extents: es.Vector2;
        /** 获取周长  */
        readonly perimeter: number;
        /**
         * 获取AABB的顶点
         */
        readonly vertices: Vertices;
        readonly q1: AABB;
        readonly q2: AABB;
        readonly q3: AABB;
        readonly q4: AABB;
        constructor(min: es.Vector2, max: es.Vector2);
        /**
         * 验证边界已排序。 边界是有效数字（不是NaN）
         * @returns
         */
        isValid(): boolean;
        /**
         * 将AABB合并到此
         * @param aabb
         */
        combine(aabb: AABB): void;
        /**
         * 该aabb是否包含提供的AABB
         * @param aabb
         * @returns
         */
        contains(aabb: AABB): boolean;
        /**
         * 测试两个AABB是否重叠
         * @param a
         * @param b
         */
        static testOverlap(a: AABB, b: AABB): boolean;
    }
}
declare module physics {
    /**
     * GJK算法使用距离代理。 它封装了任何形状。
     */
    class DistanceProxy {
        radius: number;
        vertices: Vertices;
        set(shape: Shape, index: number): void;
    }
}
declare module physics {
    /**
     * 动态树中的节点。 客户端不直接与此交互
     */
    class TreeNode {
        /**
         * 扩大AABB
         */
        aabb: AABB;
        child1: number;
        child2: number;
        height: number;
        parentOrNext: number;
        userData: FixtureProxy;
        isLeaf(): boolean;
    }
    /**
     * 动态树将数据排列在二叉树中，以加速诸如体积查询和射线投射之类的查询。
     * 叶子是带有AABB的代理。
     * 在树中，我们通过Settings.b2_fatAABBFactor扩展代理AABB，以便代理AABB大于客户端对象。
     * 这允许客户端对象少量移动而不会触发树更新。
     * 节点是可合并和可重定位的，因此我们使用节点索引而不是指针。
     */
    class DynamicTree {
        /**
         * 以O（N）时间计算二叉树的高度。 不应该经常调用。
         */
        readonly height: number;
        /**
         * 获取节点面积与根面积之和的比值
         */
        readonly areaRatio: number;
        /**
         * 获取树中节点的最大余额。 平衡是节点的两个子节点的高度差。
         */
        readonly maxBalance: number;
        _raycastStack: number[];
        _queryStack: number[];
        _freeList: number;
        _nodeCapacity: number;
        _nodeCount: number;
        _nodes: TreeNode[];
        _root: number;
        static nullNode: number;
        /**
         * 构造树将初始化节点池
         */
        constructor();
        /**
         * 在树中创建一个代理作为叶节点。 我们返回节点的索引而不是指针，以便我们可以增加节点池
         * @param aabb
         * @param userData
         */
        addProxy(aabb: AABB, userData: FixtureProxy): void;
    }
}
declare module physics {
    /**
     * 广义阶段用于计算对并执行体积查询和射线投射。
     * 这个广义阶段不会持久存在对。
     * 相反，这会报告潜在的新对。
     * 客户端可以使用新的对并跟踪后续的重叠。
     */
    class DynamicTreeBroadPhase {
    }
}
declare module physics {
    class TOIInput {
        proxyA: DistanceProxy;
        proxyB: DistanceProxy;
        sweepA: Sweep;
        sweepB: Sweep;
        tMax: number;
    }
    enum TOIOutputState {
        unknown = 0,
        failed = 1,
        overlapped = 2,
        touching = 3,
        seperated = 4
    }
}
declare module physics {
    /**
     * 这将保存为形状计算的质量数据
     */
    class MassData implements es.IEquatable<MassData> {
        /** 形状的面积  */
        area: number;
        /** 形状质心相对于形状原点的位置 */
        centroid: es.Vector2;
        /** 形状围绕局部原点的旋转惯性 */
        inertia: number;
        /** 形状的质量，通常以千克为单位 */
        mass: number;
        static equals(left: MassData, right: MassData): boolean;
        static notEquals(left: MassData, right: MassData): boolean;
        equals(other: MassData): boolean;
    }
    enum ShapeType {
        unknown = -1,
        circle = 0,
        edge = 1,
        polygon = 2,
        chain = 3,
        typeCount = 4
    }
    /**
     * 形状用于碰撞检测。 您可以根据需要创建形状。
     * 创建fixture后，将自动创建World中用于模拟的形状。
     * 形状可以封装一个或多个子形状。
     */
    abstract class Shape {
        /**
         * 包含形状的属性，例如：
         * -形状的面积
         * -质心
         * -惯性
         * - 质量
         */
        massData: MassData;
        /**
         * 获取此形状的类型
         */
        shapeType: ShapeType;
        /**
         * 获取子基元的数量
         */
        abstract childCount: number;
        /**
         * 获取或设置密度。 更改密度会导致重新计算形状属性
         */
        density: number;
        /**
         * 形状的半径更改半径会重新计算形状属性
         */
        radius: number;
        _density: number;
        _radius: number;
        _2radius: number;
        protected constructor(density: number);
        /**
         * clone shape
         */
        abstract clone(): Shape;
        /**
         * 测试此形状中的遏制点。 注意：这仅适用于凸形
         * @param transform
         * @param point
         */
        abstract testPoint(transform: Transform, point: es.Vector2): boolean;
        /**
         * 向子形状投射射线
         * @param output
         * @param input
         * @param transform
         * @param childIndex
         */
        abstract rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        /**
         * 给定一个变换，为子形状计算关联的轴对齐的边界框
         * @param aabb
         * @param transform
         * @param childIndex
         */
        abstract computeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        /**
         * 使用形状的尺寸和密度计算其质量属性。 惯性张量是围绕局部原点而不是质心计算的
         */
        protected abstract computeProperties(): void;
        /**
         * 根据类型和属性将此形状与另一个形状进行比较
         * @param shape
         * @returns
         */
        compareTo(shape: Shape): boolean;
        /**
         * 用于浮力控制器
         * @param normal
         * @param offset
         * @param xf
         * @param sc
         */
        abstract computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2): number;
    }
}
declare module physics {
    /**
     * 线段（边缘）形状。 这些可以成环或成环连接到其他边缘形状。 连接信息用于确保正确的接触法线。
     */
    class EdgeShape extends Shape {
        readonly childCount: number;
        /** 如果边在vertex1之前连接到相邻顶点，则为true */
        hasVertex0: boolean;
        /** 如果边在vertex2之后连接到相邻的顶点，则为true */
        hasVertex3: boolean;
        /** 可选的相邻顶点。 这些用于平滑碰撞 */
        vertex0: es.Vector2;
        /** 可选的相邻顶点。 这些用于平滑碰撞 */
        vertex3: es.Vector2;
        vertex1: es.Vector2;
        vertex2: es.Vector2;
        _vertex1: es.Vector2;
        _vertex2: es.Vector2;
        constructor(start?: es.Vector2, end?: es.Vector2);
        /**
         * 将此设置为孤立边
         * @param start
         * @param end
         */
        set(start: es.Vector2, end: es.Vector2): void;
        testPoint(transform: Transform, point: es.Vector2): boolean;
        rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        computeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        protected computeProperties(): void;
        computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2): number;
        clone(): EdgeShape;
    }
}
declare module physics {
    /**
     * 链形状是线段的自由形式序列。
     * 链条有两个侧面碰撞，因此您可以使用内部和外部碰撞，因此可以使用任何缠绕顺序。
     * 连接信息用于创建平滑冲突。
     * 警告：如果存在自相交，则链条不会正确碰撞。
     */
    class ChainShape extends Shape {
        vertices: Vertices;
        readonly childCount: number;
        prevVertex: es.Vector2;
        nextVertex: es.Vector2;
        _prevVertex: es.Vector2;
        _nextVertex: es.Vector2;
        _hasPrevVertex: boolean;
        _hasNextVertex: boolean;
        static _edgeShape: EdgeShape;
        constructor(vertices?: Vertices, createLoop?: boolean);
        getChildEdge(edge: EdgeShape, index: number): void;
        setVertices(vertices: Vertices, createLoop?: boolean): void;
        testPoint(transform: Transform, point: es.Vector2): boolean;
        rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        computeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        protected computeProperties(): void;
        computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2): number;
        clone(): ChainShape;
    }
}
declare module physics {
    class CircleShape extends Shape {
        readonly childCount: number;
        position: es.Vector2;
        _position: es.Vector2;
        constructor(radius?: number, density?: number);
        testPoint(transform: Transform, point: es.Vector2): boolean;
        rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        computeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        protected computeProperties(): void;
        computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2): number;
        compareTo(shape: CircleShape): boolean;
        clone(): CircleShape;
    }
}
declare module physics {
    class PolygonShape extends Shape {
        vertices: Vertices;
        readonly normals: Vertices;
        readonly childCount: number;
        _vertices: Vertices;
        _normals: Vertices;
        constructor(vertices?: Vertices, density?: number);
        /**
         * 设置顶点，而无需将数据从顶点复制到本地List
         * @param verts
         */
        setVerticesNoCopy(verts: Vertices): void;
        protected computeProperties(): void;
        testPoint(transform: Transform, point: es.Vector2): boolean;
        rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        computeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2): number;
        clone(): PolygonShape;
    }
}
declare module physics {
    /**
     * 在显示和模拟单位之间转换单位
     */
    class FSConvert {
        /**
         * 将模拟（米）转换为显示（像素）
         */
        static simToDisplay: number;
        /**
         * 将显示（像素）转换为模拟（米）
         */
        static displayToSim: number;
    }
}
declare module physics {
    class FixedArray2<T> {
        _value0: T;
        _value1: T;
        get(index: number): T;
        set(index: number, value: T): void;
    }
}
declare module physics {
    /**
     * 这描述了用于TOI计算的身体/形状的运动。
     * 形状是相对于身体原点定义的，可以与质心不重合。
     * 但是，要支持动态我们必须对质心位置进行插值
     */
    class Sweep {
        /** 世界角度 */
        a: number;
        a0: number;
        /**
         * 当前时间步长的小数，范围为[0,1]c0和a0是alpha0处的位置
         */
        alpha0: number;
        /**
         * 中心世界位置
         */
        c: es.Vector2;
        c0: es.Vector2;
        /**
         * 当地质心位置
         */
        localCenter: es.Vector2;
        /**
         * 在特定时间获取插值变换
         * @param xfb
         * @param beta
         */
        getTransform(xfb: Transform, beta: number): void;
        /**
         * 向前推进，产生一个新的初始状态。
         * @param alpha
         */
        advance(alpha: number): void;
        /**
         * 归一化角度
         */
        normalize(): void;
    }
    /**
     * 转换包含平移和旋转。
     * 它用来代表刚性框架的位置和方向
     */
    class Transform {
        p: es.Vector2;
        q: Rot;
        constructor(position: es.Vector2, rotation: Rot);
        /**
         * 将此设置为标识转换
         */
        setIdentity(): void;
        /**
         * 根据位置和角度进行设置
         * @param position
         * @param angle
         */
        set(position: es.Vector2, angle: number): void;
    }
    /**
     * Rotation
     */
    class Rot {
        s: number;
        c: number;
        /**
         * 从弧度的角度初始化
         * @param angle
         */
        constructor(angle: number);
        /**
         * 使用以弧度为单位的角度进行设置
         * @param angle
         */
        set(angle: number): void;
        /**
         * 设置为identity旋转
         */
        setIdentity(): void;
        /**
         * 获取弧度角
         * @returns
         */
        getAngle(): number;
        /**
         * 获取x轴
         * @returns
         */
        getXAxis(): es.Vector2;
        /**
         * 获取y轴
         * @returns
         */
        getYAxis(): es.Vector2;
    }
    class MathUtils {
        static mul(q: Rot, v: es.Vector2): es.Vector2;
        static mul_tv(t: Transform, v: es.Vector2): es.Vector2;
        static mul_mv(a: Mat22, v: es.Vector2): es.Vector2;
        static mul_rr(q: Rot, r: Rot): Rot;
        static mul_rv(q: Rot, v: es.Vector2): es.Vector2;
        static cross(a: es.Vector2, b: es.Vector2): number;
    }
    /**
     * 2×2矩阵。 以列主要顺序存储
     */
    class Mat22 {
        ex: es.Vector2;
        ey: es.Vector2;
        constructor(c1: es.Vector2, c2: es.Vector2);
    }
}
declare module physics {
    enum PolygonError {
        /** 多边形中没有错误  */
        noError = 0,
        /** 多边形必须在3和Settings.MaxPolygonVertices顶点之间 */
        invalidAmountOfVertices = 1,
        /** 多边形必须简单。 这意味着没有重叠的边缘 */
        notSimple = 2,
        /** 多边形必须逆时针 */
        notCounterClockWise = 3,
        /** 多边形是凹的，它需要是凸的 */
        notConvex = 4,
        /** 多边形面积太小 */
        areaTooSmall = 5,
        /** 多边形的边太短 */
        sideTooSmall = 6
    }
    class Vertices extends Array<es.Vector2> {
        attackedToBody: boolean;
        /**
         * 您可以在此集合中添加hole。
         * 它会受到某些三角剖分算法的使用，但其他方面不会使用
         */
        holes: Vertices[];
        constructor(vertices?: es.Vector2[]);
        /**
         * 获取下一个索引。 用于遍历所有边缘
         * @param index
         * @returns
         */
        nextIndex(index: number): number;
        /**
         * 获取下一个顶点。 用于遍历所有边缘
         * @param index
         * @returns
         */
        nextVertex(index: number): es.Vector2;
        /**
         * 获取前一个索引。 用于遍历所有边缘
         * @param index
         * @returns
         */
        previousIndex(index: number): number;
        /**
         * 获取前一个顶点。 用于遍历所有边缘
         * @param index
         * @returns
         */
        previousVertx(index: number): es.Vector2;
        /**
         * 获取签名区域。 如果面积小于0，则表示多边形是顺时针缠绕的。
         * @returns
         */
        getSignedArea(): number;
        /**
         * 获取区域
         * @returns
         */
        getArea(): number;
        /**
         * 获取质心
         * @returns
         */
        getCentroid(): es.Vector2;
        /**
         * 返回完全包含此多边形的AABB。
         * @returns
         */
        getAABB(): AABB;
        /**
         * 用指定的向量平移顶点
         * @param value
         */
        translate(value: es.Vector2): void;
        /**
         * 使用指定的矢量缩放顶点
         * @param value
         */
        scale(value: es.Vector2): void;
        /**
         * 旋转具有定义值（以弧度为单位）的顶点。
         * 警告：在实体的一组活动顶点上使用此方法会导致碰撞问题。 改用Body.Rotation。
         * @param value
         */
        rotate(value: number): void;
        /**
         * 确定多边形是否为凸面。 O（n ^ 2）运行时间。
         * 假设：
         * -多边形按逆时针顺序排列
         * -多边形没有重叠的边缘
         */
        isConvex(): boolean;
        /**
         * 指示顶点是否为逆时针顺序。警告：如果多边形的面积为0，则无法确定绕线。
         * @returns
         */
        isCounterClockWise(): boolean;
        /**
         * 强制顶点按逆时针方向排列
         * @returns
         */
        forceCounterClockWise(): void;
    }
}
declare module physics {
    /**
     * Giftwrap凸包算法。 O（nh）时间复杂度，其中n是点数，h是凸包上的点数。
     * 从Box2D中摘取
     */
    class GiftWrap {
        /**
         * 从给定的顶点返回凸包
         * @param vertices
         */
        static getConvexHull(vertices: Vertices): Vertices;
    }
}
declare module physics {
    /**
     * 包含可以确定是否应处理对象的筛选器数据
     */
    abstract class FilterData {
        /**
         * 禁用特定类别的逻辑。类别。默认为无。
         */
        disabledOnCategories: Category;
        /**
         * 禁用特定组上的逻辑
         */
        disabledOnGroup: number;
        /**
         * 默认情况下，对特定类别Category.All启用逻辑
         */
        enabledOnCategories: Category;
        /**
         * 在特定组上启用逻辑
         */
        enabledOnGroup: number;
        isActiveOn(body: Body): boolean;
    }
}
declare module physics {
    enum PhysicsLogicType {
        Explosion = 1
    }
    class PhysicsLogicFilter {
        controllerIgnores: PhysicsLogicType;
        /**
         * 忽略控制器。 控制器对此主体无效
         * @param type
         */
        ignorePhysicsLogic(type: PhysicsLogicType): void;
    }
}
declare module physics {
    enum ControllerType {
        gravityController = 1,
        velocityLimitController = 2,
        abstractForceController = 4,
        buoyancyController = 8
    }
    class ControllerFilter {
        controllerFlags: ControllerType;
        /**
         * 忽略控制器。 控制器对此主体无效
         * @param controller
         */
        ignoreController(controller: ControllerType): void;
        /**
         * 恢复控制器。 控制器会影响此主体
         * @param controller
         */
        restoreController(controller: ControllerType): void;
        /**
         * 确定此主体是否忽略指定的控制器
         * @param controller
         * @returns
         */
        isControllerIgnored(controller: ControllerType): boolean;
    }
    abstract class Controller extends FilterData {
        enabled: boolean;
        world: World;
        _type: ControllerType;
        protected constructor(controllerType: ControllerType);
        isActiveOn(body: Body): boolean;
        abstract update(dt: number): void;
    }
}
declare module physics {
    /**
     * Body类型
     */
    enum BodyType {
        /**
         * 零速度，可以手动移动。 注意：即使是静态物体也有质量
         */
        static = 0,
        /**
         * 零质量，用户设定的非零速度，由求解器移动
         */
        kinematic = 1,
        /**
         * 正质量，由力确定的非零速度，由求解器移动
         */
        dynamic = 2
    }
    class Body {
        physicsLogicFilter: PhysicsLogicFilter;
        controllerFilter: ControllerFilter;
        /**
         * 此主体的唯一ID
         */
        bodyId: number;
        islandIndex: number;
        /**
         * 缩放施加到此物体的重力。
         * 默认值为1。值2表示对该实体施加了两倍的重力。
         */
        gravityScale: number;
        readonly world: World;
        /**
         * 设置用户数据。 使用它来存储您的应用程序特定的数据
         */
        userData: any;
        /**
         * 获取身体旋转的总数
         */
        readonly revolutions: number;
        /**
         * 获取或设置主体类型。
         * 警告：调用此中间更新可能会导致崩溃。
         */
        bodyType: BodyType;
        /**
         * 获取或设置质心的线速度
         */
        /**
        * 获取或设置质心的线速度
        */
        linearVelocity: es.Vector2;
        /**
         * 获取或设置角速度。 弧度/秒
         */
        angularVelocity: number;
        /**
         * 获取或设置线性阻尼
         */
        linearDamping: number;
        /**
         * 获取或设置角度阻尼
         */
        angularDamping: number;
        /**
         * 获取或设置一个值，该值指示是否应将此主体包含在CCD求解器中
         */
        isBullet: boolean;
        /**
         * 您可以禁用此身体上的睡眠。 如果禁用睡眠，身体将被唤醒
         */
        isSleepingAllowed: boolean;
        /**
         * 设置身体的睡眠状态。 睡觉的身体具有非常低的CPU成本
         */
        isAwake: boolean;
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
        enabled: boolean;
        /**
         * 将此主体设置为固定旋转。 这导致质量被重置
         */
        fixedRotation: boolean;
        /** 获取连接到此实体的所有Fixture */
        fixtureList: Fixture[];
        /** 获取连接到该实体的所有关节的列表 */
        jointList: JointEdge;
        contactList: ContactEdge;
        /**
         * 获取世界原点位置
         */
        position: es.Vector2;
        /**
         * 以显示单位获取/设置世界原点位置
         */
        displayPosition: es.Vector2;
        rotation: number;
        /**
         * 获取或设置一个值，该值指示此主体是否为静态
         */
        isStatic: boolean;
        /**
         * 获取或设置一个值，该值指示此物体是否运动
         */
        isKinematic: boolean;
        /**
         * 获取或设置一个值，该值指示此主体是否为动态的
         */
        isDynamic: boolean;
        /** 获取或设置一个值，该值指示此物体是否忽略重力 */
        ignoreGravity: boolean;
        /** 获取质心的世界位置 */
        readonly worldCenter: es.Vector2;
        /**
         * 获取质心的本地位置
         */
        localCenter: es.Vector2;
        /**
         * 获取或设置质量。 通常以千克（kg）为单位
         */
        mass: number;
        /**
         * 获取或设置物体绕局部原点的旋转惯量。 通常以kg-m ^ 2为单位
         */
        inertia: number;
        restitution: number;
        friction: number;
        collisionCategories: Category;
        collidesWith: Category;
        /**
         * 2×2矩阵。
         * 以主要列的顺序存储。
         * 身体对象可以定义希望忽略CCD的身体的类别。
         * 这使得某些物体可以配置为忽略CCD，而由于内容的制备方式，这些物体不是渗透问题。
         * 将此与World.SolveTOI中另一个Body的灯具CollisionCategories进行比较。
         */
        ignoreCCDWith: Category;
        collisionGroup: number;
        isSensor: boolean;
        ignoreCCD: boolean;
        /**
         * 为身体上的每个fixture连接onCollision事件
         */
        addOnCollision(value: onCollisionEventHandler): void;
        removeOnCollision(value: onCollisionEventHandler): void;
        /**
         * 为身体上的每个fixture连接onSeparation事件
         * @param value
         */
        addOnSeparation(value: onSeperationEventHandler): void;
        removeOnSeparation(value: onSeperationEventHandler): void;
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
        constructor(world: World, position?: es.Vector2, rotation?: number, bodyType?: BodyType, userdata?: any);
        resetDynamics(): void;
        createFixture(shape: Shape, userData?: any): Fixture;
        destroyFixture(fixture: Fixture): void;
    }
}
declare module physics {
    /**
     * 一种支撑多个可分开的Fixture的主体
     */
    class BreakableBody {
        isBroken: boolean;
        mainBody: Body;
        parts: Fixture[];
        /**
         * 分解身体所需的力。默认值：500
         */
        strength: number;
        _angularVelocitiesCache: number[];
        _break: boolean;
        _velocitiesCache: es.Vector2[];
        _world: World;
        constructor(world: World, vertices: Vertices[], density: number, position?: es.Vector2, rotation?: number);
        onPostSolve(contact: Contact, impulse: ContactVelocityConstraint): void;
        update(): void;
        decompose(): void;
    }
}
declare module physics {
    class ContactManager {
        broadPhase: DynamicTreeBroadPhase;
        contactList: Contact[];
        activeContacts: Set<Contact>;
        /**
         * 更新期间使用的活动联系人的临时副本，因此哈希集可以在更新期间添加/删除成员。
         * 每次更新后都会清除此列表。
         */
        activeList: Contact[];
        /** 创建contact时触发  */
        onBeginContact: beginContactDelegate[];
        /** Contact管理器使用的过滤器 */
        onContactFilter: collisionFilterDelegate[];
        /** 删除contact时触发  */
        onEndContact: endContactDelegate[];
        /** 当broadphase检测到两个fixture彼此靠近时触发 */
        onBroadphaseCollision: broadphaseDelegate[];
        /** 求解器运行后触发  */
        onPostSolve: postSolveDelegate[];
        /** 在求解器运行之前触发  */
        onPreSolve: preSolveDelegate[];
        constructor(broadPhase: DynamicTreeBroadPhase);
        addPair(proxyA: FixtureProxy, proxyB: FixtureProxy): void;
        findNewContacts(): void;
        destroy(contact: Contact): void;
    }
}
declare module physics {
    /**
     * 这是一个内部类
     */
    class Island {
    }
}
declare module physics {
    class TimeStep {
        dt: number;
        dtRatio: number;
        inv_dt: number;
    }
    class Position {
        c: es.Vector2;
        a: number;
    }
    class Velocity {
        v: es.Vector2;
        w: number;
    }
    class SolverData {
        step: TimeStep;
        positions: Position[];
        velocities: Velocity[];
    }
}
declare module physics {
    /**
     * 管理着所有物理实体，动态仿真和异步查询
     */
    class World {
        controllerList: Controller[];
        breakableBodyList: BreakableBody[];
        updateTime: number;
        continuousPhysicsTime: number;
        controllersUpdateTime: number;
        addRemoveTime: number;
        newContactsTime: number;
        ContactsUpdateTime: number;
        solveUpdateTime: number;
        /**
         * 获取广相代理的数量
         */
        /**
         * 更改全局重力向量
         */
        gravity: es.Vector2;
        /**
         * 获取contact管理器进行测试
         */
        contactManager: ContactManager;
        /**
         * 获取世界身体列表
         */
        bodyList: Body[];
        awakeBodySet: Set<Body>;
        awakeBodyList: Body[];
        islandSet: Set<Body>;
        TOISet: Set<Body>;
        jointList: Joint[];
        /**
         * 获取世界contact列表。
         * 对于返回的contact，请使用Contact.GetNext获取世界列表中的下一个contact。
         * 空contact表示列表的末尾。
         */
        readonly contactList: Contact[];
        /**
         * 如果为假，则整个模拟停止。 它仍然处理添加和删除的几何图形
         */
        enabled: boolean;
        island: Island;
        _tempOverlapCircle: CircleShape;
        onBodyAdded: bodyDelegate[];
        onBodyRemoved: bodyDelegate[];
        onFixtureAdded: fixtureDelegate[];
        onFixtureRemoved: fixtureDelegate[];
        onJointAdded: jointDelegate[];
        onJointRemoved: jointDelegate[];
        onControllerAdded: controllerDelegate[];
        onControllerRemoved: controllerDelegate[];
        _invDt0: number;
        _stack: Body[];
        _stepComplete: boolean;
        _bodyAddList: Set<Body>;
        _bodyRemoveList: Set<Body>;
        _jointAddList: Set<Joint>;
        _jointRemoveList: Set<Joint>;
        _queryAABBCallback: (fixture: Fixture, r: boolean) => void;
        _queryAABBCallbackWrpper: (a: number, r: boolean) => void;
        _rayCastCallback: (fixture: Fixture, a: es.Vector2, b: es.Vector2, c: number, d: number) => void;
        _rayCastCallbackWrapper: (input: RayCastInput, a: number, b: number) => void;
        _input: TOIInput;
        _myFixture: Fixture;
        _point1: es.Vector2;
        _point2: es.Vector2;
        _testPointAllFixtures: Fixture[];
        _watch: es.Stopwatch;
        _contactPool: Contact[];
        _worldHasNewFixture: boolean;
        constructor(gravity: es.Vector2);
        queryAABBCallbackWrapper(proxyId: number): void;
    }
}
declare module physics {
    type beginContactDelegate = (contact: Contact) => boolean;
    type collisionFilterDelegate = (fixtureA: Fixture, fixtureB: Fixture) => boolean;
    type endContactDelegate = (contact: Contact) => void;
    type broadphaseDelegate = (proxyA: FixtureProxy, proxyB: FixtureProxy) => void;
    type postSolveDelegate = (contact: Contact, impulse: ContactVelocityConstraint) => void;
    type preSolveDelegate = (contact: Contact, oldManifold: Manifold) => void;
    type afterCollisionEventHandler = (fixtureA: Fixture, fixtureB: Fixture, contact: Contact, impulse: ContactVelocityConstraint) => void;
    type beforeCollisionEventHandler = (fixtureA: Fixture, fixtureB: Fixture) => boolean;
    type onCollisionEventHandler = (fixtureA: Fixture, fixtureB: Fixture, contact: Contact) => boolean;
    type onSeperationEventHandler = (fixtureA: Fixture, fixtureB: Fixture) => void;
    type bodyDelegate = (body: Body) => void;
    type fixtureDelegate = (fixture: Fixture) => void;
    type jointDelegate = (joint: Joint) => void;
    type controllerDelegate = (controller: Controller) => void;
}
declare module physics {
    enum ContactType {
        notSupported = 0,
        polygon = 1,
        polygonAndCircle = 2,
        circle = 3,
        edgeAndPolygon = 4,
        edgeAndCircle = 5,
        chainAndPolygon = 6,
        chainAndCircle = 7
    }
    /**
     * 该类管理两个形状之间的接触。
     * 广相中每个重叠的AABB都有一个接触（除非经过过滤）。
     * 因此，可能存在没有接触点的接触对象
     */
    class Contact {
        fixtureA: Fixture;
        fixtureB: Fixture;
        friction: number;
        restitution: number;
        /**
         * 获取接触manifold。 除非您了解Box2D的内部结构，否则请勿修改manifold
         */
        manifold: Manifold;
        /**
         * 获取或设置传送带行为所需的切线速度。 以米/秒为单位。
         */
        tangentSpeed: number;
        /**
         * 启用/禁用此contact。 可以在预解决的联系侦听器内部使用。
         * 仅在当前时间步（或连续碰撞中的子步）禁用该接触。
         * 注意：如果将Enabled设置为true或false常数，请改用显式的Enable或Disable函数，以免CPU执行分支操作。
         */
        enabled: boolean;
        /** 获取fixtureA的子基本索引 */
        childIndexA: number;
        /** 获取fixtureB的子基本索引 */
        childIndexB: number;
        /** 确定此contact是否在触摸 */
        isTouching: boolean;
        islandFlag: boolean;
        toiFlag: boolean;
        filterFlag: boolean;
        _type: ContactType;
        static _edge: EdgeShape;
        static _contactRegisters: ContactType[][];
        _nodeA: ContactEdge;
        _nodeB: ContactEdge;
        _toiCount: number;
        _toi: number;
        constructor(fA: Fixture, indexA: number, fB: Fixture, indexB: number);
        resetRestitution(): void;
        resetFriction(): void;
        getWorldManifold(normal: es.Vector2, points: FixedArray2<es.Vector2>): void;
        destroy(): void;
    }
    /**
     * 接触边缘用于在接触图中将实体和接触连接在一起，其中每个实体是一个节点，每个接触是一个边缘。
     * 接触边属于每个附加主体中维护的双向链表。
     * 每个接触点都有两个接触点，每个附着体一个。
     */
    class ContactEdge {
        /** contact */
        contact: Contact;
        /**
         * body的contact列表中的下一个接触边
         */
        next: ContactEdge;
        /**
         * 提供快速访问连接的另一个主体的方法
         */
        other: Body;
        /**
         * 身体的联系人列表中的前一个接触边
         */
        prev: ContactEdge;
    }
}
declare module physics {
    class VelocityConstraintPoint {
        RA: es.Vector2;
        RB: es.Vector2;
        normalImpulse: number;
        tangentImpulse: number;
        normalMass: number;
        tangentMass: number;
        velocityBias: number;
    }
    class ContactVelocityConstraint {
        points: VelocityConstraintPoint[];
        normal: es.Vector2;
        normalMass: Mat22;
        k: Mat22;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
    }
    class ContactSolver {
        _step: TimeStep;
        _positions: Position[];
        _velocities: Velocity[];
        _contacts: Contact[];
        _count: number;
        reset(step: TimeStep, count: number, contacts: Contact[], positions: Position[], velocities: Velocity[]): void;
    }
}
declare module physics {
    enum JointType {
        unknown = 0,
        revolute = 1,
        prismatic = 2,
        distance = 3,
        pulley = 4,
        gear = 5,
        wheel = 6,
        weld = 7,
        friction = 8,
        rope = 9,
        motor = 10,
        angle = 11,
        fixedMouse = 12
    }
    enum LimitState {
        inactive = 0,
        atLower = 1,
        atUpper = 2,
        equal = 3
    }
    /**
     * 关节边用于在一个关节图中将实体和关节连接在一起，其中每个实体是一个节点，每个关节是一个边。
     * 关节边属于每个附加主体中维护的双向链表。
     * 每个关节都有两个关节节点，每个连接的节点一个
     */
    class JointEdge {
        /** joint */
        joint: Joint;
        /** 人体关节列表中的下一个关节边缘 */
        next: JointEdge;
        /** 提供快速访问连接的另一个主体的方法 */
        other: Body;
        /** 人体关节列表中的上一个关节边缘 */
        prev: JointEdge;
    }
    abstract class Joint {
        /**
         * 指示是否启用了此联接。 禁用关节意味着该关节仍在仿真中，但是不活动
         */
        enabled: boolean;
        /**
         * 获取或设置关节的类型
         */
        jointType: JointType;
        /**
         * 获取第一个附着在此关节上的物体
         */
        bodyA: Body;
        /**
         * 获取第二个附着在此关节上的物体
         */
        bodyB: Body;
        /**
         * 在世界坐标中获取bodyA上的锚点。
         * 在某些关节上，此值指示世界范围内的锚点
         */
        abstract worldAnchorA: es.Vector2;
        /**
         * 在世界坐标中获取bodyB上的锚点。
         * 在某些关节上，此值指示世界范围内的锚点。
         */
        abstract woldAnchorB: es.Vector2;
        /**
         * 设置用户数据指针
         */
        userData: any;
        /**
         * 如果附着的物体发生碰撞，请将此标志设置为true
         */
        collideConnected: boolean;
        /**
         * 断点只是表示JointError在中断之前可以达到的最大值。
         * 默认值为Number.MaxValue，这表示它永不中断。
         */
        breakpoint: number;
        /**
         * 关节断开时触发
         */
        onJointBroke: (joint: Joint, value: number) => void;
        _breakpoint: number;
        _breakpointSquared: number;
        edgeA: JointEdge;
        edgeB: JointEdge;
        islandFlag: boolean;
        protected constructor(bodyA?: Body, bodyB?: Body);
        /**
         * 在牛顿的关节锚点处获得对身体的反作用力
         * @param invDt
         */
        abstract getReactionForce(invDt: number): es.Vector2;
        /**
         * 以N * m为单位获取关节锚点处的车身反作用扭矩
         * @param invDt
         */
        abstract getReacionTorque(invDt: number): number;
        protected wakeBodies(): void;
        isFixedType(): boolean;
    }
}
