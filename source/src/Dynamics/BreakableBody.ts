module physics {
    /**
     * 一种支撑多个可分开的Fixture的主体
     */
    export class BreakableBody {
        public isBroken: boolean;
        public mainBody: Body;
        public parts: Fixture[] = [];

        /**
         * 分解身体所需的力。默认值：500 
         */
        public strength: number = 500;

        _angularVelocitiesCache: number[] = [];
        _break: boolean;
        _velocitiesCache: es.Vector2[] = [];
        _world: World;

        constructor(world: World, vertices: Vertices[], density: number,
            position: es.Vector2 = new es.Vector2(), rotation: number = 0) {
                this._world = world;
                this._world.contactManager.onPostSolve.push(this.onPostSolve);

            }

        onPostSolve(contact: Contact, impulse: ContactVelocityConstraint) {
            if (!this.isBroken) {
                let partsList = new es.List(this.parts);
                if (partsList.contains(contact.fixtureA) || partsList.contains(contact.fixtureB)) {
                    let maxImpulse = 0;
                    let count = contact.manifold.pointCount;

                    for (let i = 0; i < count; ++ i) {
                        maxImpulse = Math.max(maxImpulse, impulse.points[i].normalImpulse);
                    }

                    if (maxImpulse > this.strength) {
                        this._break = true;
                    }
                }
            }
        }

        public update() {
            if (this._break) {
                this.decompose();
                this.isBroken = true;
                this._break = false;
            }

            if (this.isBroken == false) {
                if (this.parts.length > this._angularVelocitiesCache.length) {
                    this._velocitiesCache = [];
                    this._angularVelocitiesCache = [];
                }

                for (let i = 0; i < this.parts.length; i ++) {
                    this._velocitiesCache[i] = this.parts[i].body.linearVelocity;
                    this._angularVelocitiesCache[i] = this.parts[i].body.angularVelocity;
                }
            }
        }

        decompose() {
            new es.List(this._world.contactManager.onPostSolve).remove(this.onPostSolve);

            for (let i = 0; i < this.parts.length; i ++) {
                let oldFixture = this.parts[i];

                let shape = oldFixture.shape.clone();
                let userData = oldFixture.userData;

                this.mainBody.destroyFixture(oldFixture);

                const body = BodyFactory.createBody(this._world, this.mainBody.position, this.mainBody.rotation, BodyType.dynamic, this.mainBody.userData);
                const newFixture = body.createFixture(shape);
                newFixture.userData = userData;
                this.parts[i] = newFixture;

                body.angularVelocity = this._angularVelocitiesCache[i];
                body.linearVelocity = this._velocitiesCache[i];
            }

            this._world.removeBody(this.mainBody);
            this._world.removeBreakableBody(this);
        }
    }
}