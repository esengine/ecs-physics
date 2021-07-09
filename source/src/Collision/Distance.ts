module physics {
    /**
     * GJK算法使用距离代理。 它封装了任何形状。
     */
    export class DistanceProxy {
        public radius: number;
        public vertices: Vertices = new Vertices();

        public set(shape: Shape, index: number) {
            switch (shape.shapeType) {
                case ShapeType.circle: {
                    let circle = <CircleShape>shape;
                    this.vertices.length = 0;
                    this.vertices.push(circle.position);
                    this.radius = circle.radius;
                }
                    break;

                case ShapeType.polygon: {
                    let polygon = <PolygonShape>shape;
                    this.vertices.length = 0;
                    for (let i = 0; i < polygon.vertices.length; i++) {
                        this.vertices.push(polygon.vertices[i]);
                    }

                    this.radius = polygon.radius;
                }

                    break;

                case ShapeType.chain: {
                    let chain = <ChainShape>shape;
                    console.assert(0 <= index && index < chain.vertices.length);
                    this.vertices.length = 0;
                    this.vertices.push(chain.vertices[index]);
                    this.vertices.push(index + 1 < chain.vertices.length ? chain.vertices[index + 1] : chain.vertices[0]);

                    this.radius = chain.radius;
                }

                    break;

                case ShapeType.edge: {
                    let edge = <EdgeShape>shape;
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
        }
    }

    class SimplexVertex {
        public a: number = 0;
        public indexA: number = 0;
        public indexB: number = 0;
        public w: es.Vector2 = es.Vector2.zero;
        public wA: es.Vector2 = es.Vector2.zero;
        public wB: es.Vector2 = es.Vector2.zero;
    }

    class Simplex {
        public count: number = 0;
        public v: FixedArray3<SimplexVertex>;

        public readCache(cache: SimplexCache, proxyA: DistanceProxy, transformA: Transform,
            proxyB: DistanceProxy, transformB: Transform) {
            console.assert(cache.count <= 3);

            this.count = cache.count;
            for (let i = 0; i < this.count; ++i) {
                const v = this.v.get(i);
                v.indexA = cache.indexA[i];
                v.indexB = cache.indexB[i];
                const wALocal = proxyA.vertices[v.indexA];
                const wBLocal = proxyB.vertices[v.indexB];
                v.wA = MathUtils.mul(transformA, wALocal);
                v.wB = MathUtils.mul(transformB, wBLocal);
                v.w = v.wB.sub(v.wA);
                v.a = 0;
                this.v[i] = v;
            }

            if (this.count > 1) {
                const metric1 = cache.metric;
                const metric2 = this.getMetric();
                if (metric2 < 0.5 * metric1 || 2 * metric1 < metric2 || metric2 < Settings.epsilon) {
                    this.count = 0;
                }
            }

            if (this.count == 0) {
                const v = this.v.get(0);
                v.indexA = 0;
                v.indexB = 0;
                const wALocal = proxyA.vertices[0];
                const wBLocal = proxyB.vertices[0];
                v.wA = MathUtils.mul(transformA, wALocal);
                v.wB = MathUtils.mul(transformB, wBLocal);
                v.w = v.wB.sub(v.wA);
                v.a = 1;
                this.v.set(0, v);
                this.count = 1;
            }
        }

        public getMetric() {
            switch( this.count) {
                case 0:
                    console.assert(false);
                    return 0;
                case 1:
                    return 0;
                case 2:
                    return (this.v.get(0).w.sub(this.v.get(1).w)).magnitude();
                case 3:
                    return MathUtils.cross(this.v.get(1).w.sub(this.v.get(0).w), this.v.get(2).w.sub(this.v.get(0).w));
                default:
                    console.assert(false);
                    return 0;
            }
        }
    }

    export class Distance {
        public static gjkCalls: number;
        public static gjkIters: number;
        public static gjkMaxIters: number;

        public static computeDistance(output: DistanceOutput, input: DistanceInput) {
            const cache = new SimplexCache();

            if (Settings.enableDiagnostics)
                ++this.gjkCalls;

            const simplex = new Simplex();
            simplex.readCache(cache, input.proxyA, input.transformA, input.proxyB, input.transformB);

            const saveA = new FixedArray3();
            const saveB = new FixedArray3();

            let iter = 0;
            while (iter < Settings.maxGJKIterations) {
                const saveCount = simplex.count;
                for (let i = 0; i < saveCount; ++ i) {
                    saveA.set(i, simplex.v.get(i).indexA);
                    saveB.set(i, simplex.v.get(i).indexB);
                }

                switch (simplex.count) {
                    case 1:
                        break;
                    case 2:
                        // TODO: solve
                        break;
                    case 3:
                        // TODO: solve
                        break;
                    default:
                        console.assert(false);
                        break;
                }

                if (simplex.count == 3)
                    break;

                
            }

            return cache;
        }
    }

    export class DistanceInput {
        public proxyA: DistanceProxy = new DistanceProxy();
        public proxyB: DistanceProxy = new DistanceProxy();
        public transformA: Transform;
        public transformB: Transform;
        public useRadii: boolean;
    }

    export class DistanceOutput {
        public distance: number;
        public iterations: number;
        public pointA: es.Vector2;
        public pointB: es.Vector2;
    }

    export class SimplexCache {
        public count: number;
        public indexA: FixedArray3<number>;
        public indexB: FixedArray3<number>;
        public metric: number;
    }
}