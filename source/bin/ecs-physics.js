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
    var Defined = /** @class */ (function () {
        function Defined() {
        }
        Defined.USE_ACTIVE_CONTACT_SET = false;
        return Defined;
    }());
    physics.Defined = Defined;
})(physics || (physics = {}));
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
     * ???????????????????????????Fixture???????????????
     */
    var FixtureProxy = /** @class */ (function () {
        function FixtureProxy() {
        }
        return FixtureProxy;
    }());
    physics.FixtureProxy = FixtureProxy;
    /**
     * Fixture?????????Shape???????????????????????????????????????
     * Fixture?????????????????????????????? Fixture??????????????????????????????????????????????????????????????????
     * Fixture?????????Body.CreateFixture????????????
     *  ??????????????????????????????Fixture???
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
             * ?????????0
             * ??????Settings.useFPECollisionCategories?????????false???
             * ????????????????????????????????????????????????????????????????????????????????????
             * ??????????????????????????? ??????????????????????????????????????????
             * ??????Settings.useFPECollisionCategories?????????true???
             * ??????2???fixture?????????????????????????????????????????????????????????
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
             * ?????????Category.All
             *
             * ??????????????????
             * ????????????????????????????????????????????????
             * ??????Settings.UseFPECollisionCategories???????????????
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
             * ??????????????????????????????
             * ??????Settings.UseFPECollisionCategories?????????false???
             * ???????????????Category.Cat1
             *
             * ??????Settings.UseFPECollisionCategories?????????true???
             * ???????????????Category.All
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
             * ??????????????????????????????????????????????????????????????????
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
             * ????????????????????? ???????????????????????????????????????
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
             * ??????????????????
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
         * ?????????fixture????????????fixture???????????????
         * @param fixture
         */
        Fixture.prototype.restoreCollisionWith = function (fixture) {
            if (this._colisionIgnores.has(fixture.fixtureId)) {
                this._colisionIgnores.delete(fixture.fixtureId);
                this.refilter();
            }
        };
        /**
         * ?????????fixture????????????fixture???????????????
         * @param fixture
         */
        Fixture.prototype.ignoreCollisionWith = function (fixture) {
            if (!this._colisionIgnores.has(fixture.fixtureId)) {
                this._colisionIgnores.add(fixture.fixtureId);
                this.refilter();
            }
        };
        /**
         * ?????????????????????Fixture????????????Fixture???????????????
         * @param fixture
         * @returns
         */
        Fixture.prototype.isFixtureIgnored = function (fixture) {
            return this._colisionIgnores.has(fixture.fixtureId);
        };
        /**
         * contact?????????????????????????????????????????????????????????????????????????????????
         * ???????????????????????????????????????contact???????????????
         */
        Fixture.prototype.refilter = function () {
            // ???????????????contact???????????????
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
            for (var i = 0; i < this.proxyCount; ++i)
                broadPhase.touchProxy(this.proxies[i].proxyId);
        };
        Fixture.prototype.registerFixture = function () {
            var _this = this;
            this.proxies = [];
            this.proxyCount = 0;
            if (this.body.enabled) {
                var broadPhase = this.body._world.contactManager.broadPhase;
                this.createProxies(broadPhase, this.body._xf);
            }
            this.body.fixtureList.push(this);
            if (this.shape._density > 0)
                this.body.resetMassData();
            this.body._world._worldHasNewFixture = true;
            if (this.body._world.onFixtureAdded != null)
                this.body._world.onFixtureAdded.forEach(function (fn) { return fn(_this); });
        };
        Fixture.prototype.rayCast = function (output, input, childIndex) {
            return this.shape.rayCast(output, input, this.body._xf, childIndex);
        };
        Fixture.prototype.destroy = function () {
            var _this = this;
            if (this.shape.shapeType == physics.ShapeType.polygon)
                this.shape.vertices.attackedToBody = false;
            console.assert(this.proxyCount == 0);
            this.proxies = null;
            this.shape = null;
            this.userData = null;
            this.beforeCollision = null;
            this.onCollision = null;
            this.onSeperation = null;
            this.afterCollision = null;
            if (this.body._world.onFixtureRemoved != null) {
                this.body._world.onFixtureRemoved.forEach(function (fn) { return fn(_this); });
            }
            this.body._world.onFixtureAdded = null;
            this.body._world.onFixtureRemoved = null;
            this.onSeperation = null;
            this.onCollision = null;
        };
        Fixture.prototype.createProxies = function (broadPhase, xf) {
            console.assert(this.proxyCount == 0);
            this.proxyCount = this.shape.childCount;
            for (var i = 0; i < this.proxyCount; ++i) {
                var proxy = new FixtureProxy();
                this.shape.computeAABB(proxy.aabb, xf, i);
                proxy.fixture = this;
                proxy.childIndex = i;
                proxy.proxyId = broadPhase.addProxy(proxy);
                this.proxies[i] = proxy;
            }
        };
        Fixture.prototype.destroyProxies = function (broadPhase) {
            for (var i = 0; i < this.proxyCount; ++i) {
                broadPhase.removeProxy(this.proxies[i].proxyId);
                this.proxies[i].proxyId = -1;
            }
            this.proxyCount = 0;
        };
        Fixture.prototype.synchronize = function (broadPhase, transform1, transform2) {
            if (this.proxyCount == 0)
                return;
            for (var i = 0; i < this.proxyCount; ++i) {
                var proxy = this.proxies[i];
                var aabb1 = new physics.AABB();
                var aabb2 = new physics.AABB();
                this.shape.computeAABB(aabb1, transform1, proxy.childIndex);
                this.shape.computeAABB(aabb2, transform2, proxy.childIndex);
                proxy.aabb.combineT(aabb1, aabb2);
                var dispacement = transform2.p.sub(transform1.p);
                broadPhase.moveProxy(proxy.proxyId, proxy.aabb, dispacement);
            }
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
        Settings.mixFriction = function (friction1, friction2) {
            return Math.sqrt(friction1 * friction2);
        };
        Settings.mixRestitution = function (restitution1, restitution2) {
            return restitution1 > restitution2 ? restitution1 : restitution2;
        };
        Settings.maxFloat = 3.402823466e+38;
        Settings.epsilon = 1.192092896e-07;
        Settings.pi = 3.14159265359;
        /**
         * ??????Diagnostics????????????????????????????????????
         * ?????????????????????contact?????????CCD????????????????????????????????????
         * ??????????????????????????????????????????????????????????????????????????????????????????????????????
         */
        Settings.enableDiagnostics = true;
        /**
         * Fixture????????????????????????Fixture.collisionCategories?????????????????????
         * ??????????????????????????????????????????UseFPECollisionCategories??????????????????
         */
        Settings.defaultFixtureCollisionCategories = physics.Category.cat1;
        /**
         * Fixture????????????????????????Fixture.collidesWith??????????????????
         */
        Settings.defaultFixtureCollidesWith = physics.Category.all;
        /**
         * Fixture????????????????????????Fixture.ignoreCCDWith??????????????????
         */
        Settings.defaultFixtureIgnoreCCDWith = physics.Category.none;
        /**
         * ??????????????????????????????AABBs?????????????????????????????????????????????????????????????????????????????????????????????
         */
        Settings.aabbExtension = 0.1;
        /**
         * ??????????????????????????????????????????
         * ??????????????????????????????????????????????????????????????????????????????
         */
        Settings.linearSlop = 0.005;
        /**
         * ?????????/?????????????????????????????? ????????????????????????
         * ?????????????????????????????????????????????????????????????????????????????????
         * ???????????????????????????????????????????????????
         */
        Settings.polygonRadius = (2 * Settings.linearSlop);
        /**
         * ?????????????????????????????????
         */
        Settings.maxPolygonVertices = 8;
        /**
         * ?????????true??????????????????????????????????????????GiftWrap?????????
         * ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????false???
         */
        Settings.useConvexHullPolygons = true;
        /**
         * ??????GJK???????????????????????????
         */
        Settings.maxGJKIterations = 20;
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
     * ????????????????????????
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
     * ????????????????????????????????????Box2D?????????????????????????????????
     * - ?????????????????????????????????
     * -???????????????????????????
     * ??????????????????????????????????????????
     * -ShapeType.Circles???circleA???????????????
     * -SeparationFunction.FaceA???faceA?????????
     * -SeparationFunction.FaceB???faceB???????????????????????????????????????
     * -ShapeType.Circles????????????
     * -SeparationFunction.FaceA????????????A????????????
     * -SeparationFunction.FaceB????????????B?????????
     * ????????????????????????????????????????????????????????????????????????????????????????????????????????????
     * ?????????????????????????????????????????????????????????
     * ????????????????????????????????????????????????????????????
     */
    var Manifold = /** @class */ (function () {
        function Manifold() {
        }
        return Manifold;
    }());
    physics.Manifold = Manifold;
    /**
     * ManifoldPoint???????????????Manifold???????????????
     * ????????????????????????????????????????????????????????????????????????
     * ??????????????????????????????????????????
     * -ShapeType.Circles??????B???????????????
     * -SeparationFunction.FaceA???cirlceB??????????????????polygonB????????????
     * -SeparationFunction.FaceB???polygonA???????????????????????????????????????????????????????????????????????????
     * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
     */
    var ManifoldPoint = /** @class */ (function () {
        function ManifoldPoint() {
        }
        return ManifoldPoint;
    }());
    physics.ManifoldPoint = ManifoldPoint;
    /**
     * ContactID??????????????????
     */
    var ContactID = /** @class */ (function () {
        function ContactID() {
        }
        return ContactID;
    }());
    physics.ContactID = ContactID;
    /**
     * ???????????????????????????????????????????????????4??????????????????
     */
    var ContactFeature = /** @class */ (function () {
        function ContactFeature() {
        }
        return ContactFeature;
    }());
    physics.ContactFeature = ContactFeature;
    /**
     * ?????????????????????
     */
    var AABB = /** @class */ (function () {
        function AABB(min, max) {
            if (min === void 0) { min = new es.Vector2(); }
            if (max === void 0) { max = new es.Vector2(); }
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
            /** ??????AABB????????? */
            get: function () {
                return this.lowerBound.add(this.upperBound).scale(0.5);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "extents", {
            /** ??????AABB????????????????????? */
            get: function () {
                return this.upperBound.sub(this.lowerBound).scale(0.5);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AABB.prototype, "perimeter", {
            /** ????????????  */
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
             * ??????AABB?????????
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
         * ???????????????????????? ??????????????????????????????NaN???
         * @returns
         */
        AABB.prototype.isValid = function () {
            var d = this.upperBound.sub(this.lowerBound);
            var valid = d.x >= 0 && d.y >= 0;
            valid = valid && this.lowerBound.isValid() && this.upperBound.isValid();
            return valid;
        };
        /**
         * ???AABB????????????
         * @param aabb
         */
        AABB.prototype.combine = function (aabb) {
            this.lowerBound = es.Vector2.min(this.lowerBound, aabb.lowerBound);
            this.upperBound = es.Vector2.max(this.upperBound, aabb.upperBound);
        };
        AABB.prototype.combineT = function (aabb1, aabb2) {
            this.lowerBound = es.Vector2.min(aabb1.lowerBound, aabb2.lowerBound);
            this.upperBound = es.Vector2.max(aabb1.upperBound, aabb2.upperBound);
        };
        /**
         * ???aabb?????????????????????AABB
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
         * ????????????AABB????????????
         * @param a
         * @param b
         */
        AABB.testOverlap = function (a, b) {
            var d1 = b.lowerBound.sub(a.upperBound);
            var d2 = a.lowerBound.sub(b.upperBound);
            if (d1.x > 0 || d1.y > 0)
                return false;
            if (d2.x > 0 || d2.y > 0)
                return false;
            return true;
        };
        return AABB;
    }());
    physics.AABB = AABB;
    var Collision = /** @class */ (function () {
        function Collision() {
        }
        Collision.testOverlap = function (shapeA, indexA, shapeB, indexB, xfA, xfB) {
            this._input = this._input ? this._input : new physics.DistanceInput();
            this._input.proxyA.set(shapeA, indexA);
            this._input.proxyB.set(shapeB, indexB);
            this._input.transformA = xfA;
            this._input.transformB = xfB;
            this._input.useRadii = true;
            var cache = new physics.SimplexCache();
            var output = new physics.DistanceOutput();
            cache = physics.Distance.computeDistance(output, this._input);
            return output.distance < 10 * physics.Settings.epsilon;
        };
        return Collision;
    }());
    physics.Collision = Collision;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * GJK??????????????????????????? ???????????????????????????
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
        DistanceProxy.prototype.getSupport = function (direction) {
            var bestIndex = 0;
            var bestValue = this.vertices[0].dot(direction);
            for (var i = 1; i < this.vertices.length; ++i) {
                var value = this.vertices[i].dot(direction);
                if (value > bestValue) {
                    bestIndex = i;
                    bestValue = value;
                }
            }
            return bestIndex;
        };
        return DistanceProxy;
    }());
    physics.DistanceProxy = DistanceProxy;
    var SimplexVertex = /** @class */ (function () {
        function SimplexVertex() {
            this.a = 0;
            this.indexA = 0;
            this.indexB = 0;
            this.w = es.Vector2.zero;
            this.wA = es.Vector2.zero;
            this.wB = es.Vector2.zero;
        }
        return SimplexVertex;
    }());
    var Simplex = /** @class */ (function () {
        function Simplex() {
            this.count = 0;
        }
        Simplex.prototype.readCache = function (cache, proxyA, transformA, proxyB, transformB) {
            console.assert(cache.count <= 3);
            this.count = cache.count;
            for (var i = 0; i < this.count; ++i) {
                var v = this.v.get(i);
                v.indexA = cache.indexA[i];
                v.indexB = cache.indexB[i];
                var wALocal = proxyA.vertices[v.indexA];
                var wBLocal = proxyB.vertices[v.indexB];
                v.wA = physics.MathUtils.mul(transformA, wALocal);
                v.wB = physics.MathUtils.mul(transformB, wBLocal);
                v.w = v.wB.sub(v.wA);
                v.a = 0;
                this.v[i] = v;
            }
            if (this.count > 1) {
                var metric1 = cache.metric;
                var metric2 = this.getMetric();
                if (metric2 < 0.5 * metric1 || 2 * metric1 < metric2 || metric2 < physics.Settings.epsilon) {
                    this.count = 0;
                }
            }
            if (this.count == 0) {
                var v = this.v.get(0);
                v.indexA = 0;
                v.indexB = 0;
                var wALocal = proxyA.vertices[0];
                var wBLocal = proxyB.vertices[0];
                v.wA = physics.MathUtils.mul(transformA, wALocal);
                v.wB = physics.MathUtils.mul(transformB, wBLocal);
                v.w = v.wB.sub(v.wA);
                v.a = 1;
                this.v.set(0, v);
                this.count = 1;
            }
        };
        Simplex.prototype.writeCache = function (cache) {
            cache.metric = this.getMetric();
            cache.count = this.count;
            for (var i = 0; i < this.count; ++i) {
                cache.indexA.set(i, this.v.get(i).indexA);
                cache.indexB.set(i, this.v.get(i).indexB);
            }
        };
        Simplex.prototype.getMetric = function () {
            switch (this.count) {
                case 0:
                    console.assert(false);
                    return 0;
                case 1:
                    return 0;
                case 2:
                    return (this.v.get(0).w.sub(this.v.get(1).w)).magnitude();
                case 3:
                    return physics.MathUtils.cross(this.v.get(1).w.sub(this.v.get(0).w), this.v.get(2).w.sub(this.v.get(0).w));
                default:
                    console.assert(false);
                    return 0;
            }
        };
        Simplex.prototype.solve2 = function () {
            var w1 = this.v.get(0).w;
            var w2 = this.v.get(1).w;
            var e12 = w2.sub(w1);
            var d12_2 = -w1.dot(e12);
            if (d12_2 <= 0) {
                var v0 = this.v.get(0);
                v0.a = 1;
                this.v.set(0, v0);
                this.count = 1;
                return;
            }
            var d12_1 = w2.dot(e12);
            if (d12_1 <= 0) {
                var v1 = this.v.get(1);
                v1.a = 1;
                this.v.set(1, v1);
                this.count = 1;
                this.v.set(0, this.v.get(1));
                return;
            }
            var inv_d12 = 1 / (d12_1 + d12_2);
            var v0_2 = this.v.get(0);
            var v1_2 = this.v.get(1);
            v0_2.a = d12_1 * inv_d12;
            v1_2.a = d12_2 * inv_d12;
            this.v.set(0, v0_2);
            this.v.set(1, v1_2);
            this.count = 2;
        };
        Simplex.prototype.solve3 = function () {
            var w1 = this.v.get(0).w;
            var w2 = this.v.get(1).w;
            var w3 = this.v.get(2).w;
            var e12 = w2.sub(w1);
            var w1e12 = w1.dot(e12);
            var w2e12 = w2.dot(e12);
            var d12_1 = w2e12;
            var d12_2 = -w1e12;
            var e13 = w3.sub(w1);
            var w1e13 = w1.dot(e13);
            var w3e13 = w3.dot(e13);
            var d13_1 = w3e13;
            var d13_2 = -w1e13;
            var e23 = w3.sub(w2);
            var w2e23 = w2.dot(e23);
            var w3e23 = w3.dot(e23);
            var d23_1 = w3e23;
            var d23_2 = -w2e23;
            var n123 = physics.MathUtils.cross(e12, e13);
            var d123_1 = n123 * physics.MathUtils.cross(w2, w3);
            var d123_2 = n123 * physics.MathUtils.cross(w3, w1);
            var d123_3 = n123 * physics.MathUtils.cross(w1, w2);
            if (d12_2 <= 0 && d13_2 <= 0) {
                var v0_1 = this.v.get(0);
                v0_1.a = 1;
                this.v.set(0, v0_1);
                this.count = 1;
                return;
            }
            if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
                var inv_d12 = 1 / (d12_1 + d12_2);
                var v0_2 = this.v.get(0);
                var v1_2 = this.v.get(1);
                v0_2.a = d12_1 * inv_d12;
                v1_2.a = d12_2 * inv_d12;
                this.v.set(0, v0_2);
                this.v.set(1, v1_2);
                this.count = 2;
                return;
            }
            if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
                var inv_d13 = 1 / (d13_1 + d13_2);
                var v0_3 = this.v.get(0);
                var v2_3 = this.v.get(2);
                v0_3.a = d13_1 * inv_d13;
                v2_3.a = d13_2 * inv_d13;
                this.v.set(0, v0_3);
                this.v.set(2, v2_3);
                this.count = 2;
                this.v.set(1, this.v.get(2));
                return;
            }
            if (d12_1 <= 0 && d23_2 <= 0) {
                var v1_4 = this.v.get(1);
                v1_4.a = 1;
                this.v.set(1, v1_4);
                this.count = 1;
                this.v.set(0, this.v.get(1));
                return;
            }
            if (d13_1 <= 0 && d23_1 <= 0) {
                var v2_5 = this.v.get(2);
                v2_5.a = 1;
                this.v.set(2, v2_5);
                this.count = 1;
                this.v.set(0, this.v.get(2));
                return;
            }
            if (d23_1 > 0 && d23_2 > 0 && d123_1 <= 0) {
                var inv_d23 = 1 / (d23_1 + d23_2);
                var v1_6 = this.v.get(1);
                var v2_6 = this.v.get(2);
                v1_6.a = d23_1 * inv_d23;
                v2_6.a = d23_2 * inv_d23;
                this.v.set(1, v1_6);
                this.v.set(2, v2_6);
                this.count = 2;
                this.v.set(0, this.v.get(2));
                return;
            }
            var inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
            var v0_7 = this.v.get(0);
            var v1_7 = this.v.get(1);
            var v2_7 = this.v.get(2);
            v0_7.a = d123_1 * inv_d123;
            v1_7.a = d123_2 * inv_d123;
            v2_7.a = d123_3 * inv_d123;
            this.v.set(0, v0_7);
            this.v.set(1, v1_7);
            this.v.set(2, v2_7);
            this.count = 3;
        };
        Simplex.prototype.getSearchDirection = function () {
            switch (this.count) {
                case 1:
                    return this.v.get(0).w.scale(-1);
                case 2: {
                    var e12 = this.v.get(1).w.sub(this.v.get(0).w);
                    var sgn = physics.MathUtils.cross(e12, this.v.get(0).w.scale(-1));
                    if (sgn > 0) {
                        return new es.Vector2(-e12.y, e12.x);
                    }
                    else {
                        return new es.Vector2(e12.y, -e12.x);
                    }
                }
                default:
                    console.assert(false);
                    return es.Vector2.zero;
            }
        };
        Simplex.prototype.getWitnessPoints = function (pA, pB) {
            switch (this.count) {
                case 0:
                    pA = es.Vector2.zero;
                    pB = es.Vector2.zero;
                    console.assert(false);
                    break;
                case 1:
                    pA = this.v.get(0).wA;
                    pB = this.v.get(0).wB;
                    break;
                case 2:
                    pA = this.v.get(0).wA.scale(this.v.get(0).a).add(this.v.get(1).wA.scale(this.v.get(1).a));
                    pB = this.v.get(0).wB.scale(this.v.get(0).a).add(this.v.get(1).wB.scale(this.v.get(1).a));
                    break;
                case 3:
                    pA = this.v.get(0).wA.scale(this.v.get(0).a).add(this.v.get(1).wA.scale(this.v.get(1).a)).add(this.v.get(2).wA.scale(this.v.get(2).a));
                    pB = pA;
                    break;
                default:
                    throw new Error('exception');
            }
        };
        return Simplex;
    }());
    var Distance = /** @class */ (function () {
        function Distance() {
        }
        Distance.computeDistance = function (output, input) {
            var cache = new SimplexCache();
            if (physics.Settings.enableDiagnostics)
                ++this.gjkCalls;
            var simplex = new Simplex();
            simplex.readCache(cache, input.proxyA, input.transformA, input.proxyB, input.transformB);
            var saveA = new physics.FixedArray3();
            var saveB = new physics.FixedArray3();
            var iter = 0;
            while (iter < physics.Settings.maxGJKIterations) {
                var saveCount = simplex.count;
                for (var i = 0; i < saveCount; ++i) {
                    saveA.set(i, simplex.v.get(i).indexA);
                    saveB.set(i, simplex.v.get(i).indexB);
                }
                switch (simplex.count) {
                    case 1:
                        break;
                    case 2:
                        simplex.solve2();
                        break;
                    case 3:
                        simplex.solve3();
                        break;
                    default:
                        console.assert(false);
                        break;
                }
                if (simplex.count == 3)
                    break;
                var d = simplex.getSearchDirection();
                if (d.lengthSquared() < physics.Settings.epsilon * physics.Settings.epsilon) {
                    break;
                }
                var vertex = simplex.v.get(simplex.count);
                vertex.indexA = input.proxyA.getSupport(physics.MathUtils.mulT(input.transformA.q, d.scale(-1)));
                vertex.wA = physics.MathUtils.mul(input.transformA, input.proxyA.vertices[vertex.indexA]);
                vertex.indexB = input.proxyB.getSupport(physics.MathUtils.mulT(input.transformB.q, d));
                vertex.wB = physics.MathUtils.mul(input.transformB, input.proxyB.vertices[vertex.indexB]);
                vertex.w = vertex.wB.sub(vertex.wA);
                simplex.v.set(simplex.count, vertex);
                ++iter;
                if (physics.Settings.enableDiagnostics)
                    ++this.gjkIters;
                var duplicate = false;
                for (var i = 0; i < saveCount; ++i) {
                    if (vertex.indexA == saveA.get(i) && vertex.indexB == saveB.get(i)) {
                        duplicate = true;
                        break;
                    }
                }
                if (duplicate)
                    break;
                ++simplex.count;
            }
            if (physics.Settings.enableDiagnostics)
                this.gjkMaxIters = Math.max(this.gjkMaxIters, iter);
            simplex.getWitnessPoints(output.pointA, output.pointB);
            output.distance = (output.pointA.sub(output.pointB)).magnitude();
            output.iterations = iter;
            simplex.writeCache(cache);
            if (input.useRadii) {
                var rA = input.proxyA.radius;
                var rB = input.proxyB.radius;
                if (output.distance > rA + rB && output.distance > physics.Settings.epsilon) {
                    output.distance -= rA + rB;
                    var normal = output.pointB.sub(output.pointA).normalize();
                    output.pointA = output.pointA.add(normal.scale(rA));
                    output.pointB = output.pointB.sub(normal.scale(rB));
                }
                else {
                    var p = output.pointA.add(output.pointB).scale(0.5);
                    output.pointA = p;
                    output.pointB = p;
                    output.distance = 0;
                }
            }
            return cache;
        };
        return Distance;
    }());
    physics.Distance = Distance;
    var DistanceInput = /** @class */ (function () {
        function DistanceInput() {
            this.proxyA = new DistanceProxy();
            this.proxyB = new DistanceProxy();
        }
        return DistanceInput;
    }());
    physics.DistanceInput = DistanceInput;
    var DistanceOutput = /** @class */ (function () {
        function DistanceOutput() {
        }
        return DistanceOutput;
    }());
    physics.DistanceOutput = DistanceOutput;
    var SimplexCache = /** @class */ (function () {
        function SimplexCache() {
        }
        return SimplexCache;
    }());
    physics.SimplexCache = SimplexCache;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * ???????????????????????? ??????????????????????????????
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
     * ??????????????????????????????????????????????????????????????????????????????????????????????????????
     * ???????????????AABB????????????
     * ????????????????????????Settings.b2_fatAABBFactor????????????AABB???????????????AABB????????????????????????
     * ???????????????????????????????????????????????????????????????
     * ???????????????????????????????????????????????????????????????????????????????????????
     */
    var DynamicTree = /** @class */ (function () {
        /**
         * ??????????????????????????????
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
             * ???O???N???????????????????????????????????? ????????????????????????
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
             * ?????????????????????????????????????????????
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
             * ???????????????????????????????????? ????????????????????????????????????????????????
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
         * ????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????
         * @param aabb
         * @param userData
         */
        DynamicTree.prototype.addProxy = function (aabb, userData) {
            var proxyId = this.allocateNode();
            var r = new es.Vector2(physics.Settings.aabbExtension, physics.Settings.aabbExtension);
            this._nodes[proxyId].aabb.lowerBound = aabb.lowerBound.sub(r);
            this._nodes[proxyId].aabb.upperBound = aabb.upperBound.add(r);
            this._nodes[proxyId].userData = userData;
            this._nodes[proxyId].height = 0;
            this.insertLeaf(proxyId);
            return proxyId;
        };
        DynamicTree.prototype.removeProxy = function (proxyId) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            console.assert(this._nodes[proxyId].isLeaf());
            this.removeLeaf(proxyId);
            this.freeNode(proxyId);
        };
        DynamicTree.prototype.moveProxy = function (proxyId, aabb, displacement) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            console.assert(this._nodes[proxyId].isLeaf());
            if (this._nodes[proxyId].aabb.contains(aabb)) {
                return false;
            }
            this.removeLeaf(proxyId);
            var b = aabb;
            var r = new es.Vector2(physics.Settings.aabbExtension, physics.Settings.aabbExtension);
            b.lowerBound = b.lowerBound.sub(r);
            b.upperBound = b.upperBound.add(r);
            var d = displacement.scale(physics.Settings.aabbExtension);
            if (d.x < 0)
                b.lowerBound.x += d.x;
            else
                b.upperBound.x += d.x;
            if (d.y < 0)
                b.lowerBound.y += d.y;
            else
                b.upperBound.y += d.y;
            this._nodes[proxyId].aabb = b;
            this.insertLeaf(proxyId);
            return true;
        };
        DynamicTree.prototype.getUserData = function (proxyId) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            return this._nodes[proxyId].userData;
        };
        DynamicTree.prototype.getFatAABB = function (proxyId) {
            console.assert(0 <= proxyId && proxyId < this._nodeCapacity);
            var fatAABB = this._nodes[proxyId].aabb;
            return fatAABB;
        };
        DynamicTree.prototype.allocateNode = function () {
            if (this._freeList == DynamicTree.nullNode) {
                console.assert(this._nodeCount == this._nodeCapacity);
                var oldNodes = this._nodes;
                this._nodeCapacity *= 2;
                this._nodes = oldNodes.slice(0, this._nodeCount);
                for (var i = this._nodeCount; i < this._nodeCapacity - 1; ++i) {
                    this._nodes[i] = new TreeNode();
                    this._nodes[i].parentOrNext = i + 1;
                    this._nodes[i].height = -1;
                }
                this._nodes[this._nodeCapacity - 1] = new TreeNode();
                this._nodes[this._nodeCapacity - 1].parentOrNext = DynamicTree.nullNode;
                this._nodes[this._nodeCapacity - 1].height = -1;
                this._freeList = this._nodeCount;
            }
            var nodeId = this._freeList;
            this._freeList = this._nodes[nodeId].parentOrNext;
            this._nodes[nodeId].parentOrNext = DynamicTree.nullNode;
            this._nodes[nodeId].child1 = DynamicTree.nullNode;
            this._nodes[nodeId].child2 = DynamicTree.nullNode;
            this._nodes[nodeId].height = 0;
            this._nodes[nodeId].userData = new physics.FixtureProxy();
            ++this._nodeCount;
            return nodeId;
        };
        DynamicTree.prototype.freeNode = function (nodeId) {
            console.assert(0 <= nodeId && nodeId < this._nodeCapacity);
            console.assert(0 < this._nodeCount);
            this._nodes[nodeId].parentOrNext = this._freeList;
            this._nodes[nodeId].height = -1;
            this._freeList = nodeId;
            --this._nodeCount;
        };
        DynamicTree.prototype.insertLeaf = function (leaf) {
            if (this._root == DynamicTree.nullNode) {
                this._root = leaf;
                this._nodes[this._root].parentOrNext = DynamicTree.nullNode;
                return;
            }
            var leafAABB = this._nodes[leaf].aabb;
            var index = this._root;
            while (this._nodes[index].isLeaf() == false) {
                var child1 = this._nodes[index].child1;
                var child2 = this._nodes[index].child2;
                var area = this._nodes[index].aabb.perimeter;
                var combinedAABB = new physics.AABB();
                combinedAABB.combineT(this._nodes[index].aabb, leafAABB);
                var combinedArea = combinedAABB.perimeter;
                var cost = 2 * combinedArea;
                var inheritanceCost = 2 * (combinedArea - area);
                var cost1 = 0;
                if (this._nodes[child1].isLeaf()) {
                    var aabb = new physics.AABB();
                    aabb.combineT(leafAABB, this._nodes[child1].aabb);
                    cost1 = aabb.perimeter + inheritanceCost;
                }
                else {
                    var aabb = new physics.AABB();
                    aabb.combineT(leafAABB, this._nodes[child1].aabb);
                    var oldArea = this._nodes[child1].aabb.perimeter;
                    var newArea = aabb.perimeter;
                    cost1 = (newArea - oldArea) + inheritanceCost;
                }
                var cost2 = 0;
                if (this._nodes[child2].isLeaf()) {
                    var aabb = new physics.AABB();
                    aabb.combineT(leafAABB, this._nodes[child2].aabb);
                    cost2 = aabb.perimeter + inheritanceCost;
                }
                else {
                    var aabb = new physics.AABB();
                    aabb.combineT(leafAABB, this._nodes[child2].aabb);
                    var oldArea = this._nodes[child2].aabb.perimeter;
                    var newArea = aabb.perimeter;
                    cost2 = newArea - oldArea + inheritanceCost;
                }
                if (cost < cost1 && cost1 < cost2) {
                    break;
                }
                if (cost1 < cost2)
                    index = child1;
                else
                    index = child2;
            }
            var sibling = index;
            var oldParent = this._nodes[sibling].parentOrNext;
            var newParent = this.allocateNode();
            this._nodes[newParent].parentOrNext = oldParent;
            this._nodes[newParent].userData = new physics.FixtureProxy();
            this._nodes[newParent].aabb.combineT(leafAABB, this._nodes[sibling].aabb);
            this._nodes[newParent].height = this._nodes[sibling].height + 1;
            if (oldParent != DynamicTree.nullNode) {
                if (this._nodes[oldParent].child1 == sibling) {
                    this._nodes[oldParent].child1 = newParent;
                }
                else {
                    this._nodes[oldParent].child2 = newParent;
                }
                this._nodes[newParent].child1 = sibling;
                this._nodes[newParent].child2 = leaf;
                this._nodes[sibling].parentOrNext = newParent;
                this._nodes[leaf].parentOrNext = newParent;
            }
            else {
                this._nodes[newParent].child1 = sibling;
                this._nodes[newParent].child2 = leaf;
                this._nodes[sibling].parentOrNext = newParent;
                this._nodes[leaf].parentOrNext = newParent;
                this._root = newParent;
            }
            index = this._nodes[leaf].parentOrNext;
            while (index != DynamicTree.nullNode) {
                index = this.balance(index);
                var child1 = this._nodes[index].child1;
                var child2 = this._nodes[index].child2;
                console.assert(child1 != DynamicTree.nullNode);
                console.assert(child2 != DynamicTree.nullNode);
                this._nodes[index].height = 1 + Math.max(this._nodes[child1].height, this._nodes[child2].height);
                this._nodes[index].aabb.combineT(this._nodes[child1].aabb, this._nodes[child2].aabb);
                index = this._nodes[index].parentOrNext;
            }
        };
        DynamicTree.prototype.removeLeaf = function (leaf) {
            if (leaf == this._root) {
                this._root = DynamicTree.nullNode;
                return;
            }
            var parent = this._nodes[leaf].parentOrNext;
            var grandParent = this._nodes[parent].parentOrNext;
            var sibling = 0;
            if (this._nodes[parent].child1 == leaf) {
                sibling = this._nodes[parent].child2;
            }
            else {
                sibling = this._nodes[parent].child1;
            }
            if (grandParent != DynamicTree.nullNode) {
                if (this._nodes[grandParent].child1 == parent) {
                    this._nodes[grandParent].child1 = sibling;
                }
                else {
                    this._nodes[grandParent].child2 = sibling;
                }
                this._nodes[sibling].parentOrNext = grandParent;
                this.freeNode(parent);
                var index = grandParent;
                while (index != DynamicTree.nullNode) {
                    index = this.balance(index);
                    var child1 = this._nodes[index].child1;
                    var child2 = this._nodes[index].child2;
                    this._nodes[index].aabb.combineT(this._nodes[child1].aabb, this._nodes[child2].aabb);
                    this._nodes[index].height = 1 + Math.max(this._nodes[child1].height, this._nodes[child2].height);
                    index = this._nodes[index].parentOrNext;
                }
            }
            else {
                this._root = sibling;
                this._nodes[sibling].parentOrNext = DynamicTree.nullNode;
                this.freeNode(parent);
            }
        };
        DynamicTree.prototype.balance = function (iA) {
            console.assert(iA != DynamicTree.nullNode);
            var A = this._nodes[iA];
            if (A.isLeaf() || A.height < 2)
                return iA;
            var iB = A.child1;
            var iC = A.child2;
            console.assert(0 <= iB && iB < this._nodeCapacity);
            console.assert(0 <= iC && iC < this._nodeCapacity);
            var B = this._nodes[iB];
            var C = this._nodes[iC];
            var balance = C.height - B.height;
            if (balance > 1) {
                var iF = C.child1;
                var iG = C.child2;
                var F = this._nodes[iF];
                var G = this._nodes[iG];
                console.assert(0 <= iF && iF < this._nodeCapacity);
                console.assert(0 <= iG && iG < this._nodeCapacity);
                C.child1 = iA;
                C.parentOrNext = A.parentOrNext;
                A.parentOrNext = iC;
                if (C.parentOrNext != DynamicTree.nullNode) {
                    if (this._nodes[C.parentOrNext].child1 == iA) {
                        this._nodes[C.parentOrNext].child1 = iC;
                    }
                    else {
                        console.assert(this._nodes[C.parentOrNext].child2 == iA);
                        this._nodes[C.parentOrNext].child2 = iC;
                    }
                }
                else {
                    this._root = iC;
                }
                if (F.height > G.height) {
                    C.child2 = iF;
                    A.child2 = iG;
                    G.parentOrNext = iA;
                    A.aabb.combineT(B.aabb, G.aabb);
                    C.aabb.combineT(A.aabb, F.aabb);
                    A.height = 1 + Math.max(B.height, G.height);
                    C.height = 1 + Math.max(A.height, F.height);
                }
                else {
                    C.child2 = iG;
                    A.child2 = iF;
                    F.parentOrNext = iA;
                    A.aabb.combineT(B.aabb, F.aabb);
                    C.aabb.combineT(A.aabb, G.aabb);
                    A.height = 1 + Math.max(B.height, F.height);
                    C.height = 1 + Math.max(A.height, G.height);
                }
                return iC;
            }
        };
        DynamicTree.nullNode = -1;
        return DynamicTree;
    }());
    physics.DynamicTree = DynamicTree;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var Pair = /** @class */ (function () {
        function Pair() {
            this.proxyIdA = 0;
            this.proxyIdB = 0;
        }
        Pair.prototype.compareTo = function (other) {
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
        };
        return Pair;
    }());
    /**
     * ??????????????????????????????????????????????????????????????????
     * ??????????????????????????????????????????
     * ???????????????????????????????????????
     * ?????????????????????????????????????????????????????????
     */
    var DynamicTreeBroadPhase = /** @class */ (function () {
        function DynamicTreeBroadPhase() {
            this._moveCapacity = 0;
            this._moveCount = 0;
            this._pairCapacity = 0;
            this._pairCount = 0;
            this._proxyCount = 0;
            this._queryProxyId = 0;
            this._tree = new physics.DynamicTree();
            this._queryCallback = this.queryCallback;
            this._proxyCount = 0;
            this._pairCapacity = 16;
            this._pairCount = 0;
            this._pairBuffer = [];
            this._moveCapacity = 16;
            this._moveCount = 0;
            this._moveBuffer = [];
        }
        Object.defineProperty(DynamicTreeBroadPhase.prototype, "proxyCount", {
            get: function () {
                return this._proxyCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicTreeBroadPhase.prototype, "treeQuality", {
            get: function () {
                return this._tree.areaRatio;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicTreeBroadPhase.prototype, "treeBalance", {
            get: function () {
                return this._tree.maxBalance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicTreeBroadPhase.prototype, "treeHeight", {
            get: function () {
                return this._tree.height;
            },
            enumerable: true,
            configurable: true
        });
        DynamicTreeBroadPhase.prototype.addProxy = function (proxy) {
            var proxyId = this._tree.addProxy(proxy.aabb, proxy);
            ++this._proxyCount;
            this.bufferMove(proxyId);
            return proxyId;
        };
        DynamicTreeBroadPhase.prototype.removeProxy = function (proxyId) {
            this.unBufferMove(proxyId);
            --this._proxyCount;
            this._tree.removeProxy(proxyId);
        };
        DynamicTreeBroadPhase.prototype.touchProxy = function (proxyId) {
            this.bufferMove(proxyId);
        };
        DynamicTreeBroadPhase.prototype.moveProxy = function (proxyId, aabb, dispacement) {
            var buffer = this._tree.moveProxy(proxyId, aabb, dispacement);
            if (buffer)
                this.bufferMove(proxyId);
        };
        DynamicTreeBroadPhase.prototype.bufferMove = function (proxyId) {
            if (this._moveCount == this._moveCapacity) {
                var oldBuffer = this._moveBuffer;
                this._moveCapacity *= 2;
                this._moveBuffer = oldBuffer.slice(0, this._moveCount);
            }
            this._moveBuffer[this._moveCount] = proxyId;
            ++this._moveCount;
        };
        DynamicTreeBroadPhase.prototype.unBufferMove = function (proxyId) {
            for (var i = 0; i < this._moveCount; ++i) {
                if (this._moveBuffer[i] == proxyId)
                    this._moveBuffer[i] = physics.DynamicTree.nullNode;
            }
        };
        DynamicTreeBroadPhase.prototype.queryCallback = function (proxyId) {
            if (proxyId == this._queryProxyId)
                return true;
            if (this._pairCount == this._pairCapacity) {
                var oldBuffer = this._pairBuffer;
                this._pairCapacity *= 2;
                this._pairBuffer = oldBuffer.slice(0, this._pairCount);
            }
            this._pairBuffer[this._pairCount].proxyIdA = Math.min(proxyId, this._queryProxyId);
            this._pairBuffer[this._pairCount].proxyIdB = Math.max(proxyId, this._queryProxyId);
            ++this._pairCount;
            return true;
        };
        DynamicTreeBroadPhase.prototype.getProxy = function (proxyId) {
            return this._tree.getUserData(proxyId);
        };
        DynamicTreeBroadPhase.prototype.testOverlap = function (proxyIdA, proxyIdB) {
            var aabbA = this._tree.getFatAABB(proxyIdA);
            var aabbB = this._tree.getFatAABB(proxyIdB);
            return physics.AABB.testOverlap(aabbA, aabbB);
        };
        DynamicTreeBroadPhase.nullProxy = -1;
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
     * ??????????????????????????????????????????
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
     * ??????????????????????????? ????????????????????????????????????
     * ??????fixture?????????????????????World???????????????????????????
     * ?????????????????????????????????????????????
     */
    var Shape = /** @class */ (function () {
        function Shape(density) {
            this._density = density;
            this.shapeType = ShapeType.unknown;
        }
        Object.defineProperty(Shape.prototype, "density", {
            /**
             * ???????????????????????? ?????????????????????????????????????????????
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
             * ??????????????????????????????????????????????????????
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
         * ???????????????????????????????????????????????????????????????
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
     * ??????????????????????????? ????????????????????????????????????????????????????????? ????????????????????????????????????????????????
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
         * ????????????????????????
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
            var p1 = physics.MathUtils.mul(transform.q, input.point1.sub(transform.p));
            var p2 = physics.MathUtils.mul(transform.q, input.point2.sub(transform.p));
            var d = p2.sub(p1);
            var v1 = this._vertex1.clone();
            var v2 = this._vertex2.clone();
            var e = v2.sub(v1);
            var normal = new es.Vector2(e.y, -e.x);
            es.Vector2Ext.normalize(normal);
            var numerator = normal.dot(v1.sub(p1));
            var denominator = normal.dot(d);
            if (denominator == 0)
                return false;
            var t = numerator / denominator;
            if (t < 0 || input.maxFraction < t)
                return false;
            var q = es.Vector2.add(p1, d.scale(t));
            var r = v2.sub(v1);
            var rr = r.dot(r);
            if (rr == 0)
                return false;
            var s = q.sub(v1).dot(r) / rr;
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
            var v1 = physics.MathUtils.mul(transform, this._vertex1);
            var v2 = physics.MathUtils.mul(transform, this._vertex2);
            var lower = es.Vector2.min(v1, v2);
            var upper = es.Vector2.max(v1, v2);
            var r = new es.Vector2(this.radius, this.radius);
            aabb.lowerBound = lower.sub(r);
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
     * ??????????????????????????????????????????
     * ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     * ???????????????????????????????????????
     * ???????????????????????????????????????????????????????????????
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
                console.assert(v1.distance(v2) > physics.Settings.linearSlop * physics.Settings.linearSlop);
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
            var v1 = physics.MathUtils.mul(transform, this.vertices[i1]);
            var v2 = physics.MathUtils.mul(transform, this.vertices[i2]);
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
            var center = es.Vector2.add(transform.p, physics.MathUtils.mul(transform.q, this.position));
            var d = point.sub(center);
            return d.dot(d) <= this._2radius;
        };
        CircleShape.prototype.rayCast = function (output, input, transform, childIndex) {
            var pos = es.Vector2.add(transform.p, physics.MathUtils.mul(transform.q, this.position));
            var s = input.point1.sub(pos);
            var b = s.dot(s) - this._2radius;
            var r = input.point2.sub(input.point1);
            var c = s.dot(r);
            var rr = r.dot(r);
            var sigma = c * c - rr * b;
            if (sigma < 0 || rr < physics.Settings.epsilon)
                return false;
            var a = -(c + (Math.sqrt(sigma)));
            if (0 <= a && a <= input.maxFraction * rr) {
                a /= rr;
                output.fraction = a;
                output.normal = es.Vector2.add(s, r.scale(a));
                es.Vector2Ext.normalize(output.normal);
                return true;
            }
            return false;
        };
        CircleShape.prototype.computeAABB = function (aabb, transform, childIndex) {
            var p = es.Vector2.add(transform.p, physics.MathUtils.mul(transform.q, this.position));
            aabb.lowerBound = new es.Vector2(p.x - this.radius, p.y - this.radius);
            aabb.upperBound = new es.Vector2(p.x + this.radius, p.y + this.radius);
        };
        CircleShape.prototype.computeProperties = function () {
            var area = physics.Settings.pi * this._2radius;
            this.massData.area = area;
            this.massData.mass = this.density * area;
            this.massData.centroid = this.position.clone();
            this.massData.inertia = this.massData.mass * (0.5 * this._2radius + this.position.dot(this.position));
        };
        CircleShape.prototype.computeSubmergedArea = function (normal, offset, xf, sc) {
            sc.x = 0;
            sc.y = 0;
            var p = physics.MathUtils.mul(xf, this.position);
            var l = -(normal.dot(p) - offset);
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
         * ?????????????????????????????????????????????????????????List
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
                var edge = this._vertices[next].sub(this._vertices[i]);
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
                var e1 = this.vertices[i].sub(s);
                var e2 = i + 1 < this.vertices.length ? this.vertices[i + 1].sub(s) : this.vertices[0].sub(s);
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
            this.massData.inertia += this.massData.mass * (this.massData.centroid.dot(this.massData.centroid) - center.dot(center));
        };
        PolygonShape.prototype.testPoint = function (transform, point) {
            var pLocal = physics.MathUtils.mul(transform.q, point.sub(transform.p));
            for (var i = 0; i < this.vertices.length; ++i) {
                var dot = this.normals[i].dot(pLocal.sub(this.vertices[i]));
                if (dot > 0) {
                    return false;
                }
            }
            return true;
        };
        PolygonShape.prototype.rayCast = function (output, input, transform, childIndex) {
            var p1 = physics.MathUtils.mul(transform.q, input.point1.sub(transform.p));
            var p2 = physics.MathUtils.mul(transform.q, input.point2.sub(transform.p));
            var d = p2.sub(p1);
            var lower = 0, upper = input.maxFraction;
            var index = -1;
            for (var i = 0; i < this.vertices.length; ++i) {
                var numerator = this.normals[i].dot(this.vertices[i].sub(p1));
                var denominator = this.normals[i].dot(d);
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
                output.normal = physics.MathUtils.mul(transform.q, this.normals[index]);
                return true;
            }
            return false;
        };
        PolygonShape.prototype.computeAABB = function (aabb, transform, childIndex) {
            var lower = physics.MathUtils.mul(transform, this.vertices[0]);
            var upper = lower.clone();
            for (var i = 1; i < this.vertices.length; ++i) {
                var v = physics.MathUtils.mul(transform, this.vertices[i]);
                lower = es.Vector2.min(lower, v);
                upper = es.Vector2.max(upper, v);
            }
            var r = new es.Vector2(this.radius, this.radius);
            aabb.lowerBound = lower.sub(r);
            aabb.upperBound = es.Vector2.add(upper, r);
        };
        PolygonShape.prototype.computeSubmergedArea = function (normal, offset, xf, sc) {
            sc.x = 0;
            sc.y = 0;
            var normalL = physics.MathUtils.mul(xf.q, normal);
            var offsetL = offset - normal.dot(xf.p);
            var depths = [];
            var diveCount = 0;
            var intoIndex = -1;
            var outoIndex = -1;
            var lastSubmerged = false;
            var i;
            for (i = 0; i < this.vertices.length; i++) {
                depths[i] = normalL.dot(this.vertices[i]) - offsetL;
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
                        sc = physics.MathUtils.mul(xf, this.massData.centroid);
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
                    var e1 = p2.sub(intoVec);
                    var e2 = p3.sub(intoVec);
                    var d = physics.MathUtils.cross(e1, e2);
                    var triangleArea = 0.5 * d;
                    area += triangleArea;
                    center.add(es.Vector2.add(intoVec, p2).add(p3).multiplyScaler(triangleArea * k_inv3));
                }
                p2 = p3.clone();
            }
            center.multiplyScaler(1 / area);
            sc = physics.MathUtils.mul(xf, center);
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
     * ??????????????????????????????????????????
     */
    var FSConvert = /** @class */ (function () {
        function FSConvert() {
        }
        /**
         * ?????????????????????????????????????????????
         */
        FSConvert.simToDisplay = 100;
        /**
         * ?????????????????????????????????????????????
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
    var FixedArray3 = /** @class */ (function () {
        function FixedArray3() {
        }
        FixedArray3.prototype.get = function (index) {
            switch (index) {
                case 0:
                    return this._value0;
                case 1:
                    return this._value1;
                case 2:
                    return this._value2;
                default:
                    throw new Error('index out of range');
            }
        };
        FixedArray3.prototype.set = function (index, value) {
            switch (index) {
                case 0:
                    this._value0 = value;
                    break;
                case 1:
                    this._value1 = value;
                    break;
                case 2:
                    this._value2 = value;
                    break;
                default:
                    throw new Error('index out of range');
            }
        };
        return FixedArray3;
    }());
    physics.FixedArray3 = FixedArray3;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * ??????????????????TOI???????????????/??????????????????
     * ?????????????????????????????????????????????????????????????????????
     * ???????????????????????????????????????????????????????????????
     */
    var Sweep = /** @class */ (function () {
        function Sweep() {
        }
        /**
         * ?????????????????????????????????
         * @param xfb
         * @param beta
         */
        Sweep.prototype.getTransform = function (xfb, beta) {
            xfb.p.x = (1 - beta) * this.c0.x + beta * this.c.x;
            xfb.p.y = (1 - beta) * this.c0.y + beta * this.c.y;
            var angle = (1 - beta) * this.a0 + beta * this.a;
            xfb.q.set(angle);
            // ???????????? 
            xfb.p.sub(MathUtils.mul(xfb.q, this.localCenter));
        };
        /**
         * ????????????????????????????????????????????????
         * @param alpha
         */
        Sweep.prototype.advance = function (alpha) {
            console.assert(this.alpha0 < 1);
            var beta = (alpha - this.alpha0) / (1 - this.alpha0);
            this.c0.add(this.c.sub(this.c0).multiplyScaler(beta));
            this.a0 += beta * (this.a - this.a0);
            this.alpha0 = alpha;
        };
        /**
         * ???????????????
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
     * ??????????????????????????????
     * ?????????????????????????????????????????????
     */
    var Transform = /** @class */ (function () {
        function Transform(position, rotation) {
            this.p = position;
            this.q = rotation;
        }
        /**
         * ???????????????????????????
         */
        Transform.prototype.setIdentity = function () {
            this.p = es.Vector2.zero;
            this.q.setIdentity();
        };
        /**
         * ?????????????????????????????????
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
         * ???????????????????????????
         * @param angle
         */
        function Rot(angle) {
            this.s = Math.sin(angle);
            this.c = Math.cos(angle);
        }
        /**
         * ?????????????????????????????????????????????
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
         * ?????????identity??????
         */
        Rot.prototype.setIdentity = function () {
            this.s = 0;
            this.c = 1;
        };
        /**
         * ???????????????
         * @returns
         */
        Rot.prototype.getAngle = function () {
            return Math.atan2(this.s, this.c);
        };
        /**
         * ??????x???
         * @returns
         */
        Rot.prototype.getXAxis = function () {
            return new es.Vector2(this.c, this.s);
        };
        /**
         * ??????y???
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
        MathUtils.mul = function (a, b) {
            if (a instanceof Transform && b instanceof es.Vector2) {
                var x = (a.q.c * b.x - a.q.s * b.y) + a.p.x;
                var y = (a.q.s * b.x + a.q.c * b.y) + a.p.y;
                return new es.Vector2(x, y);
            }
            if (a instanceof Rot && b instanceof es.Vector2) {
                return new es.Vector2(a.c * b.x - a.s * b.y, a.s * b.x + a.c * b.y);
            }
            if (a instanceof Mat22 && b instanceof es.Vector2) {
                return new es.Vector2(b.x * a.ex.x + b.y * a.ex.y, b.x * a.ey.x + b.y * a.ey.y);
            }
            if (a instanceof Rot && b instanceof Rot) {
                var qr = new Rot(0);
                qr.s = a.c * b.s - a.s * b.c;
                qr.c = a.c * b.c + a.s * b.s;
                return qr;
            }
            if (a instanceof Rot && b instanceof es.Vector2) {
                return new es.Vector2(a.c * b.x + a.s * b.y, -a.s * b.x + a.c * b.y);
            }
        };
        MathUtils.mulT = function (q, v) {
            return new es.Vector2(q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y);
        };
        MathUtils.cross = function (a, b) {
            return a.x * b.y - a.y * b.x;
        };
        return MathUtils;
    }());
    physics.MathUtils = MathUtils;
    /**
     * 2??2????????? ????????????????????????
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
        /** ????????????????????????  */
        PolygonError[PolygonError["noError"] = 0] = "noError";
        /** ??????????????????3???Settings.MaxPolygonVertices???????????? */
        PolygonError[PolygonError["invalidAmountOfVertices"] = 1] = "invalidAmountOfVertices";
        /** ???????????????????????? ????????????????????????????????? */
        PolygonError[PolygonError["notSimple"] = 2] = "notSimple";
        /** ???????????????????????? */
        PolygonError[PolygonError["notCounterClockWise"] = 3] = "notCounterClockWise";
        /** ??????????????????????????????????????? */
        PolygonError[PolygonError["notConvex"] = 4] = "notConvex";
        /** ????????????????????? */
        PolygonError[PolygonError["areaTooSmall"] = 5] = "areaTooSmall";
        /** ????????????????????? */
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
         * ???????????????????????? ????????????????????????
         * @param index
         * @returns
         */
        Vertices.prototype.nextIndex = function (index) {
            return (index + 1 > this.length - 1) ? 0 : index + 1;
        };
        /**
         * ???????????????????????? ????????????????????????
         * @param index
         * @returns
         */
        Vertices.prototype.nextVertex = function (index) {
            return this[this.nextIndex(index)];
        };
        /**
         * ???????????????????????? ????????????????????????
         * @param index
         * @returns
         */
        Vertices.prototype.previousIndex = function (index) {
            return index - 1 < 0 ? this.length - 1 : index - 1;
        };
        /**
         * ???????????????????????? ????????????????????????
         * @param index
         * @returns
         */
        Vertices.prototype.previousVertx = function (index) {
            return this[this.previousIndex(index)];
        };
        /**
         * ????????????????????? ??????????????????0?????????????????????????????????????????????
         * @returns
         */
        Vertices.prototype.getSignedArea = function () {
            // ???????????????????????????????????????????????????????????????3??????
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
         * ????????????
         * @returns
         */
        Vertices.prototype.getArea = function () {
            var area = this.getSignedArea();
            return (area < 0 ? -area : area);
        };
        /**
         * ????????????
         * @returns
         */
        Vertices.prototype.getCentroid = function () {
            // ???????????????????????????????????????????????????????????????3??????
            if (this.length < 3)
                return new es.Vector2(Number.NaN, Number.NaN);
            // Box2D?????????????????????
            var c = es.Vector2.zero;
            var area = 0;
            var inv3 = 1 / 3;
            for (var i = 0; i < this.length; ++i) {
                // ???????????????
                var current = this[i];
                var next = (i + 1 < this.length ? this[i + 1] : this[0]);
                var triangleArea = 0.5 * (current.x * next.y - current.y * next.x);
                area += triangleArea;
                // ?????????????????? 
                c.add(current.add(next).scale(triangleArea * inv3));
            }
            c.multiplyScaler(1 / area);
            return c;
        };
        /**
         * ?????????????????????????????????AABB???
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
         * ??????????????????????????????
         * @param value
         */
        Vertices.prototype.translate = function (value) {
            var e_2, _a;
            console.assert(!this.attackedToBody, "??????????????????????????????????????????????????????????????? ??????Body.Position?????? ");
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
         * ?????????????????????????????????
         * @param value
         */
        Vertices.prototype.scale = function (value) {
            var e_3, _a;
            console.assert(!this.attackedToBody, "Body????????????????????????????????????????????? ");
            for (var i = 0; i < this.length; i++)
                this[i] = this[i].multiply(value);
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
         * ?????????????????????????????????????????????????????????
         * ????????????????????????????????????????????????????????????????????????????????? ??????Body.Rotation???
         * @param value
         */
        Vertices.prototype.rotate = function (value) {
            var e_4, _a;
            console.assert(!this.attackedToBody, "Body??????????????????????????????????????????????????? ");
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
         * ????????????????????????????????? O???n ^ 2??????????????????
         * ?????????
         * -?????????????????????????????????
         * -??????????????????????????????
         */
        Vertices.prototype.isConvex = function () {
            //???????????????????????????????????????????????????????????????3??????
            if (this.length < 3)
                return false;
            if (this.length == 3)
                return true;
            for (var i = 0; i < this.length; ++i) {
                var next = i + 1 < this.length ? i + 1 : 0;
                var edge = this[next].sub(this[i]);
                for (var j = 0; j < this.length; ++j) {
                    if (j == i || j == next)
                        continue;
                    var r = this[j].sub(this[i]);
                    var s = edge.x * r.y - edge.y * r.x;
                    if (s <= 0)
                        return false;
                }
            }
            return true;
        };
        /**
         * ???????????????????????????????????????????????????????????????????????????0???????????????????????????
         * @returns
         */
        Vertices.prototype.isCounterClockWise = function () {
            if (this.length < 3)
                return false;
            return this.getSignedArea() > 0;
        };
        /**
         * ????????????????????????????????????
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
     * Giftwrap??????????????? O???nh???????????????????????????n????????????h????????????????????????
     * ???Box2D?????????
     */
    var GiftWrap = /** @class */ (function () {
        function GiftWrap() {
        }
        /**
         * ??????????????????????????????
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
                    var r = vertices[ie].sub(vertices[hull[m]]);
                    var v = vertices[j].sub(vertices[hull[m]]);
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
     * ?????????????????????????????????????????????????????????
     */
    var FilterData = /** @class */ (function () {
        function FilterData() {
            /**
             * ??????????????????????????????????????????????????????
             */
            this.disabledOnCategories = physics.Category.none;
            /**
             * ?????????????????????????????????Category.All????????????
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
         * ?????????????????? ???????????????????????????
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
         * ?????????????????? ???????????????????????????
         * @param controller
         */
        ControllerFilter.prototype.ignoreController = function (controller) {
            this.controllerFlags |= controller;
        };
        /**
         * ?????????????????? ???????????????????????????
         * @param controller
         */
        ControllerFilter.prototype.restoreController = function (controller) {
            this.controllerFlags &= ~controller;
        };
        /**
         * ?????????????????????????????????????????????
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
     * Body??????
     */
    var BodyType;
    (function (BodyType) {
        /**
         * ????????????????????????????????? ??????????????????????????????????????????
         */
        BodyType[BodyType["static"] = 0] = "static";
        /**
         * ????????????????????????????????????????????????????????????
         */
        BodyType[BodyType["kinematic"] = 1] = "kinematic";
        /**
         * ????????????????????????????????????????????????????????????
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
            this.world.addBody(this);
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
             * ???????????????????????????
             */
            get: function () {
                return this.rotation / Math.PI;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "bodyType", {
            /**
             * ??????????????????????????????
             * ??????????????????????????????????????????????????????
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
             * ?????????????????????????????????
             */
            get: function () {
                return this._linearVelocity;
            },
            /**
             * ?????????????????????????????????
             */
            set: function (value) {
                console.assert(!Number.isNaN(value.x) && !Number.isNaN(value.y));
                if (this._bodyType == BodyType.static)
                    return;
                if (value.dot(value) > 0)
                    this.isAwake = true;
                this._linearVelocity = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "angularVelocity", {
            /**
             * ??????????????????????????? ??????/???
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
             * ???????????????????????????
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
             * ???????????????????????????
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
             * ??????????????????????????????????????? ???????????????????????????????????????
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
             * ?????????????????????????????? ?????????????????????????????????CPU??????
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
             * ?????????????????????????????? ????????????????????????????????????????????????????????????????????????
             * ????????????true??????????????????fixtures??????????????????????????????
             * ????????????????????????????????????????????????????????????Fixture???????????????????????????
             * Fixture????????????????????????
             * ?????????????????????????????????????????????/??????Fixture????????????
             * ?????????????????????????????????fixtures???????????????????????????????????????????????????????????????????????????????????????
             * ????????????????????????????????????????????????????????????????????????????????????
             * ????????????????????????b2World?????????????????????????????????????????????
             */
            set: function (value) {
                if (value == this._enabled)
                    return;
                if (value) {
                    var broadPhase = this._world.contactManager.broadPhase;
                    for (var i = 0; i < this.fixtureList.length; i++)
                        this.fixtureList[i].createProxies(broadPhase, this._xf);
                }
                else {
                    var broadPhase = this._world.contactManager.broadPhase;
                    for (var i = 0; i < this.fixtureList.length; i++)
                        this.fixtureList[i].destroyProxies(broadPhase);
                    var ce = this.contactList;
                    while (ce != null) {
                        var ce0 = ce;
                        ce = ce.next;
                        this._world.contactManager.destroy(ce0.contact);
                    }
                    this.contactList = null;
                }
                this._enabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "fixedRotation", {
            get: function () {
                return this._fixedRotation;
            },
            /**
             * ???????????????????????????????????? ????????????????????????
             */
            set: function (value) {
                if (this._fixedRotation == value)
                    return;
                this._fixedRotation = value;
                this._angularVelocity = 0;
                this.resetMassData();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "position", {
            /**
             * ????????????????????????
             */
            get: function () {
                return this._xf.p;
            },
            set: function (value) {
                console.assert(!Number.isNaN(value.x) && !Number.isNaN(value.y));
                this.setTransform(value, this.rotation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "displayPosition", {
            /**
             * ?????????????????????/????????????????????????
             */
            get: function () {
                return this._xf.p.scale(physics.FSConvert.simToDisplay);
            },
            set: function (value) {
                this.position = value.scale(physics.FSConvert.displayToSim);
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
                this.setTransform(this._xf.p, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "isStatic", {
            /**
             * ???????????????????????????????????????????????????????????????
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
             * ????????????????????????????????????????????????????????????
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
             * ??????????????????????????????????????????????????????????????????
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
            /** ??????????????????????????? */
            get: function () {
                return this._sweep.c;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "localCenter", {
            /**
             * ???????????????????????????
             */
            get: function () {
                return this._sweep.localCenter;
            },
            set: function (value) {
                if (this._bodyType != BodyType.dynamic)
                    return;
                var oldCenter = this._sweep.c.clone();
                this._sweep.localCenter = value;
                this._sweep.c0 = this._sweep.c = physics.MathUtils.mul(this._xf, this._sweep.localCenter);
                var a = this._sweep.c.sub(oldCenter);
                this._linearVelocity.add(new es.Vector2(-this._angularVelocity * a.y, this._angularVelocity * a.x));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Body.prototype, "mass", {
            /**
             * ???????????????????????? ??????????????????kg????????????
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
             * ?????????????????????????????????????????????????????? ?????????kg-m ^ 2?????????
             */
            get: function () {
                return this._inertia + this.mass * this._sweep.localCenter.dot(this._sweep.localCenter);
            },
            set: function (value) {
                console.assert(!Number.isNaN(value));
                if (this._bodyType != BodyType.dynamic)
                    return;
                if (value > 0 && !this._fixedRotation) {
                    this._inertia = value - this.mass * this.localCenter.dot(this.localCenter);
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
             * 2??2?????????
             * ??????????????????????????????
             * ????????????????????????????????????CCD?????????????????????
             * ??????????????????????????????????????????CCD?????????????????????????????????????????????????????????????????????
             * ?????????World.SolveTOI????????????Body?????????CollisionCategories???????????????
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
         * ?????????????????????fixture??????onCollision??????
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
         * ?????????????????????fixture??????onSeparation??????
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
        Body.prototype.resetDynamics = function () {
            this._torque = 0;
            this._angularVelocity = 0;
            this._force = es.Vector2.zero;
            this._linearVelocity = es.Vector2.zero;
        };
        Body.prototype.createFixture = function (shape, userData) {
            if (userData === void 0) { userData = null; }
            return new physics.Fixture(this, shape, userData);
        };
        Body.prototype.destroyFixture = function (fixture) {
            console.assert(fixture.body == this);
            console.assert(this.fixtureList.length > 0);
            console.assert(new es.List(this.fixtureList).contains(fixture));
            var edge = this.contactList;
            while (edge != null) {
                var c = edge.contact;
                edge = edge.next;
                var fixtureA = c.fixtureA;
                var fixtureB = c.fixtureB;
                if (fixture == fixtureA || fixture == fixtureB) {
                    this._world.contactManager.destroy(c);
                }
            }
            if (this._enabled) {
                var broadPhase = this._world.contactManager.broadPhase;
                fixture.destroyProxies(broadPhase);
            }
            new es.List(this.fixtureList).remove(fixture);
            fixture.destroy();
            fixture.body = null;
            this.resetMassData();
        };
        Body.prototype.setTransform = function (position, rotation) {
            this.setTransformIgnoreContacts(position, rotation);
            this._world.contactManager.findNewContacts();
        };
        Body.prototype.setTransformIgnoreContacts = function (position, angle) {
            this._xf.q.set(angle);
            this._xf.p = position;
            this._sweep.c = physics.MathUtils.mul(this._xf, this._sweep.localCenter);
            this._sweep.a = angle;
            this._sweep.c0 = this._sweep.c;
            this._sweep.a0 = angle;
            var broadPhase = this._world.contactManager.broadPhase;
            for (var i = 0; i < this.fixtureList.length; i++)
                this.fixtureList[i].synchronize(broadPhase, this._xf, this._xf);
        };
        Body.prototype.resetMassData = function () {
            this._mass = 0;
            this._invMass = 0;
            this._inertia = 0;
            this._invI = 0;
            this._sweep.localCenter = es.Vector2.zero;
            if (this.bodyType == BodyType.kinematic) {
                this._sweep.c0 = this._xf.p;
                this._sweep.c = this._xf.p;
                this._sweep.a0 = this._sweep.a;
                return;
            }
            console.assert(this.bodyType == BodyType.dynamic || this.bodyType == BodyType.static);
            var localCenter = es.Vector2.zero;
            for (var i = 0; i < this.fixtureList.length; i++) {
                var f = this.fixtureList[i];
                if (f.shape._density == 0)
                    continue;
                var massData = f.shape.massData;
                this._mass += massData.mass;
                this.localCenter = this.localCenter.add(massData.centroid.scale(massData.mass));
                this._inertia += massData.inertia;
            }
            if (this.bodyType == BodyType.static) {
                this._sweep.c0 = this._sweep.c = this._xf.p;
                return;
            }
            if (this._mass > 0) {
                this._invMass = 1 / this._mass;
                localCenter = localCenter.scale(this._invMass);
            }
            else {
                this._mass = 1;
                this._invMass = 1;
            }
            if (this._invMass > 0 && !this._fixedRotation) {
                this._inertia -= this._mass * localCenter.dot(localCenter);
                console.assert(this._inertia > 0);
                this._invI = 1 / this._inertia;
            }
            else {
                this._inertia = 0;
                this._invI = 0;
            }
            var oldCenter = this._sweep.c;
            this._sweep.localCenter = localCenter;
            this._sweep.c0 = this._sweep.c = physics.MathUtils.mul(this._xf, this._sweep.localCenter);
            var a = this._sweep.c.sub(oldCenter);
            this._linearVelocity = this._linearVelocity.add(new es.Vector2(-this._angularVelocity * a.y, this._angularVelocity * a.x));
        };
        Body.prototype.shouldCollide = function (other) {
            if (this._bodyType != BodyType.dynamic && other._bodyType != BodyType.dynamic)
                return false;
            for (var jn = this.jointList; jn != null; jn = jn.next) {
                if (jn.other == other) {
                    if (jn.joint.collideConnected == false)
                        return false;
                }
            }
            return true;
        };
        return Body;
    }());
    physics.Body = Body;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * ??????????????????????????????Fixture?????????
     */
    var BreakableBody = /** @class */ (function () {
        function BreakableBody(world, vertices, density, position, rotation) {
            if (position === void 0) { position = new es.Vector2(); }
            if (rotation === void 0) { rotation = 0; }
            this.parts = [];
            /**
             * ???????????????????????????????????????500
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
                        maxImpulse = Math.max(maxImpulse, impulse.points[i].normalImpulse);
                    }
                    if (maxImpulse > this.strength) {
                        this._break = true;
                    }
                }
            }
        };
        BreakableBody.prototype.update = function () {
            if (this._break) {
                this.decompose();
                this.isBroken = true;
                this._break = false;
            }
            if (this.isBroken == false) {
                if (this.parts.length > this._angularVelocitiesCache.length) {
                    this._velocitiesCache = [];
                    this._angularVelocitiesCache = [];
                }
                for (var i = 0; i < this.parts.length; i++) {
                    this._velocitiesCache[i] = this.parts[i].body.linearVelocity;
                    this._angularVelocitiesCache[i] = this.parts[i].body.angularVelocity;
                }
            }
        };
        BreakableBody.prototype.decompose = function () {
            new es.List(this._world.contactManager.onPostSolve).remove(this.onPostSolve);
            for (var i = 0; i < this.parts.length; i++) {
                var oldFixture = this.parts[i];
                var shape = oldFixture.shape.clone();
                var userData = oldFixture.userData;
                this.mainBody.destroyFixture(oldFixture);
                var body = physics.BodyFactory.createBody(this._world, this.mainBody.position, this.mainBody.rotation, physics.BodyType.dynamic, this.mainBody.userData);
                var newFixture = body.createFixture(shape);
                newFixture.userData = userData;
                this.parts[i] = newFixture;
                body.angularVelocity = this._angularVelocitiesCache[i];
                body.linearVelocity = this._velocitiesCache[i];
            }
            this._world.removeBody(this.mainBody);
            this._world.removeBreakableBody(this);
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
             * ????????????????????????????????????????????????????????????????????????????????????????????????/???????????????
             * ???????????????????????????????????????
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
        ContactManager.prototype.findNewContacts = function () {
            // this.broadPhase.
            // TODO: updatePairs
        };
        ContactManager.prototype.destroy = function (contact) {
            var fixtureA = contact.fixtureA;
            var fixtureB = contact.fixtureB;
            var bodyA = fixtureA.body;
            var bodyB = fixtureB.body;
            if (contact.isTouching) {
                if (fixtureA != null && fixtureA.onSeperation != null) {
                    fixtureA.onSeperation.forEach(function (func) { return func(fixtureA, fixtureB); });
                }
                if (fixtureB != null && fixtureB.onSeperation != null)
                    fixtureB.onSeperation.forEach(function (func) { return func(fixtureB, fixtureA); });
                if (this.onEndContact != null)
                    this.onEndContact.forEach(function (func) { return func(contact); });
            }
            new es.List(this.contactList).remove(contact);
            if (contact._nodeA.prev != null)
                contact._nodeA.prev.next = contact._nodeA.next;
            if (contact._nodeA.next != null)
                contact._nodeA.next.prev = contact._nodeA.prev;
            if (contact._nodeA == bodyA.contactList)
                bodyA.contactList = contact._nodeA.next;
            if (contact._nodeB.prev != null)
                contact._nodeB.prev.next = contact._nodeB.next;
            if (contact._nodeB.next != null)
                contact._nodeB.next.prev = contact._nodeB.prev;
            if (contact._nodeB == bodyB.contactList)
                bodyB.contactList = contact._nodeB.next;
            if (this.activeContacts.has(contact)) {
                this.activeContacts.delete(contact);
            }
            contact.destroy();
        };
        ContactManager.prototype.collide = function () {
            var list = [];
            if (physics.Defined.USE_ACTIVE_CONTACT_SET) {
                this.activeList.concat(Array.from(this.activeContacts));
                list = this.activeList;
            }
            else {
                list = this.contactList;
            }
            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                var fixtureA = c.fixtureA;
                var fixtureB = c.fixtureB;
                var indexA = c.childIndexA;
                var indexB = c.childIndexB;
                var bodyA = fixtureA.body;
                var bodyB = fixtureB.body;
                if (!bodyA.enabled || !bodyB.enabled) {
                    continue;
                }
                if (c.filterFlag) {
                    if (bodyB.shouldCollide(bodyA) == false) {
                        var cNuke = c;
                        this.destroy(cNuke);
                        continue;
                    }
                    if (ContactManager.shouldCollide(fixtureA, fixtureB) == false) {
                        var cNuke = c;
                        this.destroy(cNuke);
                        continue;
                    }
                    if (this.onContactFilter != null && this.onContactFilter(fixtureA, fixtureB) == false) {
                        var cNuke = c;
                        this.destroy(cNuke);
                        continue;
                    }
                    c.filterFlag = false;
                }
                var activeA = bodyA.isAwake && bodyA.bodyType != physics.BodyType.static;
                var activeB = bodyB.isAwake && bodyB.bodyType != physics.BodyType.static;
                if (activeA == false && activeB == false) {
                    if (physics.Defined.USE_ACTIVE_CONTACT_SET) {
                        this.activeContacts.delete(c);
                    }
                    continue;
                }
                var proxyIdA = fixtureA.proxies[indexA].proxyId;
                var proxyIdB = fixtureB.proxies[indexB].proxyId;
                var overlap = this.broadPhase.testOverlap(proxyIdA, proxyIdB);
                if (overlap == false) {
                    var cNuke = c;
                    this.destroy(cNuke);
                    continue;
                }
                c.update(this);
            }
        };
        ContactManager.shouldCollide = function (fixtrueA, fixtureB) {
            if (physics.Settings.useFPECollisionCategories) {
                if ((fixtrueA.collisionGroup == fixtureB.collisionGroup) && fixtrueA.collisionGroup != 0 &&
                    fixtureB.collisionGroup != 0)
                    return false;
                if (Number(((fixtrueA.collisionCategories & fixtureB.collidesWith) == physics.Category.none)) &
                    Number(((fixtureB.collisionCategories & fixtrueA.collidesWith) == physics.Category.none)))
                    return false;
                if (fixtrueA.isFixtureIgnored(fixtureB) || fixtureB.isFixtureIgnored(fixtrueA))
                    return false;
                return true;
            }
            if (fixtrueA.collisionGroup == fixtureB.collisionGroup && fixtrueA.collisionGroup != 0)
                return fixtrueA.collisionGroup > 0;
            var collide = (fixtrueA.collidesWith & fixtureB.collisionCategories) != 0 &&
                (fixtrueA.collisionCategories & fixtureB.collidesWith) != 0;
            if (collide) {
                if (fixtrueA.isFixtureIgnored(fixtureB) || fixtureB.isFixtureIgnored(fixtrueA))
                    return false;
            }
            return collide;
        };
        return ContactManager;
    }());
    physics.ContactManager = ContactManager;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * ?????????????????????
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
    var TimeStep = /** @class */ (function () {
        function TimeStep() {
        }
        return TimeStep;
    }());
    physics.TimeStep = TimeStep;
    var Position = /** @class */ (function () {
        function Position() {
        }
        return Position;
    }());
    physics.Position = Position;
    var Velocity = /** @class */ (function () {
        function Velocity() {
        }
        return Velocity;
    }());
    physics.Velocity = Velocity;
    var SolverData = /** @class */ (function () {
        function SolverData() {
        }
        return SolverData;
    }());
    physics.SolverData = SolverData;
})(physics || (physics = {}));
var physics;
(function (physics) {
    /**
     * ?????????????????????????????????????????????????????????
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
            this._queryAABBCallbackWrpper = this.queryAABBCallbackWrapper;
            this._rayCastCallbackWrapper = this.raycastCallbackWrapper;
            this.gravity = gravity;
        }
        Object.defineProperty(World.prototype, "proxyCount", {
            /**
             * ???????????????????????????
             */
            get: function () {
                return this.contactManager.broadPhase.proxyCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "contactList", {
            /**
             * ????????????contact?????????
             * ???????????????contact????????????Contact.GetNext?????????????????????????????????contact???
             * ???contact????????????????????????
             */
            get: function () {
                return this.contactManager.contactList;
            },
            enumerable: true,
            configurable: true
        });
        World.prototype.processChanges = function () {
        };
        World.prototype.addBody = function (body) {
            console.assert(!this._bodyAddList.has(body), "You are adding the same body more than once.");
            if (!this._bodyAddList.has(body))
                this._bodyAddList.add(body);
        };
        World.prototype.removeBody = function (body) {
            console.assert(!this._bodyRemoveList.has(body), "The body is already marked for removal. You are removing the body more than once.");
            if (!this._bodyRemoveList.has(body))
                this._bodyRemoveList.add(body);
            if (this.awakeBodySet.has(body))
                this.awakeBodySet.delete(body);
        };
        World.prototype.addBreakableBody = function (breakableBody) {
            this.breakableBodyList.push(breakableBody);
        };
        World.prototype.removeBreakableBody = function (breakableBody) {
            console.assert(this.breakableBodyList.indexOf(breakableBody) != -1);
            this.breakableBodyList.splice(this.breakableBodyList.indexOf(breakableBody), 1);
        };
        World.prototype.queryAABBCallbackWrapper = function (proxyId) {
            var proxy = this.contactManager.broadPhase.getProxy(proxyId);
            return this._queryAABBCallback(proxy.fixture);
        };
        World.prototype.raycastCallbackWrapper = function (rayCastInput, proxyId) {
            var proxy = this.contactManager.broadPhase.getProxy(proxyId);
            var fixture = proxy.fixture;
            var index = proxy.childIndex;
            var output;
            var hit = fixture.rayCast(output, rayCastInput, index);
            if (hit) {
                var fraction = output.fraction;
                var point = rayCastInput.point1.scale(1 - fraction).add(rayCastInput.point2.scale(fraction));
                return this._rayCastCallback(fixture, point, output.normal, fraction);
            }
            return rayCastInput.maxFraction;
        };
        World.prototype.step = function (dt) {
            if (!this.enabled)
                return;
            if (physics.Settings.enableDiagnostics)
                this._watch.start();
            this.processChanges();
            if (physics.Settings.enableDiagnostics)
                this.addRemoveTime = this._watch.getTime();
            if (this._worldHasNewFixture) {
                this.contactManager.findNewContacts();
                this._worldHasNewFixture = false;
            }
            if (physics.Settings.enableDiagnostics)
                this.newContactsTime = this._watch.getTime() - this.addRemoveTime;
            var step = new physics.TimeStep();
            step.inv_dt = dt > 0 ? 1 / dt : 0;
            step.dt = dt;
            step.dtRatio = this._invDt0 * dt;
            for (var i = 0; i < this.controllerList.length; i++)
                this.controllerList[i].update(dt);
            if (physics.Settings.enableDiagnostics)
                this.controllersUpdateTime = this._watch.getTime() - (this.addRemoveTime + this.newContactsTime);
            this.contactManager.collide();
            if (physics.Settings.enableDiagnostics)
                this.ContactsUpdateTime = this._watch.getTime() - (this.addRemoveTime + this.newContactsTime + this.controllersUpdateTime);
            // TODO: solve
        };
        World.prototype.clear = function () {
            this.processChanges();
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
     * ??????????????????????????????????????????
     * ????????????????????????AABB?????????????????????????????????????????????
     * ???????????????????????????????????????????????????
     */
    var Contact = /** @class */ (function () {
        function Contact(fA, indexA, fB, indexB) {
            this._nodeA = new ContactEdge();
            this._nodeB = new ContactEdge();
            // reset
        }
        Contact.prototype.resetRestitution = function () {
            this.restitution = physics.Settings.mixRestitution(this.fixtureA.restitution, this.fixtureB.restitution);
        };
        Contact.prototype.resetFriction = function () {
            this.friction = physics.Settings.mixFriction(this.fixtureA.friction, this.fixtureB.friction);
        };
        Contact.prototype.getWorldManifold = function (normal, points) {
            var bodyA = this.fixtureA.body;
            var bodyB = this.fixtureA.body;
            var shapeA = this.fixtureA.shape;
            var shapeB = this.fixtureB.shape;
            // TODO; worldManifold.initialize
        };
        Contact.prototype.reset = function (fA, indexA, fB, indexB) {
            this.enabled = true;
            this.isTouching = false;
            this.islandFlag = false;
            this.filterFlag = false;
            this.toiFlag = false;
            this.fixtureA = fA;
            this.fixtureB = fB;
            this.childIndexA = indexA;
            this.childIndexB = indexB;
            this.manifold.pointCount = 0;
            this._nodeA.contact = null;
            this._nodeA.prev = null;
            this._nodeA.next = null;
            this._nodeA.other = null;
            this._nodeB.contact = null;
            this._nodeB.prev = null;
            this._nodeB.next = null;
            this._nodeB.other = null;
            this._toiCount = 0;
            if (this.fixtureA != null && this.fixtureB != null) {
                this.friction = physics.Settings.mixFriction(this.fixtureA.friction, this.fixtureB.friction);
                this.restitution = physics.Settings.mixRestitution(this.fixtureA.restitution, this.fixtureB.restitution);
            }
            this.tangentSpeed = 0;
        };
        Contact.prototype.update = function (contactManager) {
            var bodyA = this.fixtureA.body;
            var bodyB = this.fixtureB.body;
            if (this.fixtureA == null || this.fixtureB == null)
                return;
            var oldManifold = this.manifold;
            this.enabled = true;
            var touching = false;
            var wasTouching = this.isTouching;
            var sensor = this.fixtureA.isSensor || this.fixtureB.isSensor;
            if (sensor) {
                var shapeA = this.fixtureA.shape;
                var shapeB = this.fixtureB.shape;
                touching = physics.Collision.testOverlap(shapeA, this.childIndexA, shapeB, this.childIndexB, bodyA._xf, bodyB._xf);
                this.manifold.pointCount = 0;
            }
            else {
                // TODO: evluate
            }
        };
        Contact.prototype.destroy = function () {
            // TODO: use_active_contact_set
            this.fixtureA.body._world._contactPool.unshift(this);
            if (this.manifold.pointCount > 0 && this.fixtureA.isSensor == false && this.fixtureB.isSensor == false) {
                this.fixtureA.body.isAwake = true;
                this.fixtureB.body.isAwake = true;
            }
            // TODO: reset
        };
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
     * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     * ????????????????????????????????????????????????????????????
     * ???????????????????????????????????????????????????????????????
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
    var ContactSolver = /** @class */ (function () {
        function ContactSolver() {
        }
        ContactSolver.prototype.reset = function (step, count, contacts, positions, velocities) {
            this._step = step;
            this._count = count;
            this._positions = positions;
            this._velocities = velocities;
            this._contacts = contacts;
            // TODO: grow the array
        };
        return ContactSolver;
    }());
    physics.ContactSolver = ContactSolver;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var BodyFactory = /** @class */ (function () {
        function BodyFactory() {
        }
        BodyFactory.createBody = function (world, position, rotation, bodyType, userData) {
            if (position === void 0) { position = new es.Vector2(); }
            if (rotation === void 0) { rotation = 0; }
            if (bodyType === void 0) { bodyType = physics.BodyType.static; }
            if (userData === void 0) { userData = null; }
            return new physics.Body(world, position, rotation, bodyType, userData);
        };
        return BodyFactory;
    }());
    physics.BodyFactory = BodyFactory;
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
     * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     * ????????????????????????????????????????????????????????????
     * ??????????????????????????????????????????????????????????????????
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
             * ????????????????????????????????? ???????????????????????????????????????????????????????????????
             */
            this.enabled = true;
            this.edgeA = new JointEdge();
            this.edgeB = new JointEdge();
            if (bodyA && bodyB) {
                // ??????????????????????????????????????????
                console.assert(bodyA != bodyB);
                this.bodyA = bodyA;
                this.bodyB = bodyB;
            }
            else if (bodyA) {
                this.bodyA = bodyA;
            }
            this.breakpoint = Number.MAX_VALUE;
            // ????????????????????????????????????????????? 
            this.collideConnected = false;
        }
        Object.defineProperty(Joint.prototype, "breakpoint", {
            /**
             * ??????????????????JointError??????????????????????????????????????????
             * ????????????Number.MaxValue??????????????????????????????
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
var physics;
(function (physics) {
    var FSWorld = /** @class */ (function (_super) {
        __extends(FSWorld, _super);
        function FSWorld(gravity) {
            if (gravity === void 0) { gravity = new es.Vector2(0, 9.82); }
            var _this = _super.call(this) || this;
            _this.world = new physics.World(gravity);
            return _this;
        }
        FSWorld.prototype.onEnabled = function () {
            this.world.enabled = true;
        };
        FSWorld.prototype.onDisabled = function () {
            this.world.enabled = false;
        };
        FSWorld.prototype.onRemovedFromScene = function () {
            this.world.clear();
            this.world = null;
        };
        FSWorld.prototype.update = function () {
            this.world.step(es.Time.deltaTime);
        };
        return FSWorld;
    }(es.SceneComponent));
    physics.FSWorld = FSWorld;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var FSRigidBody = /** @class */ (function (_super) {
        __extends(FSRigidBody, _super);
        function FSRigidBody() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._bodyDef = new physics.FSBodyDef();
            _this._joints = [];
            return _this;
        }
        FSRigidBody.prototype.update = function () {
        };
        return FSRigidBody;
    }(es.Component));
    physics.FSRigidBody = FSRigidBody;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var FSJoint = /** @class */ (function (_super) {
        __extends(FSJoint, _super);
        function FSJoint() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FSJoint;
    }(es.Component));
    physics.FSJoint = FSJoint;
})(physics || (physics = {}));
var physics;
(function (physics) {
    var FSBodyDef = /** @class */ (function () {
        function FSBodyDef() {
            this.bodyType = physics.BodyType.static;
            this.angularVelocity = 0;
            this.linearDamping = 0;
            this.angularDampint = 0;
            this.isSleepingAllowed = true;
            this.isAwake = true;
            this.gravityScale = 1;
            this.mass = 0;
            this.inertia = 0;
        }
        return FSBodyDef;
    }());
    physics.FSBodyDef = FSBodyDef;
})(physics || (physics = {}));
