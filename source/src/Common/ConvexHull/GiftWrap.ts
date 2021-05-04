module physics {
    /**
     * Giftwrap凸包算法。 O（nh）时间复杂度，其中n是点数，h是凸包上的点数。
     * 从Box2D中摘取
     */
    export class GiftWrap {
        /**
         * 从给定的顶点返回凸包
         * @param vertices 
         */
        public static getConvexHull(vertices: Vertices) {
            if (vertices.length <= 3)
                return vertices;

            let i0 = 0;
            let x0 = vertices[0].x;
            for (let i = 1; i < vertices.length; ++i) {
                let x = vertices[i].x;
                if (x > x0 || (x == x0 && vertices[i].y < vertices[i0].y)) {
                    i0 = i;
                    x0 = x;
                }
            }

            let hull: number[] = [];
            let m = 0;
            let ih = i0;

            for (;;) {
                hull[m] = ih;

                let ie = 0;
                for (let j = 1; j < vertices.length; ++j) {
                    if (ie == ih) {
                        ie = j;
                        continue;
                    }

                    let r = es.Vector2.subtract(vertices[ie], vertices[hull[m]]);
                    let v = es.Vector2.subtract(vertices[j], vertices[hull[m]]);
                    let c = MathUtils.cross(r, v);
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

            let result = new Vertices();

            for (let i = 0; i < m; ++i){
                result.push(vertices[hull[i]]);
            }

            return result;
        }
    }
}