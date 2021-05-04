module physics {
    export class VelocityConstraintPoint {
        public RA: es.Vector2;
        public RB: es.Vector2;
        public normalImpulse: number;
        public tangentImpulse: number;
        public normalMass: number;
        public tangentMass: number;
        public velocityBias: number;
    }

    export class ContactVelocityConstraint {
        public points: VelocityConstraintPoint[] = [];
        public normal: es.Vector2;
        public normalMass: Mat22;
        public k: Mat22;
        public indexA: number;
        public indexB: number;
        public invMassA: number;
        public invMassB: number;
    }

    export class ContactSolver {
        public _step: TimeStep;
        public _positions: Position[];
        public _velocities: Velocity[];
        public _contacts: Contact[];
        public _count: number;

        public reset(step: TimeStep, count: number, contacts: Contact[], positions: Position[], velocities: Velocity[]) {
            this._step = step;
            this._count = count;
            this._positions= positions;
            this._velocities = velocities;
            this._contacts = contacts;

            // TODO: grow the array
        }
    }
}