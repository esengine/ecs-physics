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
                        // maxImpulse = Math.max(maxImpulse, impulse.)
                        // TODO: impulse.points
                    }

                    if (maxImpulse > this.strength) {
                        this._break = true;
                    }
                }
            }
        }
    }
}