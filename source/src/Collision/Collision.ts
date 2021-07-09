module physics {
    export class RayCastInput {
        /**
         * 光线从p1延伸到p1 + maxFraction *（p2-p1）。如果最大分数为1，则光线从p1延伸到p2。 0.5的最大分数使射线从p1到达p2的一半
         */
        public maxFraction: number;
        /**
         * 射线的起点
         */
        public point1: es.Vector2;
        /**
         * 射线的终点
         */
        public point2: es.Vector2;
    }

    /**
     * 射线投射输出数据
     */
    export class RayCastOutput {
        /**
         * 射线以p1 +分数*（p2-p1）命中，其中p1和p2来自RayCastInput。 包含光线具有交点的实际分数
         */
        public fraction: number;

        /**
         * 射线击中的形状的法线
         */
        public normal: es.Vector2;
    }

    export enum ManifoldType {
        circles,
        faceA,
        faceB
    }

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
    export class Manifold {
        /**
         * 不适用于Type.SeparationFunction.Points 
         */
        public localNormal: es.Vector2;
        /**
         * 用法取决于manifold类型
         */
        public localPoint: es.Vector2;

        public pointCount: number;
        public points: FixedArray2<ManifoldPoint>;
        public type: ManifoldType;
    }

    /**
     * ManifoldPoint是属于接触Manifold的接触点。 
     * 它包含与接触点的几何形状和动力学有关的详细信息。 
     * 局部点的使用取决于流形类型：
     * -ShapeType.Circles：圆B的本地中心
     * -SeparationFunction.FaceA：cirlceB的局部中心或polygonB的剪辑点
     * -SeparationFunction.FaceB：polygonA的剪辑点此结构跨时间步存储，因此我们将其保持较小。 
     * 注意：这些脉冲用于内部缓存，可能无法提供可靠的接触力，尤其是对于高速碰撞。 
     */
    export class ManifoldPoint {
        /** 唯一标识两个形状之间的接触点  */
        public id: ContactID;
        /** 用法取决于Manifold类型  */
        public localPoint: es.Vector2;
        /**  */
        public normalImpulse: number;
        /**  */
        public tangentImpulse: number;
    }

    /**
     * ContactID有助于热启动
     */
    export class ContactID {
        /** 相交以形成接触点的要素  */
        public features: ContactFeature;
        /** 用于快速比较ContactID */
        public key: number;
    }

    /**
     * 相交以形成接触点的要素此长度必须为4个字节或更少
     */
    export class ContactFeature {
        /** ShapeA特征索引  */
        public indexA: number;
        /** ShapeB特征索引 */
        public indexB: number;
        /** ShapeA特征类型  */
        public typeA: number;
        /** ShapeB特征类型 */
        public typeB: number;
    }

    /**
     * 轴对齐的边界框
     */
    export class AABB {
        /** 下顶点  */
        public lowerBound: es.Vector2;

        /** 上顶点  */
        public upperBound: es.Vector2;

        public get width() {
            return this.upperBound.x - this.lowerBound.x;
        }

        public get height() {
            return this.upperBound.y - this.lowerBound.y;
        }

        /** 获取AABB的中心 */
        public get center() {
            return es.Vector2.add(this.lowerBound, this.upperBound).multiplyScaler(0.5);
        }

        /** 获取AABB的范围（半宽） */
        public get extents() {
            return es.Vector2.subtract(this.upperBound, this.lowerBound).multiplyScaler(0.5);
        }

        /** 获取周长  */
        public get perimeter() {
            let wx = this.upperBound.x - this.lowerBound.x;
            let wy = this.upperBound.y - this.lowerBound.y;
            return 2 * (wx + wy);
        }

        /**
         * 获取AABB的顶点
         */
        public get vertices() {
            let vertices = new Vertices();
            vertices.push(this.upperBound);
            vertices.push(new es.Vector2(this.upperBound.x, this.lowerBound.y));
            vertices.push(this.lowerBound);
            vertices.push(new es.Vector2(this.lowerBound.x, this.upperBound.y));
            return vertices;
        }

        public get q1() {
            return new AABB(this.center, this.upperBound);
        }

        public get q2() {
            return new AABB(new es.Vector2(this.lowerBound.x, this.center.y), 
                new es.Vector2(this.center.x, this.upperBound.y));
        }

        public get q3() {
            return new AABB(this.lowerBound, this.center);
        }

        public get q4() {
            return new AABB(new es.Vector2(this.center.x, this.lowerBound.y), 
                new es.Vector2(this.upperBound.x, this.center.y));
        }

        constructor(min: es.Vector2 = new es.Vector2(), max: es.Vector2 = new es.Vector2()) {
            this.lowerBound = min;
            this.upperBound = max;
        }

        /**
         * 验证边界已排序。 边界是有效数字（不是NaN）
         * @returns 
         */
        public isValid() {
            let d = es.Vector2.subtract(this.upperBound, this.lowerBound);
            let valid = d.x >= 0 && d.y >= 0;
            valid = valid && this.lowerBound.isValid() && this.upperBound.isValid();
            return valid;
        }

        /**
         * 将AABB合并到此
         * @param aabb 
         */
        public combine(aabb: AABB) {
            this.lowerBound = es.Vector2.min(this.lowerBound, aabb.lowerBound);
            this.upperBound = es.Vector2.max(this.upperBound, aabb.upperBound);
        }

        public combine2(aabb1: AABB, aabb2: AABB) {
            this.lowerBound = es.Vector2.min(aabb1.lowerBound, aabb2.lowerBound);
            this.upperBound = es.Vector2.max(aabb1.upperBound, aabb2.upperBound);
        }

        /**
         * 该aabb是否包含提供的AABB
         * @param aabb 
         * @returns 
         */
        public contains(aabb: AABB) {
            let result = true;
            result = result && this.lowerBound.x <= aabb.lowerBound.x;
            result = result && this.lowerBound.y <= aabb.lowerBound.y;
            result = result && aabb.upperBound.x <= this.upperBound.x;
            result = result && aabb.upperBound.y <= this.upperBound.y;
            return result;
        }

        /**
         * 测试两个AABB是否重叠
         * @param a 
         * @param b 
         */
        public static testOverlap(a: AABB, b: AABB) {
            let d1 = es.Vector2.subtract(b.lowerBound, a.upperBound);
            let d2 = es.Vector2.subtract(a.lowerBound, b.upperBound);

            if (d1.x > 0 || d1.y > 0)
                return false;

            if (d2.x > 0 || d2.y > 0)
                return false;

            return true;
        }


    }
}