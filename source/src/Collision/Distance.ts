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

        public getSupport(direction: es.Vector2) {
            let bestIndex = 0;
            let bestValue = this.vertices[0].dot(direction);
            for (let i = 1; i < this.vertices.length; ++ i) {
                const value = this.vertices[i].dot(direction);
                if (value > bestValue) {
                    bestIndex = i;
                    bestValue = value;
                }
            }

            return bestIndex;
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

        public writeCache(cache: SimplexCache) {
            cache.metric = this.getMetric();
            cache.count = this.count;
            for (let i = 0; i < this.count; ++ i) {
                cache.indexA.set(i, this.v.get(i).indexA);
                cache.indexB.set(i, this.v.get(i).indexB);
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

        public solve2() {
            const w1 = this.v.get(0).w;
            const w2 = this.v.get(1).w;
            const e12 = w2.sub(w1);

            const d12_2 = -w1.dot(e12);
            if (d12_2 <= 0) {
                const v0 = this.v.get(0);
                v0.a = 1;
                this.v.set(0, v0);
                this.count = 1;
                return;
            }

            const d12_1 = w2.dot(e12);
            if (d12_1 <= 0) {
                const v1 = this.v.get(1);
                v1.a = 1;
                this.v.set(1, v1);
                this.count = 1;
                this.v.set(0, this.v.get(1));
                return;
            }

            const inv_d12 = 1 / (d12_1 + d12_2);
            const v0_2 = this.v.get(0);
            const v1_2 = this.v.get(1);
            v0_2.a = d12_1 * inv_d12;
            v1_2.a = d12_2 * inv_d12;
            this.v.set(0, v0_2);
            this.v.set(1, v1_2);
            this.count = 2;
        }

        public solve3() {
            const w1 = this.v.get(0).w;
            const w2 = this.v.get(1).w;
            const w3 = this.v.get(2).w;

            const e12 = w2.sub(w1);
            const w1e12 = w1.dot(e12);
            const w2e12 = w2.dot(e12);
            const d12_1 = w2e12;
            const d12_2 = -w1e12;

            const e13 = w3.sub(w1);
            const w1e13 = w1.dot(e13);
            const w3e13 = w3.dot(e13);
            const d13_1 = w3e13;
            const d13_2 = -w1e13;

            const e23 = w3.sub(w2);
            const w2e23 = w2.dot(e23);
            const w3e23 = w3.dot(e23);
            const d23_1 = w3e23;
            const d23_2 = -w2e23;

            const n123 = MathUtils.cross(e12, e13);

            const d123_1 = n123 * MathUtils.cross(w2, w3);
            const d123_2 = n123 * MathUtils.cross(w3, w1);
            const d123_3 = n123 * MathUtils.cross(w1, w2);

            if (d12_2 <= 0 && d13_2 <= 0) {
                const v0_1 = this.v.get(0);
                v0_1.a = 1;
                this.v.set(0, v0_1);
                this.count = 1;
                return;
            }

            if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
                const inv_d12 = 1 / (d12_1 + d12_2);
                const v0_2 = this.v.get(0);
                const v1_2 = this.v.get(1);
                v0_2.a = d12_1 * inv_d12;
                v1_2.a = d12_2 * inv_d12;
                this.v.set(0, v0_2);
                this.v.set(1, v1_2);
                this.count = 2;
                return;
            }

            if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
                const inv_d13 = 1 / (d13_1 + d13_2);
                const v0_3 = this.v.get(0);
                const v2_3 = this.v.get(2);
                v0_3.a = d13_1 * inv_d13;
                v2_3.a = d13_2 * inv_d13;
                this.v.set(0, v0_3);
                this.v.set(2, v2_3);
                this.count = 2;
                this.v.set(1, this.v.get(2));
                return;
            }

            if (d12_1 <= 0 && d23_2 <= 0) {
                const v1_4 = this.v.get(1);
                v1_4.a = 1;
                this.v.set(1, v1_4);
                this.count = 1;
                this.v.set(0, this.v.get(1));
                return;
            }

            if (d13_1 <= 0 && d23_1 <= 0) {
                const v2_5 = this.v.get(2);
                v2_5.a = 1;
                this.v.set(2, v2_5);
                this.count = 1;
                this.v.set(0, this.v.get(2));
                return;
            }

            if (d23_1 > 0 && d23_2 > 0 && d123_1 <= 0) {
                const inv_d23 = 1 / (d23_1 + d23_2);
                const v1_6 = this.v.get(1);
                const v2_6 = this.v.get(2);
                v1_6.a = d23_1 * inv_d23;
                v2_6.a = d23_2 * inv_d23;
                this.v.set(1, v1_6);
                this.v.set(2, v2_6);
                this.count = 2;
                this.v.set(0, this.v.get(2));
                return;
            }

            const inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
            const v0_7 = this.v.get(0);
            const v1_7 = this.v.get(1);
            const v2_7 = this.v.get(2);
            v0_7.a = d123_1 * inv_d123;
            v1_7.a = d123_2 * inv_d123;
            v2_7.a = d123_3 * inv_d123;
            this.v.set(0, v0_7);
            this.v.set(1, v1_7);
            this.v.set(2, v2_7);
            this.count = 3;
        }

        public getSearchDirection(): es.Vector2 {
            switch (this.count) {
                case 1:
                    return this.v.get(0).w.scale(-1);
                case 2: {
                    const e12 = this.v.get(1).w.sub(this.v.get(0).w);
                    const sgn = MathUtils.cross(e12, this.v.get(0).w.scale(-1));
                    if (sgn > 0) {
                        return new es.Vector2(-e12.y, e12.x);
                    } else {
                        return new es.Vector2(e12.y, -e12.x);
                    }
                }

                default:
                    console.assert(false);
                    return es.Vector2.zero;
            }
        }

        public getWitnessPoints(pA: es.Vector2, pB: es.Vector2) {
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

                const d = simplex.getSearchDirection();

                if (d.lengthSquared() < Settings.epsilon * Settings.epsilon) {
                    break;
                }

                const vertex = simplex.v.get(simplex.count);
                vertex.indexA = input.proxyA.getSupport(MathUtils.mulT(input.transformA.q, d.scale(-1)));
                vertex.wA = MathUtils.mul(input.transformA, input.proxyA.vertices[vertex.indexA]);

                vertex.indexB = input.proxyB.getSupport(MathUtils.mulT(input.transformB.q, d));
                vertex.wB = MathUtils.mul(input.transformB, input.proxyB.vertices[vertex.indexB]);
                vertex.w = vertex.wB.sub(vertex.wA);
                simplex.v.set(simplex.count, vertex);

                ++ iter;

                if (Settings.enableDiagnostics)
                    ++this.gjkIters;

                let duplicate = false;
                for (let i = 0; i < saveCount; ++ i) {
                    if (vertex.indexA == saveA.get(i) && vertex.indexB == saveB.get(i)) {
                        duplicate = true;
                        break;
                    }
                }

                if (duplicate)
                    break;

                ++ simplex.count;
            }

            if (Settings.enableDiagnostics)
                this.gjkMaxIters = Math.max(this.gjkMaxIters, iter);

            simplex.getWitnessPoints(output.pointA, output.pointB);
            output.distance = (output.pointA.sub(output.pointB)).magnitude();
            output.iterations = iter;

            simplex.writeCache(cache);

            if (input.useRadii) {
                const rA = input.proxyA.radius;
                const rB = input.proxyB.radius;

                if (output.distance > rA + rB && output.distance > Settings.epsilon) {
                    output.distance -= rA + rB;
                    const normal = output.pointB.sub(output.pointA).normalize();
                    output.pointA = output.pointA.add(normal.scale(rA));
                    output.pointB = output.pointB.sub(normal.scale(rB));
                } else {
                    const p = output.pointA.add(output.pointB).scale(0.5);
                    output.pointA = p;
                    output.pointB = p;
                    output.distance = 0;
                }
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