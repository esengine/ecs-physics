///<reference path="./Shape.ts" />
module physics {
    export class CircleShape extends Shape {
        public get childCount() {
            return 1;
        }

        public get position() {
            return this._position;
        }

        public set position(value: es.Vector2){
            this._position = value;
            this.computeProperties();
        }

        public _position: es.Vector2;

        constructor(radius: number = 0, density: number = 0) {
            super(density);

            console.assert(radius >= 0);
            console.assert(density >= 0);

            this.shapeType = ShapeType.circle;
            this._position = es.Vector2.zero;
            this.radius = radius;
        }

        public testPoint(transform: Transform, point: es.Vector2) {
            let center = es.Vector2.add(transform.p, MathUtils.mul_rv(transform.q, this.position));
            let d = es.Vector2.subtract(point, center);
            return es.Vector2.dot(d, d) <= this._2radius;
        }

        public rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number) {
            let pos = es.Vector2.add(transform.p, MathUtils.mul_rv(transform.q, this.position));
            let s = es.Vector2.subtract(input.point1, pos);
            let b = es.Vector2.dot(s, s) - this._2radius;

            let r = es.Vector2.subtract(input.point2, input.point1);
            let c = es.Vector2.dot(s, r);
            let rr = es.Vector2.dot(r, r);
            let sigma = c * c - rr * b;

            if (sigma < 0 || rr < Settings.epsilon)
                return false;

            let a = -(c + (Math.sqrt(sigma)));

            if (0 <= a && a <= input.maxFraction * rr) {
                a /= rr;
                output.fraction = a;

                output.normal = es.Vector2.add(s, es.Vector2.multiplyScaler(r, a));
                es.Vector2Ext.normalize(output.normal);
                return true;
            }

            return false;
        }

        public computeAABB(aabb: AABB, transform: Transform, childIndex: number) {
            let p = es.Vector2.add(transform.p, MathUtils.mul_rv(transform.q, this.position));
            aabb.lowerBound = new es.Vector2(p.x- this.radius, p.y - this.radius);
            aabb.upperBound = new es.Vector2(p.x + this.radius, p.y + this.radius);
        }

        protected computeProperties(){
            let area = Settings.pi * this._2radius;
            this.massData.area = area;
            this.massData.mass = this.density * area;
            this.massData.centroid = this.position.clone();

            this.massData.inertia = this.massData.mass * (0.5 * this._2radius + es.Vector2.dot(this.position, this.position));
        }

        public computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2) {
            sc.x = 0;
            sc.y = 0;

            let p = MathUtils.mul_tv(xf, this.position);
            let l = -(es.Vector2.dot(normal, p) - offset);
            if (l < -this.radius + Settings.epsilon) {
                return 0;
            }

            if (l > this.radius) {
                sc = p;
                return Settings.pi * this._2radius;
            }

            let l2 = l * l;
            let area = this._2radius * (Math.asin(l / this.radius) +Settings.pi / 2) + l * Math.sqrt(this._2radius - l2);
            let com = -2 / 3 * Math.pow(this._2radius - l2, 1.5) / area;

            sc.x = p.x + normal.x * com;
            sc.y = p.y + normal.y * com;

            return area;
        }

        public compareTo(shape: CircleShape) {
            return (this.radius == shape.radius && this.position.equals(shape.position));
        }

        public clone() {
            let clone = new CircleShape();
            clone.shapeType = this.shapeType;
            clone._radius = this.radius;
            clone._2radius = this._2radius;
            clone._density = this._density;
            clone._position = this._position;
            clone.massData = this.massData;
            return clone;
        }
    }
}