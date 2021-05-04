///<reference path="./Dynamics/Fixture.ts" />
module physics {
    export class Settings {
        public static maxFloat = 3.402823466e+38;
        public static epsilon = 1.192092896e-07;
        public static pi = 3.14159265359;

        /**
         * Farseer Physics Engine与Box2d相比具有不同的fixture过滤方法。 
         * 引擎中同时包含FPE和Box2D过滤。 
         * 如果要从FPE的早期版本升级，请将其设置为true，将defaultFixtureCollisionCategories设置为Category.All
         */
        public static useFPECollisionCategories: boolean;
        /**
         * Fixture构造函数将其用作Fixture.collisionCategories成员的默认值。 
         * 请注意，您可能需要根据上面的UseFPECollisionCategories设置进行更改
         */
        public static defaultFixtureCollisionCategories = Category.cat1;
        /**
         * Fixture构造函数将其用作Fixture.collidesWith成员的默认值
         */
        public static defaultFixtureCollidesWith = Category.all;
        /**
         * Fixture构造函数将其用作Fixture.ignoreCCDWith成员的默认值
         */
        public static defaultFixtureIgnoreCCDWith = Category.none;

        /**
         * 用作碰撞和约束公差的小长度。 
         * 通常，它被选择为在数值上有意义，但在视觉上却无关紧要
         */
        public static linearSlop = 0.005;
        /**
         * 多边形/边缘形状蒙皮的半径。 这不应该被修改。 
         * 使其更小意味着多边形将没有足够的缓冲区来进行连续碰撞。 
         * 使其更大可能会产生顶点碰撞的假象。 
         */
        public static polygonRadius = (2 * Settings.linearSlop);
        /**
         * 凸多边形上的最大顶点数
         */
        public static maxPolygonVertices = 8;
        /**
         * 如果为true，它将在所有多边形输入上运行GiftWrap凸包。 
         * 在给定随机输入的情况下，这会使引擎更稳定，但是如果多边形的创建速度更为重要，则可能需要将其设置为false。 
         */
        public static useConvexHullPolygons = true;

        public static mixFriction(friction1: number, friction2: number) {
            return Math.sqrt(friction1 * friction2);
        }

        public static mixRestitution(restitution1: number, restitution2: number) {
            return restitution1 > restitution2 ? restitution1 : restitution2;
        }
    }
}