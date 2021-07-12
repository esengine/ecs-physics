///<reference path="./EdgeShape.ts" />
module physics {
    /**
     * 链形状是线段的自由形式序列。
     * 链条有两个侧面碰撞，因此您可以使用内部和外部碰撞，因此可以使用任何缠绕顺序。 
     * 连接信息用于创建平滑冲突。 
     * 警告：如果存在自相交，则链条不会正确碰撞。
     */
    export class ChainShape extends Shape {
        public vertices: Vertices;

        public get childCount() {
            return this.vertices.length - 1;
        }

        public get prevVertex() {
            return this._prevVertex;
        }

        public set prevVertex(value: es.Vector2) {
            this._prevVertex = value;
            this._hasPrevVertex = true;
        }

        public get nextVertex() {
            return this._nextVertex;
        }

        public set nextVertex(value: es.Vector2) {
            this._nextVertex = value;
            this._hasNextVertex = true;
        }

        _prevVertex: es.Vector2;
        _nextVertex: es.Vector2;
        _hasPrevVertex: boolean;
        _hasNextVertex: boolean;
        static _edgeShape: EdgeShape = new EdgeShape();

        constructor(vertices?: Vertices, createLoop: boolean = false) {
            super(0);
            this.shapeType = ShapeType.chain;
            this._radius = Settings.polygonRadius;

            if (vertices) {
                this.setVertices(vertices, createLoop);
            }
        }

        public getChildEdge(edge: EdgeShape, index: number) {
            console.assert(0 <= index && index < this.vertices.length - 1);
            console.assert(edge != null);

            edge.shapeType = ShapeType.edge;
            edge._radius = this._radius;

            edge.vertex1 = this.vertices[index + 0];
            edge.vertex2 = this.vertices[index + 1];

            if (index > 0) {
                edge.vertex0 = this.vertices[index - 1];
                edge.hasVertex0 = true;
            } else {
                edge.vertex0 = this._prevVertex;
                edge.hasVertex0 = this._hasPrevVertex;
            }

            if (index < this.vertices.length - 2) {
                edge.vertex3 = this.vertices[index + 2];
                edge.hasVertex3 = true;
            } else {
                edge.vertex3 = this._nextVertex;
                edge.hasVertex3 = this._hasNextVertex;
            }
        }

        public setVertices(vertices: Vertices, createLoop: boolean = false) {
            console.assert(vertices != null && vertices.length >= 3);
            console.assert(vertices[0] != vertices[vertices.length - 1]);

            for (let i = 1; i < vertices.length; ++i) {
                let v1 = vertices[i - 1];
                let v2 = vertices[i];

                console.assert(v1.distance(v2) > Settings.linearSlop * Settings.linearSlop);
            }

            this.vertices = vertices;

            if (createLoop) {
                this.vertices.push(vertices[0]);
                this.prevVertex = this.vertices[this.vertices.length - 2];
                this.nextVertex = this.vertices[1];
            }
        }

        public testPoint(transform: Transform, point: es.Vector2) {
            return false;
        }

        public rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform,
            childIndex: number) {
                console.assert(childIndex < this.vertices.length);

                let i1 = childIndex;
                let i2 = childIndex + 1;
                if (i2 == this.vertices.length)
                    i2 = 0;

                ChainShape._edgeShape.vertex1 = this.vertices[i1];
                ChainShape._edgeShape.vertex2 = this.vertices[i2];

                return ChainShape._edgeShape.rayCast(output, input, transform, 0);
        }

        public computeAABB(aabb: AABB, transform: Transform, childIndex: number) {
            console.assert(childIndex < this.vertices.length);

            let i1 = childIndex;
            let i2 = childIndex + 1;
            if (i2 == this.vertices.length)
                i2 = 0;

            let v1 = MathUtils.mul(transform, this.vertices[i1]);
            let v2 = MathUtils.mul(transform, this.vertices[i2]);

            aabb.lowerBound = es.Vector2.min(v1, v2);
            aabb.upperBound = es.Vector2.max(v1, v2);
        }

        protected computeProperties() {

        }

        public computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2) {
            sc.x = 0;
            sc.y = 0;
            return 0;
        }

        public clone() {
            let clone = new ChainShape();
            clone.shapeType = this.shapeType;
            clone._density = this._density;
            clone._radius = this._radius;
            clone.prevVertex = this._prevVertex;
            clone.nextVertex = this._nextVertex;
            clone._hasNextVertex = this._hasNextVertex;
            clone._hasPrevVertex = this._hasPrevVertex;
            clone.vertices =new Vertices(this.vertices);
            clone.massData = this.massData;
            return clone;
        }
    }
}