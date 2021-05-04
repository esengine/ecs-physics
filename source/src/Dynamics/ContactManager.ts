module physics {
    export class ContactManager {
        public broadPhase: DynamicTreeBroadPhase;
        public contactList: Contact[] = [];

        public activeContacts: Set<Contact> = new Set();
        /**
         * 更新期间使用的活动联系人的临时副本，因此哈希集可以在更新期间添加/删除成员。
         * 每次更新后都会清除此列表。 
         */
        public activeList: Contact[] = [];

        /** 创建contact时触发  */
        public onBeginContact: beginContactDelegate[];
        /** Contact管理器使用的过滤器 */
        public onContactFilter: collisionFilterDelegate[];
        /** 删除contact时触发  */
        public onEndContact: endContactDelegate[];
        /** 当broadphase检测到两个fixture彼此靠近时触发 */
        public onBroadphaseCollision: broadphaseDelegate[];
        /** 求解器运行后触发  */
        public onPostSolve: postSolveDelegate[];
        /** 在求解器运行之前触发  */
        public onPreSolve: preSolveDelegate[];

        constructor(broadPhase: DynamicTreeBroadPhase) {
            this.broadPhase = broadPhase;
            this.onBroadphaseCollision.push(this.addPair);
        }

        addPair(proxyA: FixtureProxy, proxyB: FixtureProxy) {
            let fixtureA = proxyA.fixture;
            let fixtureB = proxyB.fixture;

            let indexA = proxyA.childIndex;
            let indexB = proxyB.childIndex;

            let bodyA = fixtureA.body;
            let bodyB = fixtureB.body;

            if (bodyA == bodyB)
                return;

            let edge = bodyB.contactList;
            while (edge != null) {
                if (edge.other == bodyA) {
                    let fA = edge.contact.fixtureA;
                    let fB = edge.contact.fixtureB;
                    let iA = edge.contact.childIndexA;
                    let iB = edge.contact.childIndexB;

                    if (fA == fixtureA && fB == fixtureB && iA == indexA && iB == indexB) {
                        return;
                    }

                    if (fA == fixtureB && fB == fixtureA && iA == indexB && iB == indexA) {
                        return;
                    }
                }

                edge = edge.next;
            }

            // TODO: shouldCollide
            // if (bodyB.sh)
        }
    }
}