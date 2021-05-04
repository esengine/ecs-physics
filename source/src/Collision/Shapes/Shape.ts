module physics {
    /**
     * 这将保存为形状计算的质量数据
     */
    export class MassData implements es.IEquatable<MassData> {
        /** 形状的面积  */
        public area: number;

        /** 形状质心相对于形状原点的位置 */
        public centroid: es.Vector2;

        /** 形状围绕局部原点的旋转惯性 */
        public inertia: number;

        /** 形状的质量，通常以千克为单位 */
        public mass: number;

        public static equals(left: MassData, right: MassData) {
            return (left.area == right.area && left.mass == right.mass && left.centroid == right.centroid &&
                left.inertia == right.inertia);
        }

        public static notEquals(left: MassData, right: MassData) {
            return !MassData.equals(left, right);
        }

        public equals(other: MassData) {
            return MassData.equals(this, other);
        }
    }

    export enum ShapeType {
        unknown = -1,
        circle = 0,
        edge = 1,
        polygon = 2,
        chain = 3,
        typeCount = 4
    }

    /**
     * 形状用于碰撞检测。 您可以根据需要创建形状。 
     * 创建fixture后，将自动创建World中用于模拟的形状。 
     * 形状可以封装一个或多个子形状。 
     */
    export abstract class Shape {
        /**
         * 包含形状的属性，例如：
         * -形状的面积
         * -质心
         * -惯性
         * - 质量
         */
        public massData: MassData;
        /**
         * 获取此形状的类型
         */
        public shapeType: ShapeType;
        /**
         * 获取子基元的数量
         */
        public abstract childCount: number;

        /**
         * 获取或设置密度。 更改密度会导致重新计算形状属性
         */
        public get density() {
            return this._density;
        }

        public set density(value: number) {
            console.assert(value >= 0);
            this._density = value;
            this.computeProperties();
        }

        /**
         * 形状的半径更改半径会重新计算形状属性
         */
        public get radius() {
            return this._radius;
        }   

        public set radius(value:number) {
            console.assert(value >= 0);

            this._radius = value;
            this._2radius = this._radius * this._radius;

            this.computeProperties();
        }

        public _density: number;
        public _radius: number;
        public _2radius: number;

        protected constructor(density: number) {
            this._density = density;
            this.shapeType = ShapeType.unknown;
        }

        /**
         * clone shape
         */
        public abstract clone(): Shape;

        /**
         * 测试此形状中的遏制点。 注意：这仅适用于凸形
         * @param transform 
         * @param point 
         */
        public abstract testPoint(transform: Transform, point: es.Vector2): boolean;

        /**
         * 向子形状投射射线
         * @param output 
         * @param input 
         * @param transform 
         * @param childIndex 
         */
        public abstract rayCast(output: RayCastOutput, input: RayCastInput, transform: Transform,
            childIndex: number): boolean;

        /**
         * 给定一个变换，为子形状计算关联的轴对齐的边界框
         * @param aabb 
         * @param transform 
         * @param childIndex 
         */
        public abstract computeAABB(aabb: AABB, transform: Transform, childIndex: number): void;

        /**
         * 使用形状的尺寸和密度计算其质量属性。 惯性张量是围绕局部原点而不是质心计算的
         */
        protected abstract computeProperties(): void;

        /**
         * 根据类型和属性将此形状与另一个形状进行比较
         * @param shape 
         * @returns 
         */
        public compareTo(shape: Shape){
            return false;
        }

        /**
         * 用于浮力控制器 
         * @param normal 
         * @param offset 
         * @param xf 
         * @param sc 
         */
        public abstract computeSubmergedArea(normal: es.Vector2, offset: number, xf: Transform, sc: es.Vector2): number;
    }   
}