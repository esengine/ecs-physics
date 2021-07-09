module physics {
    export class PolygonShape extends Shape {
        public get vertices() {
            return this._vertices;
        }

        public set vertices(value: Vertices) {
            this.setVerticesNoCopy(new Vertices(value));
        }

        public get normals() {
            return this._normals;
        }

        public get childCount() {
            return 1;    
        }

        _vertices: Vertices;
        _normals: Vertices;

        constructor(vertices?: Vertices, density: number = 0) {
            super(density);

            this.shapeType = ShapeType.polygon;
            this._radius = Settings.polygonRadius;

            if (!vertices)
                this._vertices = new Vertices();
            else
                this._vertices = vertices;
                
            this._normals = new Vertices();
        }

        /**
         * 设置顶点，而无需将数据从顶点复制到本地List
         * @param verts 
         */
        public setVerticesNoCopy(verts: Vertices) {
            console.assert(verts.length >= 3 && verts.length <= Settings.maxPolygonVertices);
            this._vertices = verts;

            if (Settings.useConvexHullPolygons) {
                if (this._vertices.length <= 3)
                    this._vertices.forceCounterClockWise();
                else
                    this._vertices = GiftWrap.getConvexHull(this._vertices);
            }

            if (this._normals == null)
                this._normals = new Vertices();
            else
                this._normals.length = 0;

            for (let i = 0; i < this._vertices.length; ++i) {
                let next = i + 1 < this._vertices.length ? i + 1 : 0;
                let edge = this._vertices[next].sub(this._vertices[i]);
                console.assert(edge.lengthSquared() > Settings.epsilon * Settings.epsilon);

                let temp = new es.Vector2(edge.y, -edge.x);
                es.Vector2Ext.normalize(temp);
                this._normals.push(temp);
            }

            this.computeProperties();
        }

        protected computeProperties() {
            console.assert(this.vertices.length >= 3);

            if (this._density <= 0)
                return;

            let center = es.Vector2.zero;
            let area = 0;
            let I = 0;

            let s = es.Vector2.zero;

            for (let i = 0; i < this.vertices.length; ++i) 
                s.add(this.vertices[i]);

            s.multiplyScaler(1 / this.vertices.length);

            const k_inv3 = 1 / 3;

            for (let i = 0; i < this.vertices.length; ++ i) {
                let e1 = this.vertices[i].sub(s);
                let e2 = i + 1 < this.vertices.length ? this.vertices[i + 1].sub(s) : this.vertices[0].sub(s);
                
                let d = MathUtils.cross(e1, e2);
                let triangleArea = 0.5 * d;
                area += triangleArea;

                center.add(es.Vector2.add(e1, e2).multiplyScaler(triangleArea * k_inv3));

                let ex1 = e1.x, ey1 = e1.y;
                let ex2 = e2.x, ey2 = e2.y;

                let intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
                let inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;

                I += (0.25 * k_inv3 * d) * (intx2 + inty2);
            }

            console.assert(area > Settings.epsilon);

            this.massData.area = area;
            this.massData.mass = this._density * area;
            center.multiplyScaler(1 / area);
            this.massData.centroid = es.Vector2.add(center, s);
            this.massData.inertia = this._density * I;
            this.massData.inertia += this.massData.mass * (this.massData.centroid.dot(this.massData.centroid) - center.dot(center));
        }

        public testPoint(transform: Transform, point: es.Vector2) {
            let pLocal = MathUtils.mul(transform.q, point.sub(transform.p));

            for (let i = 0; i < this.vertices.length; ++ i) {
                let dot = this.normals[i].dot(pLocal.sub(this.vertices[i]));
                if (dot > 0) {
                    return false;
                }
            }

            return true;
        }

        public rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number) {
            let p1 = MathUtils.mul(transform.q, input.point1.sub(transform.p));
            let p2 = MathUtils.mul(transform.q, input.point2.sub(transform.p));
            let d = p2.sub(p1);

            let lower = 0, upper = input.maxFraction;

            let index = -1;

            for (let i = 0; i < this.vertices.length; ++ i) {
                let numerator = this.normals[i].dot(this.vertices[i].sub(p1));
                let denominator = this.normals[i].dot(d);

                if (denominator == 0) {
                    if (numerator < 0) {
                        return false;
                    }
                } else {
                    if (denominator < 0 && numerator < lower * denominator) {
                        lower = numerator / denominator;
                        index = i;
                    }
                    else if(denominator > 0 && numerator < upper *denominator) {
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
                output.normal = MathUtils.mul(transform.q, this.normals[index]);
                return true;
            }

            return false;
        }

        public computeAABB(aabb: AABB,transform: Transform, childIndex: number) {
            let lower = MathUtils.mul(transform, this.vertices[0]);
            let upper = lower.clone();

            for (let i = 1; i < this.vertices.length; ++ i) {
                let v = MathUtils.mul(transform, this.vertices[i]);
                lower = es.Vector2.min(lower, v);
                upper = es.Vector2.max(upper, v);
            }

            let r = new es.Vector2(this.radius, this.radius);
            aabb.lowerBound = lower.sub(r);
            aabb.upperBound = es.Vector2.add(upper, r);
        }

        public computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2) {
            sc.x = 0;
            sc.y = 0;

            let normalL = MathUtils.mul(xf.q, normal);
            let offsetL = offset - normal.dot(xf.p);

            let depths = [];
            let diveCount = 0;
            let intoIndex = -1;
            let outoIndex = -1;

            let lastSubmerged = false;
            let i;
            for (i = 0; i < this.vertices.length; i ++) {
                depths[i] = normalL.dot(this.vertices[i]) - offsetL;
                let isSubmerged = depths[i] < -Settings.epsilon;
                if (i > 0) {
                    if (isSubmerged) {
                        if (!lastSubmerged) {
                            intoIndex = i - 1;
                            diveCount ++;
                        }
                    } else {
                        if (lastSubmerged) {
                            outoIndex = i - 1;
                            diveCount ++;
                        }
                    }
                }

                lastSubmerged = isSubmerged;
            }

            switch (diveCount) {
                case 0:
                    if (lastSubmerged) {
                        sc = MathUtils.mul(xf, this.massData.centroid);
                        return this.massData.mass / this.density;
                    }

                    return 0;
                case 1:
                    if (intoIndex == -1) {
                        intoIndex = this.vertices.length - 1;
                    } else {
                        outoIndex = this.vertices.length - 1;
                    }

                    break;
            }

            let intoIndex2 = (intoIndex + 1) % this.vertices.length;
            let outoIndex2 = (outoIndex + 1) % this.vertices.length;

            let intoLambda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
            let outoLambda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);

            let intoVec = new es.Vector2(this.vertices[intoIndex].x * (1 - intoLambda) + this.vertices[intoIndex2].x * intoLambda,
                this.vertices[intoIndex].y * (1 - intoLambda) + this.vertices[intoIndex2].y * intoLambda);

            let outoVec = new es.Vector2(this.vertices[outoIndex].x * (1 - outoLambda) + this.vertices[outoIndex2].x * outoLambda,
                this.vertices[outoIndex].y * (1 - outoLambda) + this.vertices[outoIndex2].y * outoLambda);

            let area = 0;
            let center = new es.Vector2(0, 0);
            let p2 = this.vertices[intoIndex2];

            const k_inv3 = 1 / 3;

            i = intoIndex2;
            while (i != outoIndex2) {
                i = (i + 1) % this.vertices.length;
                let p3: es.Vector2;
                if (i == outoIndex2)
                    p3 = outoVec;
                else 
                    p3 = this.vertices[i];

                {
                    let e1 = p2.sub(intoVec);
                    let e2 = p3.sub(intoVec);

                    let d = MathUtils.cross(e1, e2);
                    let triangleArea = 0.5 * d;
                    area += triangleArea;

                    center.add(es.Vector2.add(intoVec, p2).add(p3).multiplyScaler(triangleArea * k_inv3));
                }

                p2 = p3.clone();
            }

            center.multiplyScaler(1 / area);
            sc = MathUtils.mul(xf, center);

            return area;
        }

        public clone() {
            let clone = new PolygonShape();
            clone.shapeType = this.shapeType;
            clone._radius = this._radius;
            clone._density = this._density;
            clone._vertices = new Vertices(this._vertices);
            clone._normals = new Vertices(this._normals);
            clone.massData = this.massData;
            return clone;
        }
    }
}