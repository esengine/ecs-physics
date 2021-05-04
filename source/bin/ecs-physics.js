"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var physics;
(function (physics) {
    var Category;
    (function (Category) {
        Category[Category["none"] = 0] = "none";
        Category[Category["all"] = Number.MAX_VALUE] = "all";
        Category[Category["cat1"] = 1] = "cat1";
        Category[Category["cat2"] = 2] = "cat2";
        Category[Category["cat3"] = 4] = "cat3";
        Category[Category["cat4"] = 8] = "cat4";
        Category[Category["cat5"] = 16] = "cat5";
        Category[Category["cat6"] = 32] = "cat6";
        Category[Category["cat7"] = 64] = "cat7";
        Category[Category["cat8"] = 128] = "cat8";
        Category[Category["cat9"] = 256] = "cat9";
        Category[Category["cat10"] = 512] = "cat10";
        Category[Category["cat11"] = 1024] = "cat11";
        Category[Category["cat12"] = 2048] = "cat12";
        Category[Category["cat13"] = 4096] = "cat13";
        Category[Category["cat14"] = 8192] = "cat14";
        Category[Category["cat15"] = 16384] = "cat15";
        Category[Category["cat16"] = 32768] = "cat16";
        Category[Category["cat17"] = 65536] = "cat17";
        Category[Category["cat18"] = 131072] = "cat18";
        Category[Category["cat19"] = 262144] = "cat19";
        Category[Category["cat20"] = 524288] = "cat20";
        Category[Category["cat21"] = 1048576] = "cat21";
        Category[Category["cat22"] = 2097152] = "cat22";
        Category[Category["cat23"] = 4194304] = "cat23";
        Category[Category["cat24"] = 8388608] = "cat24";
        Category[Category["cat25"] = 16777216] = "cat25";
        Category[Category["cat26"] = 33554432] = "cat26";
        Category[Category["cat27"] = 67108864] = "cat27";
        Category[Category["cat28"] = 134217728] = "cat28";
        Category[Category["cat29"] = 268435456] = "cat29";
        Category[Category["cat30"] = 536870912] = "cat30";
        Category[Category["cat31"] = 1073741824] = "cat31";
    })(Category = physics.Category || (physics.Category = {}));
    /**
     * 该代理在内部用于将Fixture连接到广相
     */
    var FixtureProxy = /** @class */ (function () {
        function FixtureProxy() {
        }
        return FixtureProxy;
    }());
    physics.FixtureProxy = FixtureProxy;
    /**
     * Fixture用于将Shape附加到主体以进行碰撞检测。
     * Fixture从其父级继承其变换。 Fixture包含其他非几何数据，例如摩擦，碰撞过滤器等。
     * Fixture是通过Body.CreateFixture创建的。
     *  警告：您不能重复使用Fixture。
     */
    var Fixture = /** @class */ (function () {
        function Fixture(body, shape, userData) {
            if (userData === void 0) { userData = null; }
            this.body = body;
            this.userData = userData;
            this.shape = shape.clone();
            this.fixtureId = Fixture._fixtureIdCounter++;
            this._collisonCategories = physics.Settings.defaultFixtureCollisionCategories;
            this._collidesWith = physics.Settings.defaultFixtureCollidesWith;
            this._collisionGroup = 0;
            this._colisionIgnores = new Set();
            this.ignoreCCDWith = physics.Settings.defaultFixtureIgnoreCCDWith;
            this.friction = 0.2;
            this.restitution = 0;
        }
        Object.defineProperty(Fixture.prototype, "collisionGroup", {
            get: function () {
                return this._collisionGroup;
            },
            /**
             * 默认为0
             * 如果Settings.useFPECollisionCategories设置为false：
             * 碰撞组允许某个对象组从不碰撞（负向）或始终碰撞（正向）。
             * 零表示没有碰撞组。 非零组过滤始终会赢得掩码位。
             * 如果Settings.useFPECollisionCategories设置为true：
             * 如果2个fixture在同一个碰撞组中，它们将不会发生碰撞。
             */
            set: function (value) {
                if (this._collisionGroup == value)
                    return;
                this._collisionGroup = value;
                this.refilter();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixture.prototype, "collidesWith", {
            /**
             * 默认为Category.All
             *
             * 碰撞掩码位。
             * 这说明了该灯具将接受碰撞的类别。
             * 使用Settings.UseFPECollisionCategories更改行为。
             */
            get: function () {
                return this._collidesWith;
            },
            set: function (value) {
                if (this._collidesWith == value)
                    return;
                this._collidesWith = value;
                this.refilter();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixture.prototype, "collisionCategories", {
            /**
             * 此设备属于碰撞类别。
             * 如果Settings.UseFPECollisionCategories设置为false：
             * 默认设置为Category.Cat1
             *
             * 如果Settings.UseFPECollisionCategories设置为true：
             * 默认设置为Category.All
             */
            get: function () {
                return this._collisonCategories;
            },
            set: function (value) {
                if (this._collisonCategories == value)
                    return;
                this._collisonCategories = value;
                this.refilter();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixture.prototype, "isSensor", {
            /**
             * 获取或设置一个值，该值指示此灯具是否是传感器
             */
            get: function () {
                return this._isSensor;
            },
            set: function (value) {
                if (this.body != null)
                    this.body.isAwake = true;
                this._isSensor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixture.prototype, "friction", {
            /**
             * 设置摩擦系数。 这将不会改变现有触点的摩擦
             */
            get: function () {
                return this._friction;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                this._friction = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixture.prototype, "restitution", {
            /**
             * 设置恢复系数
             */
            get: function () {
                return this._restitution;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                this._restitution = value;
            },
            enumerable: true,
            configurable: true
        });
        Fixture.prototype.dispose = function () {
            if (!this.isDisposed) {
                // this.body.de
                // TODO: destoryFixture
            }
        };
        /**
         * 恢复此fixture与提供的fixture之间的碰撞
         * @param fixture
         */
        Fixture.prototype.restoreCollisionWith = function (fixture) {
            if (this._colisionIgnores.has(fixture.fixtureId)) {
                this._colisionIgnores.delete(fixture.fixtureId);
                this.refilter();
            }
        };
        /**
         * 忽略此fixture与提供的fixture之间的碰撞
         * @param fixture
         */
        Fixture.prototype.ignoreCollisionWith = function (fixture) {
            if (!this._colisionIgnores.has(fixture.fixtureId)) {
                this._colisionIgnores.add(fixture.fixtureId);
                this.refilter();
            }
        };
        /**
         * 确定是否忽略此Fixture与提供的Fixture之间的碰撞
         * @param fixture
         * @returns
         */
        Fixture.prototype.isFixtureIgnored = function (fixture) {
            return this._colisionIgnores.has(fixture.fixtureId);
        };
        /**
         * contact是持久性的，除非标记为进行过滤，否则它们将保持持久性。
         * 此方法标记与主体关联的所有contact以进行过滤
         */
        Fixture.prototype.refilter = function () {
            // 标记关联的contact以进行过滤
            var edge = this.body.contactList;
            while (edge != null) {
                var contact = edge.contact;
                var fixtureA = contact.fixtureA;
                var fixtureB = contact.fixtureB;
                if (fixtureA == this || fixtureB == this) {
                    contact.filterFlag = true;
                }
                edge = edge.next;
            }
            var world = this.body._world;
            if (world == null) {
                return;
            }
            var broadPhase = world.contactManager.broadPhase;
            // for (let i = 0; i < this.proxyCount; ++ i)
            // broadPhase
            // TODO: touchProxy
        };
        return Fixture;
    }());
    physics.Fixture = Fixture;
})(physics || (physics = {}));
///<reference path="./Dynamics/Fixture.ts" />
var physics;
///<reference path="./Dynamics/Fixture.ts" />
(function (physics) {
    var Settings = /** @class */ (function () {
        function Settings() {
        }
        Settings.maxFloat = 3.402823466e+38;
        Settings.epsilon = 1.192092896e-07;
        Settings.pi = 3.14159265359;
        /**
         * Fixture构造函数将其用作Fixture.collisionCategories成员的默认值。
         * 请注意，您可能需要根据上面的UseFPECollisionCategories设置进行更改
         */
        Settings.defaultFixtureCollisionCategories = physics.Category.cat1;
        /**
         * Fixture构造函数将其用作Fixture.collidesWith成员的默认值
         */
        Settings.defaultFixtureCollidesWith = physics.Category.all;
        /**
         * Fixture构造函数将其用作Fixture.ignoreCCDWith成员的默认值
         */
        Settings.defaultFixtureIgnoreCCDWith = physics.Category.none;
        /**
         * 用作碰撞和约束公差的小长度。
         * 通常，它被选择为在数值上有意义，但在视觉上却无关紧要
         */
        Settings.linearSlop = 0.005;
        /**
         * 多边形/边缘形状蒙皮的半径。 这不应该被修改。
         * 使其更小意味着多边形将没有足够的缓冲区来进行连续碰撞。
         * 使其更大可能会产生顶点碰撞的假象。
         */
        Settings.polygonRadius = (2 * Settings.linearSlop);
        /**
         * 凸多边形上的最大顶点数
         */
        Settings.maxPolygonVertices = 8;
        /**
         * 如果为true，它将在所有多边形输入上运行GiftWrap凸包。
         * 在给定随机输入的情况下，这会使引擎更稳定，但是如果多边形的创建速度更为重要，则可能需要将其设置为false。
         */
        Settings.useConvexHullPolygons = true;
        return Settings;
    }());
    physics.Settings = Settings;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var RayCastInput = /** @class */ (function () {
        function RayCastInput() {
        }
        return RayCastInput;
    }());
    physics.RayCastInput = RayCastInput;
    /**
     * 射线投射输出数据
     */
    var RayCastOutput = /** @class */ (function () {
        function RayCastOutput() {
        }
        return RayCastOutput;
    }());
    physics.RayCastOutput = RayCastOutput;
    var ManifoldType;
    (function (ManifoldType) {
        ManifoldType[ManifoldType["circles"] = 0] = "circles";
        ManifoldType[ManifoldType["faceA"] = 1] = "faceA";
        ManifoldType[ManifoldType["faceB"] = 2] = "faceB";
    })(ManifoldType = physics.ManifoldType || (physics.ManifoldType = {}));
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
    var Manifold = /** @class */ (function () {
        function Manifold() {
        }
        return Manifold;
    }());
    physics.Manifold = Manifold;
    /**
     * ManifoldPoint是属于接触Manifold的接触点。
     * 它包含与接触点的几何形状和动力学有关的详细信息。
     * 局部点的使用取决于流形类型：
     * -ShapeType.Circles：圆B的本地中心
     * -SeparationFunction.FaceA：cirlceB的局部中心或polygonB的剪辑点
     * -SeparationFunction.FaceB：polygonA的剪辑点此结构跨时间步存储，因此我们将其保持较小。
     * 注意：这些脉冲用于内部缓存，可能无法提供可靠的接触力，尤其是对于高速碰撞。
     */
    var ManifoldPoint = /** @class */ (function () {
        function ManifoldPoint() {
        }
        return ManifoldPoint;
    }());
    physics.ManifoldPoint = ManifoldPoint;
    /**
     * ContactID有助于热启动
     */
    var ContactID = /** @class */ (function () {
        function ContactID() {
        }
        return ContactID;
    }());
    physics.ContactID = ContactID;
    /**
     * 相交以形成接触点的要素此长度必须为4个字节或更少
     */
    var ContactFeature = /** @class */ (function () {
        function ContactFeature() {
        }
        return ContactFeature;
    }());
    physics.ContactFeature = ContactFeature;
    /**
     * 轴对齐的边界框
     */
    var AABB = /** @class */ (function () {
        function AABB(min, max) {
            this.lowerBound = min;
            this.upperBound = max;
        }
        Object.defineProperty(AABB.prototype, "width", {
            get: function () {
                return this.upperBound.x - this.lowerBound.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "height", {
            get: function () {
                return this.upperBound.y - this.lowerBound.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "center", {
            /** 获取AABB的中心 */
            get: function () {
                return es.Vector2.add(this.lowerBound, this.upperBound).multiplyScaler(0.5);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "extents", {
            /** 获取AABB的范围（半宽） */
            get: function () {
                return es.Vector2.subtract(this.upperBound, this.lowerBound).multiplyScaler(0.5);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "perimeter", {
            /** 获取周长  */
            get: function () {
                var wx = this.upperBound.x - this.lowerBound.x;
                var wy = this.upperBound.y - this.lowerBound.y;
                return 2 * (wx + wy);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "vertices", {
            /**
             * 获取AABB的顶点
             */
            get: function () {
                var vertices = new physics.Vertices();
                vertices.push(this.upperBound);
                vertices.push(new es.Vector2(this.upperBound.x, this.lowerBound.y));
                vertices.push(this.lowerBound);
                vertices.push(new es.Vector2(this.lowerBound.x, this.upperBound.y));
                return vertices;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "q1", {
            get: function () {
                return new AABB(this.center, this.upperBound);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "q2", {
            get: function () {
                return new AABB(new es.Vector2(this.lowerBound.x, this.center.y), new es.Vector2(this.center.x, this.upperBound.y));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "q3", {
            get: function () {
                return new AABB(this.lowerBound, this.center);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "q4", {
            get: function () {
                return new AABB(new es.Vector2(this.center.x, this.lowerBound.y), new es.Vector2(this.upperBound.x, this.center.y));
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 验证边界已排序。 边界是有效数字（不是NaN）
         * @returns
         */
        AABB.prototype.isValid = function () {
            var d = es.Vector2.subtract(this.upperBound, this.lowerBound);
            var valid = d.x >= 0 && d.y >= 0;
            valid = valid && this.lowerBound.isValid() && this.upperBound.isValid();
            return valid;
        };
        /**
         * 将AABB合并到此
         * @param aabb
         */
        AABB.prototype.combine = function (aabb) {
            this.lowerBound = es.Vector2.min(this.lowerBound, aabb.lowerBound);
            this.upperBound = es.Vector2.max(this.upperBound, aabb.upperBound);
        };
        /**
         * 该aabb是否包含提供的AABB
         * @param aabb
         * @returns
         */
        AABB.prototype.contains = function (aabb) {
            var result = true;
            result = result && this.lowerBound.x <= aabb.lowerBound.x;
            result = result && this.lowerBound.y <= aabb.lowerBound.y;
            result = result && aabb.upperBound.x <= this.upperBound.x;
            result = result && aabb.upperBound.y <= this.upperBound.y;
            return result;
        };
        /**
         * 测试两个AABB是否重叠
         * @param a
         * @param b
         */
        AABB.testOverlap = function (a, b) {
            var d1 = es.Vector2.subtract(b.lowerBound, a.upperBound);
            var d2 = es.Vector2.subtract(a.lowerBound, b.upperBound);
            if (d1.x > 0 || d1.y > 0)
                return false;
            if (d2.x > 0 || d2.y > 0)
                return false;
            return true;
        };
        return AABB;
    }());
    physics.AABB = AABB;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * GJK算法使用距离代理。 它封装了任何形状。
     */
    var DistanceProxy = /** @class */ (function () {
        function DistanceProxy() {
            this.vertices = new physics.Vertices();
        }
        DistanceProxy.prototype.set = function (shape, index) {
            switch (shape.shapeType) {
                case physics.ShapeType.circle:
                    {
                        var circle = shape;
                        this.vertices.length = 0;
                        this.vertices.push(circle.position);
                        this.radius = circle.radius;
                    }
                    break;
                case physics.ShapeType.polygon:
                    {
                        var polygon = shape;
                        this.vertices.length = 0;
                        for (var i = 0; i < polygon.vertices.length; i++) {
                            this.vertices.push(polygon.vertices[i]);
                        }
                        this.radius = polygon.radius;
                    }
                    break;
                case physics.ShapeType.chain:
                    {
                        var chain = shape;
                        console.assert(0 <= index && index < chain.vertices.length);
                        this.vertices.length = 0;
                        this.vertices.push(chain.vertices[index]);
                        this.vertices.push(index + 1 < chain.vertices.length ? chain.vertices[index + 1] : chain.vertices[0]);
                        this.radius = chain.radius;
                    }
                    break;
                case physics.ShapeType.edge:
                    {
                        var edge = shape;
                        this.vertices.length = 0;
                        this.vertices.push(edge.vertex1);
                        this.vertices.push(edge.vertex2);
                        this.radius = edge.radius;
                    }
                    break;
                default:
                    console.assert(false);
                    break;
            }
        };
        return DistanceProxy;
    }());
    physics.DistanceProxy = DistanceProxy;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 动态树中的节点。 客户端不直接与此交互
     */
    var TreeNode = /** @class */ (function () {
        function TreeNode() {
        }
        TreeNode.prototype.isLeaf = function () {
            return this.child1 == DynamicTree.nullNode;
        };
        return TreeNode;
    }());
    physics.TreeNode = TreeNode;
    /**
     * 动态树将数据排列在二叉树中，以加速诸如体积查询和射线投射之类的查询。
     * 叶子是带有AABB的代理。
     * 在树中，我们通过Settings.b2_fatAABBFactor扩展代理AABB，以便代理AABB大于客户端对象。
     * 这允许客户端对象少量移动而不会触发树更新。
     * 节点是可合并和可重定位的，因此我们使用节点索引而不是指针。
     */
    var DynamicTree = /** @class */ (function () {
        /**
         * 构造树将初始化节点池
         */
        function DynamicTree() {
            this._raycastStack = [];
            this._queryStack = [];
            this._root = DynamicTree.nullNode;
            this._nodeCapacity = 16;
            this._nodeCount = 0;
            this._nodes = [];
            for (var i = 0; i < this._nodeCapacity - 1; ++i) {
                this._nodes[i] = new TreeNode();
                this._nodes[i].parentOrNext = i + 1;
                this._nodes[i].height = 1;
            }
            this._nodes[this._nodeCapacity - 1] = new TreeNode();
            this._nodes[this._nodeCapacity - 1].parentOrNext = DynamicTree.nullNode;
            this._nodes[this._nodeCapacity - 1].height = 1;
            this._freeList = 0;
        }
        Object.defineProperty(DynamicTree.prototype, "height", {
            /**
             * 以O（N）时间计算二叉树的高度。 不应该经常调用。
             */
            get: function () {
                if (this._root == DynamicTree.nullNode)
                    return 0;
                return this._nodes[this._root].height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicTree.prototype, "areaRatio", {
            /**
             * 获取节点面积与根面积之和的比值
             */
            get: function () {
                if (this._root == DynamicTree.nullNode)
                    return 0;
                var root = this._nodes[this._root];
                var rootArea = root.aabb.perimeter;
                var totalArea = 0;
                for (var i = 0; i < this._nodeCapacity; ++i) {
                    var node = this._nodes[i];
                    if (node.height < 0) {
                        continue;
                    }
                    totalArea += node.aabb.perimeter;
                }
                return totalArea / rootArea;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicTree.prototype, "maxBalance", {
            /**
             * 获取树中节点的最大余额。 平衡是节点的两个子节点的高度差。
             */
            get: function () {
                var maxBalance = 0;
                for (var i = 0; i < this._nodeCapacity; ++i) {
                    var node = this._nodes[i];
                    if (node.height <= 1)
                        continue;
                    console.assert(node.isLeaf() == false);
                    var child1 = node.child1;
                    var child2 = node.child2;
                    var balance = Math.abs(this._nodes[child2].height - this._nodes[child1].height);
                    maxBalance = Math.max(maxBalance, balance);
                }
                return maxBalance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 在树中创建一个代理作为叶节点。 我们返回节点的索引而不是指针，以便我们可以增加节点池
         * @param aabb
         * @param userData
         */
        DynamicTree.prototype.addProxy = function (aabb, userData) {
            // let proxyId = 
        };
        DynamicTree.nullNode = -1;
        return DynamicTree;
    }());
    physics.DynamicTree = DynamicTree;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 广义阶段用于计算对并执行体积查询和射线投射。
     * 这个广义阶段不会持久存在对。
     * 相反，这会报告潜在的新对。
     * 客户端可以使用新的对并跟踪后续的重叠。
     */
    var DynamicTreeBroadPhase = /** @class */ (function () {
        function DynamicTreeBroadPhase() {
        }
        return DynamicTreeBroadPhase;
    }());
    physics.DynamicTreeBroadPhase = DynamicTreeBroadPhase;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var TOIInput = /** @class */ (function () {
        function TOIInput() {
            this.proxyA = new physics.DistanceProxy();
            this.proxyB = new physics.DistanceProxy();
        }
        return TOIInput;
    }());
    physics.TOIInput = TOIInput;
    var TOIOutputState;
    (function (TOIOutputState) {
        TOIOutputState[TOIOutputState["unknown"] = 0] = "unknown";
        TOIOutputState[TOIOutputState["failed"] = 1] = "failed";
        TOIOutputState[TOIOutputState["overlapped"] = 2] = "overlapped";
        TOIOutputState[TOIOutputState["touching"] = 3] = "touching";
        TOIOutputState[TOIOutputState["seperated"] = 4] = "seperated";
    })(TOIOutputState = physics.TOIOutputState || (physics.TOIOutputState = {}));
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 这将保存为形状计算的质量数据
     */
    var MassData = /** @class */ (function () {
        function MassData() {
        }
        MassData.equals = function (left, right) {
            return (left.area == right.area && left.mass == right.mass && left.centroid == right.centroid &&
                left.inertia == right.inertia);
        };
        MassData.notEquals = function (left, right) {
            return !MassData.equals(left, right);
        };
        MassData.prototype.equals = function (other) {
            return MassData.equals(this, other);
        };
        return MassData;
    }());
    physics.MassData = MassData;
    var ShapeType;
    (function (ShapeType) {
        ShapeType[ShapeType["unknown"] = -1] = "unknown";
        ShapeType[ShapeType["circle"] = 0] = "circle";
        ShapeType[ShapeType["edge"] = 1] = "edge";
        ShapeType[ShapeType["polygon"] = 2] = "polygon";
        ShapeType[ShapeType["chain"] = 3] = "chain";
        ShapeType[ShapeType["typeCount"] = 4] = "typeCount";
    })(ShapeType = physics.ShapeType || (physics.ShapeType = {}));
    /**
     * 形状用于碰撞检测。 您可以根据需要创建形状。
     * 创建fixture后，将自动创建World中用于模拟的形状。
     * 形状可以封装一个或多个子形状。
     */
    var Shape = /** @class */ (function () {
        function Shape(density) {
            this._density = density;
            this.shapeType = ShapeType.unknown;
        }
        Object.defineProperty(Shape.prototype, "density", {
            /**
             * 获取或设置密度。 更改密度会导致重新计算形状属性
             */
            get: function () {
                return this._density;
            },
            set: function (value) {
                console.assert(value >= 0);
                this._density = value;
                this.computeProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape.prototype, "radius", {
            /**
             * 形状的半径更改半径会重新计算形状属性
             */
            get: function () {
                return this._radius;
            },
            set: function (value) {
                console.assert(value >= 0);
                this._radius = value;
                this._2radius = this._radius * this._radius;
                this.computeProperties();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据类型和属性将此形状与另一个形状进行比较
         * @param shape
         * @returns
         */
        Shape.prototype.compareTo = function (shape) {
            return false;
        };
        return Shape;
    }());
    physics.Shape = Shape;
})(physics || (physics = {}));
///<reference path="Shape.ts" />
var physics;
///<reference path="Shape.ts" />
(function (physics) {
    /**
     * 线段（边缘）形状。 这些可以成环或成环连接到其他边缘形状。 连接信息用于确保正确的接触法线。
     */
    var EdgeShape = /** @class */ (function (_super) {
        __extends(EdgeShape, _super);
        function EdgeShape(start, end) {
            var _this = _super.call(this, 0) || this;
            _this.shapeType = physics.ShapeType.edge;
            _this._radius = physics.Settings.polygonRadius;
            if (start && end) {
                _this.set(start, end);
            }
            return _this;
        }
        Object.defineProperty(EdgeShape.prototype, "childCount", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EdgeShape.prototype, "vertex1", {
            get: function () {
                return this._vertex1;
            },
            set: function (value) {
                this._vertex1 = value;
                this.computeProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EdgeShape.prototype, "vertex2", {
            get: function () {
                return this._vertex2;
            },
            set: function (value) {
                this._vertex2 = value;
                this.computeProperties();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将此设置为孤立边
         * @param start
         * @param end
         */
        EdgeShape.prototype.set = function (start, end) {
            this._vertex1 = start;
            this._vertex2 = end;
            this.hasVertex0 = false;
            this.hasVertex3 = false;
            this.computeProperties();
        };
        EdgeShape.prototype.testPoint = function (transform, point) {
            return false;
        };
        EdgeShape.prototype.rayCast = function (output, input, transform, childIndex) {
            var p1 = physics.MathUtils.mul_rv(transform.q, es.Vector2.subtract(input.point1, transform.p));
            var p2 = physics.MathUtils.mul_rv(transform.q, es.Vector2.subtract(input.point2, transform.p));
            var d = es.Vector2.subtract(p2, p1);
            var v1 = this._vertex1.clone();
            var v2 = this._vertex2.clone();
            var e = es.Vector2.subtract(v2, v1);
            var normal = new es.Vector2(e.y, -e.x);
            es.Vector2Ext.normalize(normal);
            var numerator = es.Vector2.dot(normal, es.Vector2.subtract(v1, p1));
            var denominator = es.Vector2.dot(normal, d);
            if (denominator == 0)
                return false;
            var t = numerator / denominator;
            if (t < 0 || input.maxFraction < t)
                return false;
            var q = es.Vector2.add(p1, es.Vector2.multiplyScaler(d, t));
            var r = es.Vector2.subtract(v2, v1);
            var rr = es.Vector2.dot(r, r);
            if (rr == 0)
                return false;
            var s = es.Vector2.dot(es.Vector2.subtract(q, v1), r) / rr;
            if (s < 0 || 1 < s)
                return false;
            output.fraction = t;
            if (numerator > 0)
                output.normal = new es.Vector2(-normal.x, -normal.y);
            else
                output.normal = normal.clone();
            return true;
        };
        EdgeShape.prototype.computeAABB = function (aabb, transform, childIndex) {
            var v1 = physics.MathUtils.mul_tv(transform, this._vertex1);
            var v2 = physics.MathUtils.mul_tv(transform, this._vertex2);
            var lower = es.Vector2.min(v1, v2);
            var upper = es.Vector2.max(v1, v2);
            var r = new es.Vector2(this.radius, this.radius);
            aabb.lowerBound = es.Vector2.subtract(lower, r);
            aabb.upperBound = es.Vector2.add(upper, r);
        };
        EdgeShape.prototype.computeProperties = function () {
            this.massData.centroid = es.Vector2.add(this.vertex1, this.vertex2).multiplyScaler(0.5);
        };
        EdgeShape.prototype.computeSubmergedArea = function (normal, offset, xf, sc) {
            sc.x = 0;
            sc.y = 0;
            return 0;
        };
        EdgeShape.prototype.clone = function () {
            var clone = new EdgeShape();
            clone.shapeType = this.shapeType;
            clone._radius = this._radius;
            clone._density = this._density;
            clone.hasVertex0 = this.hasVertex0;
            clone.hasVertex3 = this.hasVertex3;
            clone.vertex0 = this.vertex0;
            clone._vertex1 = this._vertex1;
            clone._vertex2 = this._vertex2;
            clone.vertex2 = this.vertex3;
            clone.massData = this.massData;
            return clone;
        };
        return EdgeShape;
    }(physics.Shape));
    physics.EdgeShape = EdgeShape;
})(physics || (physics = {}));
///<reference path="./EdgeShape.ts" />
var physics;
///<reference path="./EdgeShape.ts" />
(function (physics) {
    /**
     * 链形状是线段的自由形式序列。
     * 链条有两个侧面碰撞，因此您可以使用内部和外部碰撞，因此可以使用任何缠绕顺序。
     * 连接信息用于创建平滑冲突。
     * 警告：如果存在自相交，则链条不会正确碰撞。
     */
    var ChainShape = /** @class */ (function (_super) {
        __extends(ChainShape, _super);
        function ChainShape(vertices, createLoop) {
            if (createLoop === void 0) { createLoop = false; }
            var _this = _super.call(this, 0) || this;
            _this.shapeType = physics.ShapeType.chain;
            _this._radius = physics.Settings.polygonRadius;
            if (vertices) {
                _this.setVertices(vertices, createLoop);
            }
            return _this;
        }
        Object.defineProperty(ChainShape.prototype, "childCount", {
            get: function () {
                return this.vertices.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChainShape.prototype, "prevVertex", {
            get: function () {
                return this._prevVertex;
            },
            set: function (value) {
                this._prevVertex = value;
                this._hasPrevVertex = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChainShape.prototype, "nextVertex", {
            get: function () {
                return this._nextVertex;
            },
            set: function (value) {
                this._nextVertex = value;
                this._hasNextVertex = true;
            },
            enumerable: true,
            configurable: true
        });
        ChainShape.prototype.getChildEdge = function (edge, index) {
            console.assert(0 <= index && index < this.vertices.length - 1);
            console.assert(edge != null);
            edge.shapeType = physics.ShapeType.edge;
            edge._radius = this._radius;
            edge.vertex1 = this.vertices[index + 0];
            edge.vertex2 = this.vertices[index + 1];
            if (index > 0) {
                edge.vertex0 = this.vertices[index - 1];
                edge.hasVertex0 = true;
            }
            else {
                edge.vertex0 = this._prevVertex;
                edge.hasVertex0 = this._hasPrevVertex;
            }
            if (index < this.vertices.length - 2) {
                edge.vertex3 = this.vertices[index + 2];
                edge.hasVertex3 = true;
            }
            else {
                edge.vertex3 = this._nextVertex;
                edge.hasVertex3 = this._hasNextVertex;
            }
        };
        ChainShape.prototype.setVertices = function (vertices, createLoop) {
            if (createLoop === void 0) { createLoop = false; }
            console.assert(vertices != null && vertices.length >= 3);
            console.assert(vertices[0] != vertices[vertices.length - 1]);
            for (var i = 1; i < vertices.length; ++i) {
                var v1 = vertices[i - 1];
                var v2 = vertices[i];
                console.assert(es.Vector2.distanceSquared(v1, v2) > physics.Settings.linearSlop * physics.Settings.linearSlop);
            }
            this.vertices = vertices;
            if (createLoop) {
                this.vertices.push(vertices[0]);
                this.prevVertex = this.vertices[this.vertices.length - 2];
                this.nextVertex = this.vertices[1];
            }
        };
        ChainShape.prototype.testPoint = function (transform, point) {
            return false;
        };
        ChainShape.prototype.rayCast = function (output, input, transform, childIndex) {
            console.assert(childIndex < this.vertices.length);
            var i1 = childIndex;
            var i2 = childIndex + 1;
            if (i2 == this.vertices.length)
                i2 = 0;
            ChainShape._edgeShape.vertex1 = this.vertices[i1];
            ChainShape._edgeShape.vertex2 = this.vertices[i2];
            return ChainShape._edgeShape.rayCast(output, input, transform, 0);
        };
        ChainShape.prototype.computeAABB = function (aabb, transform, childIndex) {
            console.assert(childIndex < this.vertices.length);
            var i1 = childIndex;
            var i2 = childIndex + 1;
            if (i2 == this.vertices.length)
                i2 = 0;
            var v1 = physics.MathUtils.mul_tv(transform, this.vertices[i1]);
            var v2 = physics.MathUtils.mul_tv(transform, this.vertices[i2]);
            aabb.lowerBound = es.Vector2.min(v1, v2);
            aabb.upperBound = es.Vector2.max(v1, v2);
        };
        ChainShape.prototype.computeProperties = function () {
        };
        ChainShape.prototype.computeSubmergedArea = function (normal, offset, xf, sc) {
            sc.x = 0;
            sc.y = 0;
            return 0;
        };
        ChainShape.prototype.clone = function () {
            var clone = new ChainShape();
            clone.shapeType = this.shapeType;
            clone._density = this._density;
            clone._radius = this._radius;
            clone.prevVertex = this._prevVertex;
            clone.nextVertex = this._nextVertex;
            clone._hasNextVertex = this._hasNextVertex;
            clone._hasPrevVertex = this._hasPrevVertex;
            clone.vertices = new physics.Vertices(this.vertices);
            clone.massData = this.massData;
            return clone;
        };
        ChainShape._edgeShape = new physics.EdgeShape();
        return ChainShape;
    }(physics.Shape));
    physics.ChainShape = ChainShape;
})(physics || (physics = {}));
///<reference path="./Shape.ts" />
var physics;
///<reference path="./Shape.ts" />
(function (physics) {
    var CircleShape = /** @class */ (function (_super) {
        __extends(CircleShape, _super);
        function CircleShape(radius, density) {
            if (radius === void 0) { radius = 0; }
            if (density === void 0) { density = 0; }
            var _this = _super.call(this, density) || this;
            console.assert(radius >= 0);
            console.assert(density >= 0);
            _this.shapeType = physics.ShapeType.circle;
            _this._position = es.Vector2.zero;
            _this.radius = radius;
            return _this;
        }
        Object.defineProperty(CircleShape.prototype, "childCount", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CircleShape.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
                this.computeProperties();
            },
            enumerable: true,
            configurable: true
        });
        CircleShape.prototype.testPoint = function (transform, point) {
            var center = es.Vector2.add(transform.p, physics.MathUtils.mul_rv(transform.q, this.position));
            var d = es.Vector2.subtract(point, center);
            return es.Vector2.dot(d, d) <= this._2radius;
        };
        CircleShape.prototype.rayCast = function (output, input, transform, childIndex) {
            var pos = es.Vector2.add(transform.p, physics.MathUtils.mul_rv(transform.q, this.position));
            var s = es.Vector2.subtract(input.point1, pos);
            var b = es.Vector2.dot(s, s) - this._2radius;
            var r = es.Vector2.subtract(input.point2, input.point1);
            var c = es.Vector2.dot(s, r);
            var rr = es.Vector2.dot(r, r);
            var sigma = c * c - rr * b;
            if (sigma < 0 || rr < physics.Settings.epsilon)
                return false;
            var a = -(c + (Math.sqrt(sigma)));
            if (0 <= a && a <= input.maxFraction * rr) {
                a /= rr;
                output.fraction = a;
                output.normal = es.Vector2.add(s, es.Vector2.multiplyScaler(r, a));
                es.Vector2Ext.normalize(output.normal);
                return true;
            }
            return false;
        };
        CircleShape.prototype.computeAABB = function (aabb, transform, childIndex) {
            var p = es.Vector2.add(transform.p, physics.MathUtils.mul_rv(transform.q, this.position));
            aabb.lowerBound = new es.Vector2(p.x - this.radius, p.y - this.radius);
            aabb.upperBound = new es.Vector2(p.x + this.radius, p.y + this.radius);
        };
        CircleShape.prototype.computeProperties = function () {
            var area = physics.Settings.pi * this._2radius;
            this.massData.area = area;
            this.massData.mass = this.density * area;
            this.massData.centroid = this.position.clone();
            this.massData.inertia = this.massData.mass * (0.5 * this._2radius + es.Vector2.dot(this.position, this.position));
        };
        CircleShape.prototype.computeSubmergedArea = function (normal, offset, xf, sc) {
            sc.x = 0;
            sc.y = 0;
            var p = physics.MathUtils.mul_tv(xf, this.position);
            var l = -(es.Vector2.dot(normal, p) - offset);
            if (l < -this.radius + physics.Settings.epsilon) {
                return 0;
            }
            if (l > this.radius) {
                sc = p;
                return physics.Settings.pi * this._2radius;
            }
            var l2 = l * l;
            var area = this._2radius * (Math.asin(l / this.radius) + physics.Settings.pi / 2) + l * Math.sqrt(this._2radius - l2);
            var com = -2 / 3 * Math.pow(this._2radius - l2, 1.5) / area;
            sc.x = p.x + normal.x * com;
            sc.y = p.y + normal.y * com;
            return area;
        };
        CircleShape.prototype.compareTo = function (shape) {
            return (this.radius == shape.radius && this.position.equals(shape.position));
        };
        CircleShape.prototype.clone = function () {
            var clone = new CircleShape();
            clone.shapeType = this.shapeType;
            clone._radius = this.radius;
            clone._2radius = this._2radius;
            clone._density = this._density;
            clone._position = this._position;
            clone.massData = this.massData;
            return clone;
        };
        return CircleShape;
    }(physics.Shape));
    physics.CircleShape = CircleShape;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var PolygonShape = /** @class */ (function (_super) {
        __extends(PolygonShape, _super);
        function PolygonShape(vertices, density) {
            if (density === void 0) { density = 0; }
            var _this = _super.call(this, density) || this;
            _this.shapeType = physics.ShapeType.polygon;
            _this._radius = physics.Settings.polygonRadius;
            if (!vertices)
                _this._vertices = new physics.Vertices();
            else
                _this._vertices = vertices;
            _this._normals = new physics.Vertices();
            return _this;
        }
        Object.defineProperty(PolygonShape.prototype, "vertices", {
            get: function () {
                return this._vertices;
            },
            set: function (value) {
                this.setVerticesNoCopy(new physics.Vertices(value));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PolygonShape.prototype, "normals", {
            get: function () {
                return this._normals;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PolygonShape.prototype, "childCount", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置顶点，而无需将数据从顶点复制到本地List
         * @param verts
         */
        PolygonShape.prototype.setVerticesNoCopy = function (verts) {
            console.assert(verts.length >= 3 && verts.length <= physics.Settings.maxPolygonVertices);
            this._vertices = verts;
            if (physics.Settings.useConvexHullPolygons) {
                if (this._vertices.length <= 3)
                    this._vertices.forceCounterClockWise();
                else
                    this._vertices = physics.GiftWrap.getConvexHull(this._vertices);
            }
            if (this._normals == null)
                this._normals = new physics.Vertices();
            else
                this._normals.length = 0;
            for (var i = 0; i < this._vertices.length; ++i) {
                var next = i + 1 < this._vertices.length ? i + 1 : 0;
                var edge = es.Vector2.subtract(this._vertices[next], this._vertices[i]);
                console.assert(edge.lengthSquared() > physics.Settings.epsilon * physics.Settings.epsilon);
                var temp = new es.Vector2(edge.y, -edge.x);
                es.Vector2Ext.normalize(temp);
                this._normals.push(temp);
            }
            this.computeProperties();
        };
        PolygonShape.prototype.computeProperties = function () {
            console.assert(this.vertices.length >= 3);
            if (this._density <= 0)
                return;
            var center = es.Vector2.zero;
            var area = 0;
            var I = 0;
            var s = es.Vector2.zero;
            for (var i = 0; i < this.vertices.length; ++i)
                s.add(this.vertices[i]);
            s.multiplyScaler(1 / this.vertices.length);
            var k_inv3 = 1 / 3;
            for (var i = 0; i < this.vertices.length; ++i) {
                var e1 = es.Vector2.subtract(this.vertices[i], s);
                var e2 = i + 1 < this.vertices.length ? es.Vector2.subtract(this.vertices[i + 1], s) : es.Vector2.subtract(this.vertices[0], s);
                var d = physics.MathUtils.cross(e1, e2);
                var triangleArea = 0.5 * d;
                area += triangleArea;
                center.add(es.Vector2.add(e1, e2).multiplyScaler(triangleArea * k_inv3));
                var ex1 = e1.x, ey1 = e1.y;
                var ex2 = e2.x, ey2 = e2.y;
                var intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
                var inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;
                I += (0.25 * k_inv3 * d) * (intx2 + inty2);
            }
            console.assert(area > physics.Settings.epsilon);
            this.massData.area = area;
            this.massData.mass = this._density * area;
            center.multiplyScaler(1 / area);
            this.massData.centroid = es.Vector2.add(center, s);
            this.massData.inertia = this._density * I;
            this.massData.inertia += this.massData.mass * (es.Vector2.dot(this.massData.centroid, this.massData.centroid) - es.Vector2.dot(center, center));
        };
        PolygonShape.prototype.testPoint = function (transform, point) {
            var pLocal = physics.MathUtils.mul_rv(transform.q, es.Vector2.subtract(point, transform.p));
            for (var i = 0; i < this.vertices.length; ++i) {
                var dot = es.Vector2.dot(this.normals[i], es.Vector2.subtract(pLocal, this.vertices[i]));
                if (dot > 0) {
                    return false;
                }
            }
            return true;
        };
        PolygonShape.prototype.rayCast = function (output, input, transform, childIndex) {
            var p1 = physics.MathUtils.mul_rv(transform.q, es.Vector2.subtract(input.point1, transform.p));
            var p2 = physics.MathUtils.mul_rv(transform.q, es.Vector2.subtract(input.point2, transform.p));
            var d = es.Vector2.subtract(p2, p1);
            var lower = 0, upper = input.maxFraction;
            var index = -1;
            for (var i = 0; i < this.vertices.length; ++i) {
                var numerator = es.Vector2.dot(this.normals[i], es.Vector2.subtract(this.vertices[i], p1));
                var denominator = es.Vector2.dot(this.normals[i], d);
                if (denominator == 0) {
                    if (numerator < 0) {
                        return false;
                    }
                }
                else {
                    if (denominator < 0 && numerator < lower * denominator) {
                        lower = numerator / denominator;
                        index = i;
                    }
                    else if (denominator > 0 && numerator < upper * denominator) {
                        upper = numerator / denominator;
                    }
                }
                if (upper < lower) {
                    return false;
                }
            }
            console.assert(0 <= lower && lower <= input.maxFraction);
            if (index >= 0) {
                output.fraction = lower;
                output.normal = physics.MathUtils.mul_rv(transform.q, this.normals[index]);
                return true;
            }
            return false;
        };
        PolygonShape.prototype.computeAABB = function (aabb, transform, childIndex) {
            var lower = physics.MathUtils.mul_tv(transform, this.vertices[0]);
            var upper = lower.clone();
            for (var i = 1; i < this.vertices.length; ++i) {
                var v = physics.MathUtils.mul_tv(transform, this.vertices[i]);
                lower = es.Vector2.min(lower, v);
                upper = es.Vector2.max(upper, v);
            }
            var r = new es.Vector2(this.radius, this.radius);
            aabb.lowerBound = es.Vector2.subtract(lower, r);
            aabb.upperBound = es.Vector2.add(upper, r);
        };
        PolygonShape.prototype.computeSubmergedArea = function (normal, offset, xf, sc) {
            sc.x = 0;
            sc.y = 0;
            var normalL = physics.MathUtils.mul_rv(xf.q, normal);
            var offsetL = offset - es.Vector2.dot(normal, xf.p);
            var depths = [];
            var diveCount = 0;
            var intoIndex = -1;
            var outoIndex = -1;
            var lastSubmerged = false;
            var i;
            for (i = 0; i < this.vertices.length; i++) {
                depths[i] = es.Vector2.dot(normalL, this.vertices[i]) - offsetL;
                var isSubmerged = depths[i] < -physics.Settings.epsilon;
                if (i > 0) {
                    if (isSubmerged) {
                        if (!lastSubmerged) {
                            intoIndex = i - 1;
                            diveCount++;
                        }
                    }
                    else {
                        if (lastSubmerged) {
                            outoIndex = i - 1;
                            diveCount++;
                        }
                    }
                }
                lastSubmerged = isSubmerged;
            }
            switch (diveCount) {
                case 0:
                    if (lastSubmerged) {
                        sc = physics.MathUtils.mul_tv(xf, this.massData.centroid);
                        return this.massData.mass / this.density;
                    }
                    return 0;
                case 1:
                    if (intoIndex == -1) {
                        intoIndex = this.vertices.length - 1;
                    }
                    else {
                        outoIndex = this.vertices.length - 1;
                    }
                    break;
            }
            var intoIndex2 = (intoIndex + 1) % this.vertices.length;
            var outoIndex2 = (outoIndex + 1) % this.vertices.length;
            var intoLambda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
            var outoLambda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
            var intoVec = new es.Vector2(this.vertices[intoIndex].x * (1 - intoLambda) + this.vertices[intoIndex2].x * intoLambda, this.vertices[intoIndex].y * (1 - intoLambda) + this.vertices[intoIndex2].y * intoLambda);
            var outoVec = new es.Vector2(this.vertices[outoIndex].x * (1 - outoLambda) + this.vertices[outoIndex2].x * outoLambda, this.vertices[outoIndex].y * (1 - outoLambda) + this.vertices[outoIndex2].y * outoLambda);
            var area = 0;
            var center = new es.Vector2(0, 0);
            var p2 = this.vertices[intoIndex2];
            var k_inv3 = 1 / 3;
            i = intoIndex2;
            while (i != outoIndex2) {
                i = (i + 1) % this.vertices.length;
                var p3 = void 0;
                if (i == outoIndex2)
                    p3 = outoVec;
                else
                    p3 = this.vertices[i];
                {
                    var e1 = es.Vector2.subtract(p2, intoVec);
                    var e2 = es.Vector2.subtract(p3, intoVec);
                    var d = physics.MathUtils.cross(e1, e2);
                    var triangleArea = 0.5 * d;
                    area += triangleArea;
                    center.add(es.Vector2.add(intoVec, p2).add(p3).multiplyScaler(triangleArea * k_inv3));
                }
                p2 = p3.clone();
            }
            center.multiplyScaler(1 / area);
            sc = physics.MathUtils.mul_tv(xf, center);
            return area;
        };
        PolygonShape.prototype.clone = function () {
            var clone = new PolygonShape();
            clone.shapeType = this.shapeType;
            clone._radius = this._radius;
            clone._density = this._density;
            clone._vertices = new physics.Vertices(this._vertices);
            clone._normals = new physics.Vertices(this._normals);
            clone.massData = this.massData;
            return clone;
        };
        return PolygonShape;
    }(physics.Shape));
    physics.PolygonShape = PolygonShape;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 在显示和模拟单位之间转换单位
     */
    var FSConvert = /** @class */ (function () {
        function FSConvert() {
        }
        /**
         * 将模拟（米）转换为显示（像素）
         */
        FSConvert.simToDisplay = 100;
        /**
         * 将显示（像素）转换为模拟（米）
         */
        FSConvert.displayToSim = 1 / FSConvert.simToDisplay;
        return FSConvert;
    }());
    physics.FSConvert = FSConvert;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var FixedArray2 = /** @class */ (function () {
        function FixedArray2() {
        }
        FixedArray2.prototype.get = function (index) {
            switch (index) {
                case 0:
                    return this._value0;
                case 1:
                    return this._value1;
                default:
                    throw new Error('index out of range');
            }
        };
        FixedArray2.prototype.set = function (index, value) {
            switch (index) {
                case 0:
                    this._value0 = value;
                    break;
                case 1:
                    this._value1 = value;
                    break;
                default:
                    throw new Error('index out of range');
            }
        };
        return FixedArray2;
    }());
    physics.FixedArray2 = FixedArray2;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 这描述了用于TOI计算的身体/形状的运动。
     * 形状是相对于身体原点定义的，可以与质心不重合。
     * 但是，要支持动态我们必须对质心位置进行插值
     */
    var Sweep = /** @class */ (function () {
        function Sweep() {
        }
        /**
         * 在特定时间获取插值变换
         * @param xfb
         * @param beta
         */
        Sweep.prototype.getTransform = function (xfb, beta) {
            xfb.p.x = (1 - beta) * this.c0.x + beta * this.c.x;
            xfb.p.y = (1 - beta) * this.c0.y + beta * this.c.y;
            var angle = (1 - beta) * this.a0 + beta * this.a;
            xfb.q.set(angle);
            // 转向原点 
            xfb.p.subtract(MathUtils.mul(xfb.q, this.localCenter));
        };
        /**
         * 向前推进，产生一个新的初始状态。
         * @param alpha
         */
        Sweep.prototype.advance = function (alpha) {
            console.assert(this.alpha0 < 1);
            var beta = (alpha - this.alpha0) / (1 - this.alpha0);
            this.c0.add(es.Vector2.subtract(this.c, this.c0).multiplyScaler(beta));
            this.a0 += beta * (this.a - this.a0);
            this.alpha0 = alpha;
        };
        /**
         * 归一化角度
         */
        Sweep.prototype.normalize = function () {
            var d = 2 * Math.PI * Math.floor(this.a0 / (2 * Math.PI));
            this.a0 -= d;
            this.a -= d;
        };
        return Sweep;
    }());
    physics.Sweep = Sweep;
    /**
     * 转换包含平移和旋转。
     * 它用来代表刚性框架的位置和方向
     */
    var Transform = /** @class */ (function () {
        function Transform(position, rotation) {
            this.p = position;
            this.q = rotation;
        }
        /**
         * 将此设置为标识转换
         */
        Transform.prototype.setIdentity = function () {
            this.p = es.Vector2.zero;
            this.q.setIdentity();
        };
        /**
         * 根据位置和角度进行设置
         * @param position
         * @param angle
         */
        Transform.prototype.set = function (position, angle) {
            this.p = position;
            this.q.set(angle);
        };
        return Transform;
    }());
    physics.Transform = Transform;
    /**
     * Rotation
     */
    var Rot = /** @class */ (function () {
        /**
         * 从弧度的角度初始化
         * @param angle
         */
        function Rot(angle) {
            this.s = Math.sin(angle);
            this.c = Math.cos(angle);
        }
        /**
         * 使用以弧度为单位的角度进行设置
         * @param angle
         */
        Rot.prototype.set = function (angle) {
            if (angle == 0) {
                this.s = 0;
                this.c = 1;
            }
            else {
                this.s = Math.sin(angle);
                this.c = Math.cos(angle);
            }
        };
        /**
         * 设置为identity旋转
         */
        Rot.prototype.setIdentity = function () {
            this.s = 0;
            this.c = 1;
        };
        /**
         * 获取弧度角
         * @returns
         */
        Rot.prototype.getAngle = function () {
            return Math.atan2(this.s, this.c);
        };
        /**
         * 获取x轴
         * @returns
         */
        Rot.prototype.getXAxis = function () {
            return new es.Vector2(this.c, this.s);
        };
        /**
         * 获取y轴
         * @returns
         */
        Rot.prototype.getYAxis = function () {
            return new es.Vector2(-this.s, this.c);
        };
        return Rot;
    }());
    physics.Rot = Rot;
    var MathUtils = /** @class */ (function () {
        function MathUtils() {
        }
        MathUtils.mul = function (q, v) {
            return new es.Vector2(q.c * v.x - q.s * v.y, q.s * v.x + q.c * v.y);
        };
        MathUtils.mul_tv = function (t, v) {
            var x = (t.q.c * v.x - t.q.s * v.y) + t.p.x;
            var y = (t.q.s * v.x + t.q.c * v.y) + t.p.y;
            return new es.Vector2(x, y);
        };
        MathUtils.mul_mv = function (a, v) {
            return new es.Vector2(v.x * a.ex.x + v.y * a.ex.y, v.x * a.ey.x + v.y * a.ey.y);
        };
        MathUtils.mul_rr = function (q, r) {
            var qr = new Rot(0);
            qr.s = q.c * r.s - q.s * r.c;
            qr.c = q.c * r.c + q.s * r.s;
            return qr;
        };
        MathUtils.mul_rv = function (q, v) {
            return new es.Vector2(q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y);
        };
        MathUtils.cross = function (a, b) {
            return a.x * b.y - a.y * b.x;
        };
        return MathUtils;
    }());
    physics.MathUtils = MathUtils;
    /**
     * 2×2矩阵。 以列主要顺序存储
     */
    var Mat22 = /** @class */ (function () {
        function Mat22(c1, c2) {
            this.ex = c1;
            this.ey = c2;
        }
        return Mat22;
    }());
    physics.Mat22 = Mat22;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var PolygonError;
    (function (PolygonError) {
        /** 多边形中没有错误  */
        PolygonError[PolygonError["noError"] = 0] = "noError";
        /** 多边形必须在3和Settings.MaxPolygonVertices顶点之间 */
        PolygonError[PolygonError["invalidAmountOfVertices"] = 1] = "invalidAmountOfVertices";
        /** 多边形必须简单。 这意味着没有重叠的边缘 */
        PolygonError[PolygonError["notSimple"] = 2] = "notSimple";
        /** 多边形必须逆时针 */
        PolygonError[PolygonError["notCounterClockWise"] = 3] = "notCounterClockWise";
        /** 多边形是凹的，它需要是凸的 */
        PolygonError[PolygonError["notConvex"] = 4] = "notConvex";
        /** 多边形面积太小 */
        PolygonError[PolygonError["areaTooSmall"] = 5] = "areaTooSmall";
        /** 多边形的边太短 */
        PolygonError[PolygonError["sideTooSmall"] = 6] = "sideTooSmall";
    })(PolygonError = physics.PolygonError || (physics.PolygonError = {}));
    var Vertices = /** @class */ (function (_super) {
        __extends(Vertices, _super);
        function Vertices(vertices) {
            var e_1, _a;
            if (vertices === void 0) { vertices = null; }
            var _this = _super.call(this) || this;
            if (vertices)
                try {
                    for (var vertices_1 = __values(vertices), vertices_1_1 = vertices_1.next(); !vertices_1_1.done; vertices_1_1 = vertices_1.next()) {
                        var vertical = vertices_1_1.value;
                        _this.push(vertical);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (vertices_1_1 && !vertices_1_1.done && (_a = vertices_1.return)) _a.call(vertices_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            return _this;
        }
        /**
         * 获取下一个索引。 用于遍历所有边缘
         * @param index
         * @returns
         */
        Vertices.prototype.nextIndex = function (index) {
            return (index + 1 > this.length - 1) ? 0 : index + 1;
        };
        /**
         * 获取下一个顶点。 用于遍历所有边缘
         * @param index
         * @returns
         */
        Vertices.prototype.nextVertex = function (index) {
            return this[this.nextIndex(index)];
        };
        /**
         * 获取前一个索引。 用于遍历所有边缘
         * @param index
         * @returns
         */
        Vertices.prototype.previousIndex = function (index) {
            return index - 1 < 0 ? this.length - 1 : index - 1;
        };
        /**
         * 获取前一个顶点。 用于遍历所有边缘
         * @param index
         * @returns
         */
        Vertices.prototype.previousVertx = function (index) {
            return this[this.previousIndex(index)];
        };
        /**
         * 获取签名区域。 如果面积小于0，则表示多边形是顺时针缠绕的。
         * @returns
         */
        Vertices.prototype.getSignedArea = function () {
            // 可以在欧几里得平面中存在的最简单多边形具有3个边
            if (this.length < 3)
                return 0;
            var i;
            var area = 0;
            for (i = 0; i < this.length; i++) {
                var j = (i + 1) % this.length;
                var vi = this[i];
                var vj = this[j];
                area += vi.x * vj.y;
                area -= vi.y * vj.x;
            }
            area /= 2;
            return area;
        };
        /**
         * 获取区域
         * @returns
         */
        Vertices.prototype.getArea = function () {
            var area = this.getSignedArea();
            return (area < 0 ? -area : area);
        };
        /**
         * 获取质心
         * @returns
         */
        Vertices.prototype.getCentroid = function () {
            // 可以在欧几里得平面中存在的最简单多边形具有3个边
            if (this.length < 3)
                return new es.Vector2(Number.NaN, Number.NaN);
            // Box2D使用相同的算法
            var c = es.Vector2.zero;
            var area = 0;
            var inv3 = 1 / 3;
            for (var i = 0; i < this.length; ++i) {
                // 三角形顶点
                var current = this[i];
                var next = (i + 1 < this.length ? this[i + 1] : this[0]);
                var triangleArea = 0.5 * (current.x * next.y - current.y * next.x);
                area += triangleArea;
                // 面积加权质心 
                c.add(es.Vector2.multiplyScaler(es.Vector2.add(current, next), triangleArea * inv3));
            }
            c.multiplyScaler(1 / area);
            return c;
        };
        /**
         * 返回完全包含此多边形的AABB。
         * @returns
         */
        Vertices.prototype.getAABB = function () {
            var lowerBound = new es.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
            var upperBound = new es.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
            for (var i = 0; i < this.length; ++i) {
                if (this[i].x < lowerBound.x) {
                    lowerBound.x = this[i].x;
                }
                if (this[i].x > upperBound.x) {
                    upperBound.x = this[i].x;
                }
                if (this[i].y < lowerBound.y) {
                    lowerBound.y = this[i].y;
                }
                if (this[i].y > upperBound.y) {
                    upperBound.y = this[i].y;
                }
            }
            return new physics.AABB(lowerBound, upperBound);
        };
        /**
         * 用指定的向量平移顶点
         * @param value
         */
        Vertices.prototype.translate = function (value) {
            var e_2, _a;
            console.assert(!this.attackedToBody, "平移实体所使用的顶点可能会导致行为不稳定。 使用Body.Position代替 ");
            for (var i = 0; i < this.length; i++) {
                this[i] = es.Vector2.add(this[i], value);
            }
            if (this.holes != null && this.holes.length > 0) {
                try {
                    for (var _b = __values(this.holes), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var hole = _c.value;
                        hole.translate(value);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        /**
         * 使用指定的矢量缩放顶点
         * @param value
         */
        Vertices.prototype.scale = function (value) {
            var e_3, _a;
            console.assert(!this.attackedToBody, "Body使用的缩放顶点会导致行为不稳定 ");
            for (var i = 0; i < this.length; i++)
                this[i] = es.Vector2.multiply(this[i], value);
            if (this.holes != null && this.holes.length > 0) {
                try {
                    for (var _b = __values(this.holes), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var hole = _c.value;
                        hole.scale(value);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        };
        /**
         * 旋转具有定义值（以弧度为单位）的顶点。
         * 警告：在实体的一组活动顶点上使用此方法会导致碰撞问题。 改用Body.Rotation。
         * @param value
         */
        Vertices.prototype.rotate = function (value) {
            var e_4, _a;
            console.assert(!this.attackedToBody, "Body使用的旋转顶点可能会导致行为不稳定 ");
            var cos = Math.cos(value);
            var sin = Math.sin(value);
            for (var i = 0; i < this.length; i++) {
                var position = this[i];
                this[i] = new es.Vector2((position.x * cos + position.y * -sin), (position.x * sin + position.y * cos));
            }
            if (this.holes != null && this.holes.length > 0) {
                try {
                    for (var _b = __values(this.holes), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var hole = _c.value;
                        hole.rotate(value);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        };
        /**
         * 确定多边形是否为凸面。 O（n ^ 2）运行时间。
         * 假设：
         * -多边形按逆时针顺序排列
         * -多边形没有重叠的边缘
         */
        Vertices.prototype.isConvex = function () {
            //可以在欧几里得平面中存在的最简单多边形具有3个边
            if (this.length < 3)
                return false;
            if (this.length == 3)
                return true;
            for (var i = 0; i < this.length; ++i) {
                var next = i + 1 < this.length ? i + 1 : 0;
                var edge = es.Vector2.subtract(this[next], this[i]);
                for (var j = 0; j < this.length; ++j) {
                    if (j == i || j == next)
                        continue;
                    var r = es.Vector2.subtract(this[j], this[i]);
                    var s = edge.x * r.y - edge.y * r.x;
                    if (s <= 0)
                        return false;
                }
            }
            return true;
        };
        /**
         * 指示顶点是否为逆时针顺序。警告：如果多边形的面积为0，则无法确定绕线。
         * @returns
         */
        Vertices.prototype.isCounterClockWise = function () {
            if (this.length < 3)
                return false;
            return this.getSignedArea() > 0;
        };
        /**
         * 强制顶点按逆时针方向排列
         * @returns
         */
        Vertices.prototype.forceCounterClockWise = function () {
            if (this.length < 3)
                return;
            if (!this.isCounterClockWise())
                this.reverse();
        };
        return Vertices;
    }(Array));
    physics.Vertices = Vertices;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * Giftwrap凸包算法。 O（nh）时间复杂度，其中n是点数，h是凸包上的点数。
     * 从Box2D中摘取
     */
    var GiftWrap = /** @class */ (function () {
        function GiftWrap() {
        }
        /**
         * 从给定的顶点返回凸包
         * @param vertices
         */
        GiftWrap.getConvexHull = function (vertices) {
            if (vertices.length <= 3)
                return vertices;
            var i0 = 0;
            var x0 = vertices[0].x;
            for (var i = 1; i < vertices.length; ++i) {
                var x = vertices[i].x;
                if (x > x0 || (x == x0 && vertices[i].y < vertices[i0].y)) {
                    i0 = i;
                    x0 = x;
                }
            }
            var hull = [];
            var m = 0;
            var ih = i0;
            for (;;) {
                hull[m] = ih;
                var ie = 0;
                for (var j = 1; j < vertices.length; ++j) {
                    if (ie == ih) {
                        ie = j;
                        continue;
                    }
                    var r = es.Vector2.subtract(vertices[ie], vertices[hull[m]]);
                    var v = es.Vector2.subtract(vertices[j], vertices[hull[m]]);
                    var c = physics.MathUtils.cross(r, v);
                    if (c < 0) {
                        ie = j;
                    }
                    if (c == 0 && v.lengthSquared() > r.lengthSquared()) {
                        ie = j;
                    }
                }
                ++m;
                ih = ie;
                if (ie == i0) {
                    break;
                }
            }
            var result = new physics.Vertices();
            for (var i = 0; i < m; ++i) {
                result.push(vertices[hull[i]]);
            }
            return result;
        };
        return GiftWrap;
    }());
    physics.GiftWrap = GiftWrap;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 包含可以确定是否应处理对象的筛选器数据
     */
    var FilterData = /** @class */ (function () {
        function FilterData() {
            /**
             * 禁用特定类别的逻辑。类别。默认为无。
             */
            this.disabledOnCategories = physics.Category.none;
            /**
             * 默认情况下，对特定类别Category.All启用逻辑
             */
            this.enabledOnCategories = physics.Category.all;
        }
        FilterData.prototype.isActiveOn = function (body) {
            var e_5, _a;
            if (body == null || !body.enabled || body.isStatic)
                return false;
            if (body.fixtureList == null)
                return false;
            try {
                for (var _b = __values(body.fixtureList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fixture = _c.value;
                    if ((fixture.collisionGroup == this.disabledOnGroup) && fixture.collisionGroup != 0 && this.disabledOnGroup != 0)
                        return false;
                    if ((fixture.collisionCategories & this.disabledOnCategories) != physics.Category.none)
                        return false;
                    if (this.enabledOnGroup != 0 || this.enabledOnCategories != physics.Category.all) {
                        if ((fixture.collisionGroup == this.enabledOnGroup) && fixture.collisionGroup != 0 &&
                            this.enabledOnGroup != 0)
                            return true;
                        if ((fixture.collisionCategories & this.enabledOnGroup) != physics.Category.none &&
                            this.enabledOnCategories != physics.Category.all)
                            return true;
                    }
                    else {
                        return true;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return false;
        };
        return FilterData;
    }());
    physics.FilterData = FilterData;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var PhysicsLogicType;
    (function (PhysicsLogicType) {
        PhysicsLogicType[PhysicsLogicType["Explosion"] = 1] = "Explosion";
    })(PhysicsLogicType = physics.PhysicsLogicType || (physics.PhysicsLogicType = {}));
    var PhysicsLogicFilter = /** @class */ (function () {
        function PhysicsLogicFilter() {
        }
        /**
         * 忽略控制器。 控制器对此主体无效
         * @param type
         */
        PhysicsLogicFilter.prototype.ignorePhysicsLogic = function (type) {
            this.controllerIgnores |= type;
        };
        return PhysicsLogicFilter;
    }());
    physics.PhysicsLogicFilter = PhysicsLogicFilter;
})(physics || (physics = {}));
///<reference path="../Common/PhysicsLogic/FilterData.ts" />
var physics;
///<reference path="../Common/PhysicsLogic/FilterData.ts" />
(function (physics) {
    var ControllerType;
    (function (ControllerType) {
        ControllerType[ControllerType["gravityController"] = 1] = "gravityController";
        ControllerType[ControllerType["velocityLimitController"] = 2] = "velocityLimitController";
        ControllerType[ControllerType["abstractForceController"] = 4] = "abstractForceController";
        ControllerType[ControllerType["buoyancyController"] = 8] = "buoyancyController";
    })(ControllerType = physics.ControllerType || (physics.ControllerType = {}));
    var ControllerFilter = /** @class */ (function () {
        function ControllerFilter() {
        }
        /**
         * 忽略控制器。 控制器对此主体无效
         * @param controller
         */
        ControllerFilter.prototype.ignoreController = function (controller) {
            this.controllerFlags |= controller;
        };
        /**
         * 恢复控制器。 控制器会影响此主体
         * @param controller
         */
        ControllerFilter.prototype.restoreController = function (controller) {
            this.controllerFlags &= ~controller;
        };
        /**
         * 确定此主体是否忽略指定的控制器
         * @param controller
         * @returns
         */
        ControllerFilter.prototype.isControllerIgnored = function (controller) {
            return (this.controllerFlags & controller) == controller;
        };
        return ControllerFilter;
    }());
    physics.ControllerFilter = ControllerFilter;
    var Controller = /** @class */ (function (_super) {
        __extends(Controller, _super);
        function Controller(controllerType) {
            var _this = _super.call(this) || this;
            _this._type = controllerType;
            return _this;
        }
        Controller.prototype.isActiveOn = function (body) {
            if (body.controllerFilter.isControllerIgnored(this._type))
                return false;
            return _super.prototype.isActiveOn.call(this, body);
        };
        return Controller;
    }(physics.FilterData));
    physics.Controller = Controller;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * Body类型
     */
    var BodyType;
    (function (BodyType) {
        /**
         * 零速度，可以手动移动。 注意：即使是静态物体也有质量
         */
        BodyType[BodyType["static"] = 0] = "static";
        /**
         * 零质量，用户设定的非零速度，由求解器移动
         */
        BodyType[BodyType["kinematic"] = 1] = "kinematic";
        /**
         * 正质量，由力确定的非零速度，由求解器移动
         */
        BodyType[BodyType["dynamic"] = 2] = "dynamic";
    })(BodyType = physics.BodyType || (physics.BodyType = {}));
    var Body = /** @class */ (function () {
        function Body(world, position, rotation, bodyType, userdata) {
            if (position === void 0) { position = new es.Vector2(); }
            if (rotation === void 0) { rotation = 0; }
            if (bodyType === void 0) { bodyType = BodyType.static; }
            if (userdata === void 0) { userdata = null; }
            this.fixtureList = [];
            this.bodyId = Body._bodyIdCounter++;
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
        Object.defineProperty(Body.prototype, "world", {
            get: function () {
                return this._world;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "revolutions", {
            /**
             * 获取身体旋转的总数
             */
            get: function () {
                return this.rotation / Math.PI;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "bodyType", {
            /**
             * 获取或设置主体类型。
             * 警告：调用此中间更新可能会导致崩溃。
             */
            get: function () {
                return this._bodyType;
            },
            set: function (value) {
                if (this._bodyType == value)
                    return;
                this._bodyType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "linearVelocity", {
            /**
             * 获取或设置质心的线速度
             */
            get: function () {
                return this._linearVelocity;
            },
            /**
             * 获取或设置质心的线速度
             */
            set: function (value) {
                console.assert(!Number.isNaN(value.x) && !Number.isNaN(value.y));
                if (this._bodyType == BodyType.static)
                    return;
                if (es.Vector2.dot(value, value) > 0)
                    this.isAwake = true;
                this._linearVelocity = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "angularVelocity", {
            /**
             * 获取或设置角速度。 弧度/秒
             */
            get: function () {
                return this._angularVelocity;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                if (this._bodyType == BodyType.static)
                    return;
                if (value * value > 0)
                    this.isAwake = true;
                this._angularVelocity = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "linearDamping", {
            /**
             * 获取或设置线性阻尼
             */
            get: function () {
                return this._linearDamping;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                this._linearDamping = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "angularDamping", {
            /**
             * 获取或设置角度阻尼
             */
            get: function () {
                return this._angularDamping;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                this._angularDamping = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "isSleepingAllowed", {
            /**
             * 您可以禁用此身体上的睡眠。 如果禁用睡眠，身体将被唤醒
             */
            get: function () {
                return this._sleepingAllowed;
            },
            set: function (value) {
                if (!value)
                    this.isAwake = true;
                this._sleepingAllowed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "isAwake", {
            get: function () {
                return this._awake;
            },
            /**
             * 设置身体的睡眠状态。 睡觉的身体具有非常低的CPU成本
             */
            set: function (value) {
                if (value) {
                    if (!this._awake) {
                        this._sleepTime = 0;
                        // this._world.contactManager.u
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "enabled", {
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
            set: function (value) {
                if (value == this._enabled)
                    return;
                if (value) {
                    var broadPhase = this._world.contactManager.broadPhase;
                    // for (let i = 0; i < this.fixtureList.length; i ++)
                    //     this.fixtureList[i].create
                    // TODO: createProxies
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "fixedRotation", {
            get: function () {
                return this._fixedRotation;
            },
            /**
             * 将此主体设置为固定旋转。 这导致质量被重置
             */
            set: function (value) {
                if (this._fixedRotation == value)
                    return;
                this._fixedRotation = value;
                this._angularVelocity = 0;
                // this.res
                // TODO: resetMassData
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "position", {
            /**
             * 获取世界原点位置
             */
            get: function () {
                return this._xf.p;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value.x) && !Number.isNaN(value.y));
                // this.setTra
                // TODO: setTransform
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "displayPosition", {
            /**
             * 以显示单位获取/设置世界原点位置
             */
            get: function () {
                return es.Vector2.multiplyScaler(this._xf.p, physics.FSConvert.simToDisplay);
            },
            set: function (value) {
                this.position = es.Vector2.multiplyScaler(value, physics.FSConvert.displayToSim);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "rotation", {
            get: function () {
                return this._sweep.a;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                // this.set
                // TODO: setTransform
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "isStatic", {
            /**
             * 获取或设置一个值，该值指示此主体是否为静态
             */
            get: function () {
                return this._bodyType == BodyType.static;
            },
            set: function (value) {
                this.bodyType = value ? BodyType.static : BodyType.dynamic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "isKinematic", {
            /**
             * 获取或设置一个值，该值指示此物体是否运动
             */
            get: function () {
                return this._bodyType == BodyType.kinematic;
            },
            set: function (value) {
                this.bodyType = value ? BodyType.kinematic : BodyType.dynamic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "isDynamic", {
            /**
             * 获取或设置一个值，该值指示此主体是否为动态的
             */
            get: function () {
                return this._bodyType == BodyType.dynamic;
            },
            set: function (value) {
                this.bodyType = value ? BodyType.dynamic : BodyType.kinematic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "worldCenter", {
            /** 获取质心的世界位置 */
            get: function () {
                return this._sweep.c;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "localCenter", {
            /**
             * 获取质心的本地位置
             */
            get: function () {
                return this._sweep.localCenter;
            },
            set: function (value) {
                if (this._bodyType != BodyType.dynamic)
                    return;
                var oldCenter = this._sweep.c.clone();
                this._sweep.localCenter = value;
                this._sweep.c0 = this._sweep.c = physics.MathUtils.mul_tv(this._xf, this._sweep.localCenter);
                var a = es.Vector2.subtract(this._sweep.c, oldCenter);
                this._linearVelocity.add(new es.Vector2(-this._angularVelocity * a.y, this._angularVelocity * a.x));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "mass", {
            /**
             * 获取或设置质量。 通常以千克（kg）为单位
             */
            get: function () {
                return this._mass;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                if (this._bodyType != BodyType.dynamic)
                    return;
                this._mass = value;
                if (this._mass <= 0)
                    this._mass = 1;
                this._invMass = 1 / this._mass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "inertia", {
            /**
             * 获取或设置物体绕局部原点的旋转惯量。 通常以kg-m ^ 2为单位
             */
            get: function () {
                return this._inertia + this.mass * es.Vector2.dot(this._sweep.localCenter, this._sweep.localCenter);
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                if (this._bodyType != BodyType.dynamic)
                    return;
                if (value > 0 && !this._fixedRotation) {
                    this._inertia = value - this.mass * es.Vector2.dot(this.localCenter, this.localCenter);
                    console.assert(this._inertia > 0);
                    this._invI = 1 / this._inertia;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "restitution", {
            get: function () {
                var res = 0;
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    res += f.restitution;
                }
                return this.fixtureList.length > 0 ? res / this.fixtureList.length : 0;
            },
            set: function (value) {
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    f.restitution = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "friction", {
            get: function () {
                var res = 0;
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    res += f.friction;
                }
                return this.fixtureList.length > 0 ? res / this.fixtureList.length : 0;
            },
            set: function (value) {
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    f.friction = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "collisionCategories", {
            set: function (value) {
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    f.collisionCategories = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "collidesWith", {
            set: function (value) {
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    f.collidesWith = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "ignoreCCDWith", {
            /**
             * 2×2矩阵。
             * 以主要列的顺序存储。
             * 身体对象可以定义希望忽略CCD的身体的类别。
             * 这使得某些物体可以配置为忽略CCD，而由于内容的制备方式，这些物体不是渗透问题。
             * 将此与World.SolveTOI中另一个Body的灯具CollisionCategories进行比较。
             */
            set: function (value) {
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    f.ignoreCCDWith = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "collisionGroup", {
            set: function (value) {
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    f.collisionGroup = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "isSensor", {
            set: function (value) {
                for (var i = 0; i < this.fixtureList.length; i++) {
                    var f = this.fixtureList[i];
                    f.isSensor = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 为身体上的每个fixture连接onCollision事件
         */
        Body.prototype.addOnCollision = function (value) {
            for (var i = 0; i < this.fixtureList.length; i++) {
                this.fixtureList[i].onCollision.push(value);
            }
        };
        Body.prototype.removeOnCollision = function (value) {
            for (var i = 0; i < this.fixtureList.length; i++)
                new es.List(this.fixtureList[i].onCollision).remove(value);
        };
        /**
         * 为身体上的每个fixture连接onSeparation事件
         * @param value
         */
        Body.prototype.addOnSeparation = function (value) {
            for (var i = 0; i < this.fixtureList.length; i++)
                this.fixtureList[i].onSeperation.push(value);
        };
        Body.prototype.removeOnSeparation = function (value) {
            for (var i = 0; i < this.fixtureList.length; i++)
                new es.List(this.fixtureList[i].onSeperation).remove(value);
        };
        return Body;
    }());
    physics.Body = Body;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 一种支撑多个可分开的Fixture的主体
     */
    var BreakableBody = /** @class */ (function () {
        function BreakableBody(world, vertices, density, position, rotation) {
            if (position === void 0) { position = new es.Vector2(); }
            if (rotation === void 0) { rotation = 0; }
            this.parts = [];
            /**
             * 分解身体所需的力。默认值：500
             */
            this.strength = 500;
            this._angularVelocitiesCache = [];
            this._velocitiesCache = [];
            this._world = world;
            this._world.contactManager.onPostSolve.push(this.onPostSolve);
        }
        BreakableBody.prototype.onPostSolve = function (contact, impulse) {
            if (!this.isBroken) {
                var partsList = new es.List(this.parts);
                if (partsList.contains(contact.fixtureA) || partsList.contains(contact.fixtureB)) {
                    var maxImpulse = 0;
                    var count = contact.manifold.pointCount;
                    for (var i = 0; i < count; ++i) {
                        // maxImpulse = Math.max(maxImpulse, impulse.)
                        // TODO: impulse.points
                    }
                    if (maxImpulse > this.strength) {
                        this._break = true;
                    }
                }
            }
        };
        return BreakableBody;
    }());
    physics.BreakableBody = BreakableBody;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var ContactManager = /** @class */ (function () {
        function ContactManager(broadPhase) {
            this.contactList = [];
            this.activeContacts = new Set();
            /**
             * 更新期间使用的活动联系人的临时副本，因此哈希集可以在更新期间添加/删除成员。
             * 每次更新后都会清除此列表。
             */
            this.activeList = [];
            this.broadPhase = broadPhase;
            this.onBroadphaseCollision.push(this.addPair);
        }
        ContactManager.prototype.addPair = function (proxyA, proxyB) {
            var fixtureA = proxyA.fixture;
            var fixtureB = proxyB.fixture;
            var indexA = proxyA.childIndex;
            var indexB = proxyB.childIndex;
            var bodyA = fixtureA.body;
            var bodyB = fixtureB.body;
            if (bodyA == bodyB)
                return;
            var edge = bodyB.contactList;
            while (edge != null) {
                if (edge.other == bodyA) {
                    var fA = edge.contact.fixtureA;
                    var fB = edge.contact.fixtureB;
                    var iA = edge.contact.childIndexA;
                    var iB = edge.contact.childIndexB;
                    if (fA == fixtureA && fB == fixtureB && iA == indexA && iB == indexB) {
                        return;
                    }
                    if (fA == fixtureB && fB == fixtureA && iA == indexB && iB == indexA) {
                        return;
                    }
                }
                edge = edge.next;
            }
            // TODO: shouldCollide
            // if (bodyB.sh)
        };
        return ContactManager;
    }());
    physics.ContactManager = ContactManager;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 这是一个内部类
     */
    var Island = /** @class */ (function () {
        function Island() {
        }
        return Island;
    }());
    physics.Island = Island;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * 管理着所有物理实体，动态仿真和异步查询
     */
    var World = /** @class */ (function () {
        function World(gravity) {
            this._tempOverlapCircle = new physics.CircleShape();
            this._stack = [];
            this._bodyAddList = new Set();
            this._bodyRemoveList = new Set();
            this._jointAddList = new Set();
            this._jointRemoveList = new Set();
            this._input = new physics.TOIInput();
            this._watch = new es.Stopwatch();
            this._contactPool = [];
            this.island = new physics.Island();
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
        Object.defineProperty(World.prototype, "contactList", {
            /**
             * 获取世界contact列表。
             * 对于返回的contact，请使用Contact.GetNext获取世界列表中的下一个contact。
             * 空contact表示列表的末尾。
             */
            get: function () {
                return this.contactManager.contactList;
            },
            enumerable: true,
            configurable: true
        });
        World.prototype.queryAABBCallbackWrapper = function (proxyId) {
            // let proxy = this.contactManager.broadPhase.
            // TODO getProxy\
        };
        return World;
    }());
    physics.World = World;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var ContactType;
    (function (ContactType) {
        ContactType[ContactType["notSupported"] = 0] = "notSupported";
        ContactType[ContactType["polygon"] = 1] = "polygon";
        ContactType[ContactType["polygonAndCircle"] = 2] = "polygonAndCircle";
        ContactType[ContactType["circle"] = 3] = "circle";
        ContactType[ContactType["edgeAndPolygon"] = 4] = "edgeAndPolygon";
        ContactType[ContactType["edgeAndCircle"] = 5] = "edgeAndCircle";
        ContactType[ContactType["chainAndPolygon"] = 6] = "chainAndPolygon";
        ContactType[ContactType["chainAndCircle"] = 7] = "chainAndCircle";
    })(ContactType = physics.ContactType || (physics.ContactType = {}));
    /**
     * 该类管理两个形状之间的接触。
     * 广相中每个重叠的AABB都有一个接触（除非经过过滤）。
     * 因此，可能存在没有接触点的接触对象
     */
    var Contact = /** @class */ (function () {
        function Contact(fA, indexA, fB, indexB) {
            this._nodeA = new ContactEdge();
            this._nodeB = new ContactEdge();
            // reset
        }
        Contact._edge = new physics.EdgeShape();
        Contact._contactRegisters = [
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
        return Contact;
    }());
    physics.Contact = Contact;
    /**
     * 接触边缘用于在接触图中将实体和接触连接在一起，其中每个实体是一个节点，每个接触是一个边缘。
     * 接触边属于每个附加主体中维护的双向链表。
     * 每个接触点都有两个接触点，每个附着体一个。
     */
    var ContactEdge = /** @class */ (function () {
        function ContactEdge() {
        }
        return ContactEdge;
    }());
    physics.ContactEdge = ContactEdge;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var VelocityConstraintPoint = /** @class */ (function () {
        function VelocityConstraintPoint() {
        }
        return VelocityConstraintPoint;
    }());
    physics.VelocityConstraintPoint = VelocityConstraintPoint;
    var ContactVelocityConstraint = /** @class */ (function () {
        function ContactVelocityConstraint() {
            this.points = [];
        }
        return ContactVelocityConstraint;
    }());
    physics.ContactVelocityConstraint = ContactVelocityConstraint;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var JointType;
    (function (JointType) {
        JointType[JointType["unknown"] = 0] = "unknown";
        JointType[JointType["revolute"] = 1] = "revolute";
        JointType[JointType["prismatic"] = 2] = "prismatic";
        JointType[JointType["distance"] = 3] = "distance";
        JointType[JointType["pulley"] = 4] = "pulley";
        JointType[JointType["gear"] = 5] = "gear";
        JointType[JointType["wheel"] = 6] = "wheel";
        JointType[JointType["weld"] = 7] = "weld";
        JointType[JointType["friction"] = 8] = "friction";
        JointType[JointType["rope"] = 9] = "rope";
        JointType[JointType["motor"] = 10] = "motor";
        JointType[JointType["angle"] = 11] = "angle";
        JointType[JointType["fixedMouse"] = 12] = "fixedMouse";
    })(JointType = physics.JointType || (physics.JointType = {}));
    var LimitState;
    (function (LimitState) {
        LimitState[LimitState["inactive"] = 0] = "inactive";
        LimitState[LimitState["atLower"] = 1] = "atLower";
        LimitState[LimitState["atUpper"] = 2] = "atUpper";
        LimitState[LimitState["equal"] = 3] = "equal";
    })(LimitState = physics.LimitState || (physics.LimitState = {}));
    /**
     * 关节边用于在一个关节图中将实体和关节连接在一起，其中每个实体是一个节点，每个关节是一个边。
     * 关节边属于每个附加主体中维护的双向链表。
     * 每个关节都有两个关节节点，每个连接的节点一个
     */
    var JointEdge = /** @class */ (function () {
        function JointEdge() {
        }
        return JointEdge;
    }());
    physics.JointEdge = JointEdge;
    var Joint = /** @class */ (function () {
        function Joint(bodyA, bodyB) {
            /**
             * 指示是否启用了此联接。 禁用关节意味着该关节仍在仿真中，但是不活动
             */
            this.enabled = true;
            this.edgeA = new JointEdge();
            this.edgeB = new JointEdge();
            if (bodyA && bodyB) {
                // 无法将关节两次连接到同一实体
                console.assert(bodyA != bodyB);
                this.bodyA = bodyA;
                this.bodyB = bodyB;
            }
            else if (bodyA) {
                this.bodyA = bodyA;
            }
            this.breakpoint = Number.MAX_VALUE;
            // 默认情况下，连接的物体不应碰撞 
            this.collideConnected = false;
        }
        Object.defineProperty(Joint.prototype, "breakpoint", {
            /**
             * 断点只是表示JointError在中断之前可以达到的最大值。
             * 默认值为Number.MaxValue，这表示它永不中断。
             */
            get: function () {
                return this._breakpoint;
            },
            set: function (value) {
                this._breakpoint = value;
                this._breakpointSquared = this._breakpoint * this._breakpoint;
            },
            enumerable: true,
            configurable: true
        });
        Joint.prototype.wakeBodies = function () {
            if (this.bodyA != null)
                this.bodyA.isAwake = true;
            if (this.bodyB != null)
                this.bodyB.isAwake = true;
        };
        Joint.prototype.isFixedType = function () {
            return this.jointType == JointType.fixedMouse || this.bodyA.isStatic || this.bodyB.isStatic;
        };
        return Joint;
    }());
    physics.Joint = Joint;
})(physics || (physics = {}));
