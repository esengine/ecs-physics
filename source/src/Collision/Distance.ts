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
                    let polygon = <PolygonShape> shape;
                    this.vertices.length = 0;
                    for (let i = 0; i < polygon.vertices.length; i ++) {
                        this.vertices.push(polygon.vertices[i]);
                    }

                    this.radius = polygon.radius;
                }

                    break;

                case ShapeType.chain: {
                    let chain = <ChainShape> shape;
                    console.assert(0 <= index && index < chain.vertices.length);
                    this.vertices.length = 0;
                    this.vertices.push(chain.vertices[index]);
                    this.vertices.push(index + 1 < chain.vertices.length ? chain.vertices[index + 1] : chain.vertices[0]);

                    this.radius = chain.radius;
                }   

                    break;

                case ShapeType.edge: {
                    let edge = <EdgeShape> shape;
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
}