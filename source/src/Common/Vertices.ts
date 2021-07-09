module physics {
    export enum PolygonError {
        /** 多边形中没有错误  */
        noError,
        /** 多边形必须在3和Settings.MaxPolygonVertices顶点之间 */
        invalidAmountOfVertices,
        /** 多边形必须简单。 这意味着没有重叠的边缘 */
        notSimple, 
        /** 多边形必须逆时针 */
        notCounterClockWise,
        /** 多边形是凹的，它需要是凸的 */
        notConvex,
        /** 多边形面积太小 */
        areaTooSmall,
        /** 多边形的边太短 */
        sideTooSmall
    }

    export class Vertices extends Array<es.Vector2> {
        public attackedToBody: boolean;

        /** 
         * 您可以在此集合中添加hole。 
         * 它会受到某些三角剖分算法的使用，但其他方面不会使用 
         */
        public holes: Vertices[];

        constructor(vertices: es.Vector2[] = null) {
            super();

            if (vertices)
                for (let vertical of vertices) {
                    this.push(vertical);
                }
        }

        /**
         * 获取下一个索引。 用于遍历所有边缘
         * @param index 
         * @returns 
         */
        public nextIndex(index: number) {
            return (index + 1 > this.length - 1) ? 0 : index + 1;
        }

        /**
         * 获取下一个顶点。 用于遍历所有边缘 
         * @param index 
         * @returns 
         */
        public nextVertex(index: number) {
            return this[this.nextIndex(index)];
        }

        /**
         * 获取前一个索引。 用于遍历所有边缘
         * @param index 
         * @returns 
         */
        public previousIndex(index: number) {
            return index - 1 < 0 ? this.length - 1 : index - 1;
        }

        /**
         * 获取前一个顶点。 用于遍历所有边缘
         * @param index 
         * @returns 
         */
        public previousVertx(index: number) {
            return this[this.previousIndex(index)];
        }

        /**
         * 获取签名区域。 如果面积小于0，则表示多边形是顺时针缠绕的。 
         * @returns 
         */
        public getSignedArea() {
            // 可以在欧几里得平面中存在的最简单多边形具有3个边
            if (this.length < 3)
                return 0;

            let i;
            let area = 0;

            for (i = 0; i < this.length; i ++) {
                let j = (i + 1) % this.length;

                let vi = this[i];
                let vj = this[j];

                area += vi.x * vj.y;
                area -= vi.y * vj.x;
            }

            area /= 2;
            return area;
        }

        /**
         * 获取区域
         * @returns 
         */
        public getArea() {
            let area = this.getSignedArea();
            return (area < 0 ? -area : area);
        }

        /**
         * 获取质心
         * @returns 
         */
        public getCentroid() {
            // 可以在欧几里得平面中存在的最简单多边形具有3个边
            if (this.length < 3)
                return new es.Vector2(Number.NaN, Number.NaN);

            // Box2D使用相同的算法
            let c = es.Vector2.zero;
            let area = 0;
            const inv3 = 1 / 3;

            for (let i = 0; i < this.length; ++ i){
                // 三角形顶点
                let current = this[i];
                let next = (i + 1 < this.length ? this[i + 1] : this[0]);

                let triangleArea = 0.5 * (current.x * next.y - current.y * next.x);
                area += triangleArea;

                // 面积加权质心 
                c.add(current.add(next).scale(triangleArea * inv3));
            }

            c.multiplyScaler(1 / area);
            return c;
        }

        /**
         * 返回完全包含此多边形的AABB。
         * @returns 
         */
        public getAABB() {
            let lowerBound = new es.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
            let upperBound = new es.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);

            for (let i = 0; i < this.length; ++i) {
                if (this[i].x < lowerBound.x) {
                    lowerBound.x = this[i].x;
                }

                if (this[i].x > upperBound.x) {
                    upperBound.x = this[i].x;
                }

                if (this[i].y < lowerBound.y) {
                    lowerBound.y = this[i].y;
                }

                if (this[i].y > upperBound.y) {
                    upperBound.y = this[i].y;
                }
            }

            return new AABB(lowerBound, upperBound);
        }

        /**
         * 用指定的向量平移顶点
         * @param value 
         */
        public translate(value: es.Vector2) {
            console.assert(!this.attackedToBody, "平移实体所使用的顶点可能会导致行为不稳定。 使用Body.Position代替 ");

            for (let i = 0; i < this.length; i ++) {
                this[i] = es.Vector2.add(this[i], value);
            }

            if (this.holes != null && this.holes.length > 0) {
                for (let hole of this.holes) {
                    hole.translate(value);
                }
            }
        }

        /**
         * 使用指定的矢量缩放顶点
         * @param value 
         */
        public scale(value: es.Vector2) {
            console.assert(!this.attackedToBody, "Body使用的缩放顶点会导致行为不稳定 ");

            for (let i = 0; i < this.length; i ++)
                this[i] = this[i].multiply(value);

            if (this.holes != null && this.holes.length > 0) {
                for (let hole of this.holes) {
                    hole.scale(value);
                }
            }
        }

        /**
         * 旋转具有定义值（以弧度为单位）的顶点。
         * 警告：在实体的一组活动顶点上使用此方法会导致碰撞问题。 改用Body.Rotation。 
         * @param value 
         */
        public rotate(value: number) {
            console.assert(!this.attackedToBody, "Body使用的旋转顶点可能会导致行为不稳定 ");

            let cos = Math.cos(value);
            let sin = Math.sin(value);

            for (let i = 0; i < this.length; i ++) {
                let position = this[i];
                this[i] = new es.Vector2((position.x * cos + position.y * -sin), (position.x * sin + position.y * cos));
            }

            if (this.holes != null && this.holes.length > 0){
                for (let hole of this.holes) {
                    hole.rotate(value);
                }
            }
        }

        /**
         * 确定多边形是否为凸面。 O（n ^ 2）运行时间。
         * 假设：
         * -多边形按逆时针顺序排列
         * -多边形没有重叠的边缘 
         */
        public isConvex() {
            //可以在欧几里得平面中存在的最简单多边形具有3个边
            if (this.length < 3)
                return false;

            if (this.length == 3)
                return true;

            for (let i = 0; i < this.length; ++ i) {
                let next = i + 1 < this.length ? i + 1 : 0;
                let edge = this[next].sub(this[i]);

                for (let j = 0; j < this.length; ++ j) {
                    if (j == i || j == next)
                        continue;

                    let r = this[j].sub(this[i]);

                    let s = edge.x * r.y - edge.y * r.x;

                    if (s <= 0)
                        return false;
                }
            }

            return true;
        }

        /**
         * 指示顶点是否为逆时针顺序。警告：如果多边形的面积为0，则无法确定绕线。 
         * @returns 
         */
        public isCounterClockWise() {
            if (this.length < 3)
                return false;

            return this.getSignedArea() > 0;
        }

        /**
         * 强制顶点按逆时针方向排列
         * @returns 
         */
        public forceCounterClockWise() {
            if (this.length < 3)
                return;
            
            if (!this.isCounterClockWise())
                this.reverse();
        }
    }
}