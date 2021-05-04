module physics {
    /**
     * 这描述了用于TOI计算的身体/形状的运动。
     * 形状是相对于身体原点定义的，可以与质心不重合。 
     * 但是，要支持动态我们必须对质心位置进行插值
     */
    export class Sweep {
        /** 世界角度 */
        public a: number;

        public a0: number;
        /**
         * 当前时间步长的小数，范围为[0,1]c0和a0是alpha0处的位置
         */
        public alpha0: number;

        /**
         * 中心世界位置 
         */
        public c: es.Vector2;
        public c0: es.Vector2;
        /**
         * 当地质心位置 
         */
        public localCenter: es.Vector2;

        /**
         * 在特定时间获取插值变换
         * @param xfb 
         * @param beta 
         */
        public getTransform(xfb: Transform, beta: number) {
            xfb.p.x = (1 - beta) * this.c0.x + beta * this.c.x;
            xfb.p.y = (1 - beta) * this.c0.y + beta * this.c.y;
            let angle = (1 - beta) * this.a0 + beta * this.a;
            xfb.q.set(angle);

            // 转向原点 
            xfb.p.subtract(MathUtils.mul(xfb.q, this.localCenter));
        }

        /**
         * 向前推进，产生一个新的初始状态。
         * @param alpha 
         */
        public advance(alpha: number) {
            console.assert(this.alpha0 < 1);
            let beta = (alpha - this.alpha0) / (1 - this.alpha0);
            this.c0.add(es.Vector2.subtract(this.c, this.c0).multiplyScaler(beta));
            this.a0 += beta * (this.a - this.a0);
            this.alpha0 = alpha;
        }

        /**
         * 归一化角度
         */
        public normalize() {
            let d = 2 * Math.PI * Math.floor(this.a0 / (2 * Math.PI));
            this.a0 -= d;
            this.a -= d;
        }
    }

    /**
     * 转换包含平移和旋转。 
     * 它用来代表刚性框架的位置和方向
     */
    export class Transform {
        public p: es.Vector2;
        public q: Rot;

        constructor(position: es.Vector2, rotation: Rot) {
            this.p = position;
            this.q = rotation;
        }

        /**
         * 将此设置为标识转换
         */
        public setIdentity() {
            this.p = es.Vector2.zero;
            this.q.setIdentity();
        }

        /**
         * 根据位置和角度进行设置
         * @param position 
         * @param angle 
         */
        public set(position: es.Vector2, angle: number) {
            this.p = position;
            this.q.set(angle);
        }
    }

    /**
     * Rotation
     */
    export class Rot {
        public s: number;
        public c: number;

        /**
         * 从弧度的角度初始化 
         * @param angle 
         */
        constructor(angle: number) {
            this.s = Math.sin(angle);
            this.c = Math.cos(angle);
        }

        /**
         * 使用以弧度为单位的角度进行设置
         * @param angle 
         */
        public set(angle: number) {
            if (angle == 0) {
                this.s = 0;
                this.c = 1;
            } else {
                this.s = Math.sin(angle);
                this.c = Math.cos(angle);
            }
        }

        /**
         * 设置为identity旋转
         */
        public setIdentity() {
            this.s = 0;
            this.c = 1;
        }

        /**
         * 获取弧度角
         * @returns 
         */
        public getAngle() {
            return Math.atan2(this.s, this.c);
        }

        /**
         * 获取x轴 
         * @returns 
         */
        public getXAxis(): es.Vector2 {
            return new es.Vector2(this.c, this.s);
        }

        /**
         * 获取y轴 
         * @returns 
         */
        public getYAxis(): es.Vector2 {
            return new es.Vector2(-this.s, this.c);
        }
    }

    export class MathUtils {
        public static mul(q: Rot, v: es.Vector2) {
            return new es.Vector2(q.c * v.x - q.s * v.y, q.s * v.x + q.c * v.y);
        }

        public static mul_tv(t: Transform, v: es.Vector2) {
            let x = (t.q.c * v.x - t.q.s * v.y) + t.p.x;
            let y = (t.q.s * v.x + t.q.c * v.y) + t.p.y;

            return new es.Vector2(x, y);
        }

        public static mul_mv(a: Mat22, v: es.Vector2) {
            return new es.Vector2(v.x * a.ex.x + v.y * a.ex.y, v.x * a.ey.x + v.y * a.ey.y);
        }

        public static mul_rr(q: Rot, r: Rot) {
            let qr: Rot = new Rot(0);
            qr.s = q.c * r.s - q.s * r.c;
            qr.c = q.c * r.c + q.s * r.s;
            return qr;
        }

        public static mul_rv(q: Rot, v: es.Vector2) {
            return new es.Vector2(q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y);
        }

        public static cross(a: es.Vector2, b: es.Vector2) {
            return a.x * b.y - a.y * b.x;
        }
    }

    /**
     * 2×2矩阵。 以列主要顺序存储
     */
    export class Mat22 {
        public ex: es.Vector2;
        public ey: es.Vector2;

        constructor(c1: es.Vector2, c2:es.Vector2) {
            this.ex = c1;
            this.ey = c2;
        }
        
    }
}