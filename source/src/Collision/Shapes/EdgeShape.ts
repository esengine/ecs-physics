///<reference path="Shape.ts" />
module physics {
    /**
     * 线段（边缘）形状。 这些可以成环或成环连接到其他边缘形状。 连接信息用于确保正确的接触法线。 
     */
    export class EdgeShape extends Shape {
        public get childCount() {
            return 1;
        }

        /** 如果边在vertex1之前连接到相邻顶点，则为true */
        public hasVertex0: boolean;

        /** 如果边在vertex2之后连接到相邻的顶点，则为true */
        public hasVertex3: boolean;

        /** 可选的相邻顶点。 这些用于平滑碰撞 */
        public vertex0: es.Vector2;

        /** 可选的相邻顶点。 这些用于平滑碰撞 */
        public vertex3: es.Vector2;

        public get vertex1() {
            return this._vertex1;
        }

        public set vertex1(value: es.Vector2) {
            this._vertex1 = value;
            this.computeProperties();
        }

        public get vertex2() {
            return this._vertex2;
        }

        public set vertex2(value: es.Vector2) {
            this._vertex2 = value;
            this.computeProperties();
        }

        public _vertex1: es.Vector2;
        public _vertex2: es.Vector2;

        constructor(start?: es.Vector2, end?: es.Vector2) {
            super(0);

            this.shapeType = ShapeType.edge;
            this._radius = Settings.polygonRadius;

            if (start && end) {
                this.set(start, end);
            }
        }

        /**
         * 将此设置为孤立边
         * @param start 
         * @param end 
         */
        public set(start: es.Vector2, end: es.Vector2) {
            this._vertex1 = start;
            this._vertex2 = end;
            this.hasVertex0 = false;
            this.hasVertex3 = false;

            this.computeProperties();
        }

        public testPoint(transform: Transform, point: es.Vector2) {
            return false;
        }

        public rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform,
            childIndex: number) {
            let p1 = MathUtils.mul_rv(transform.q, es.Vector2.subtract(input.point1, transform.p));
            let p2 = MathUtils.mul_rv(transform.q, es.Vector2.subtract(input.point2, transform.p));
            let d = es.Vector2.subtract(p2, p1);

            let v1 = this._vertex1.clone();
            let v2 = this._vertex2.clone();
            let e = es.Vector2.subtract(v2, v1);
            let normal = new es.Vector2(e.y, -e.x);
            es.Vector2Ext.normalize(normal);

            let numerator = es.Vector2.dot(normal, es.Vector2.subtract(v1, p1));
            let denominator = es.Vector2.dot(normal, d);

            if (denominator == 0)
                return false;

            let t = numerator / denominator;
            if (t < 0 || input.maxFraction < t)
                return false;

            let q = es.Vector2.add(p1, es.Vector2.multiplyScaler(d, t));

            let r = es.Vector2.subtract(v2, v1);
            let rr = es.Vector2.dot(r, r);
            if (rr == 0)
                return false;

            let s = es.Vector2.dot(es.Vector2.subtract(q, v1), r) / rr;
            if (s < 0 || 1 < s)
                return false;

            output.fraction = t;
            if (numerator > 0)
                output.normal = new es.Vector2(-normal.x, -normal.y);
            else
                output.normal = normal.clone();

            return true;
        }

        public computeAABB(aabb: AABB, transform: Transform, childIndex: number) {
            let v1 = MathUtils.mul_tv(transform, this._vertex1);
            let v2 = MathUtils.mul_tv(transform, this._vertex2);

            let lower = es.Vector2.min(v1, v2);
            let upper = es.Vector2.max(v1, v2);

            let r = new es.Vector2(this.radius, this.radius)
            aabb.lowerBound = es.Vector2.subtract(lower, r);
            aabb.upperBound = es.Vector2.add(upper, r);
        }

        protected computeProperties() {
            this.massData.centroid = es.Vector2.add(this.vertex1, this.vertex2).multiplyScaler(0.5);
        }

        public computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2) {
            sc.x = 0;
            sc.y = 0;
            return 0;
        }

        public clone() {
            let clone = new EdgeShape();
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
        }
    }
}