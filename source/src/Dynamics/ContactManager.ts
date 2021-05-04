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

        public findNewContacts() {
            // this.broadPhase.
            // TODO: updatePairs
        }

        public destroy(contact: Contact) {
            let fixtureA = contact.fixtureA;
            let fixtureB = contact.fixtureB;
            let bodyA = fixtureA.body;
            let bodyB = fixtureB.body;

            if (contact.isTouching) {
                if (fixtureA != null && fixtureA.onSeperation != null) {
                    fixtureA.onSeperation.forEach(func => func(fixtureA, fixtureB));
                }

                if (fixtureB != null && fixtureB.onSeperation != null)
                    fixtureB.onSeperation.forEach(func => func(fixtureB, fixtureA));

                if (this.onEndContact != null)
                    this.onEndContact.forEach(func => func(contact));
            }

            new es.List(this.contactList).remove(contact);

            if (contact._nodeA.prev != null)
                contact._nodeA.prev.next = contact._nodeA.next;

            if (contact._nodeA.next != null)
                contact._nodeA.next.prev = contact._nodeA.prev;

            if (contact._nodeA == bodyA.contactList)
                bodyA.contactList = contact._nodeA.next;

            if (contact._nodeB.prev != null)
                contact._nodeB.prev.next = contact._nodeB.next;

            if (contact._nodeB.next != null)
                contact._nodeB.next.prev = contact._nodeB.prev;

            if (contact._nodeB == bodyB.contactList)
                bodyB.contactList = contact._nodeB.next;

            if (this.activeContacts.has(contact)) {
                this.activeContacts.delete(contact);
            }

            contact.destroy();
        }
    }
}