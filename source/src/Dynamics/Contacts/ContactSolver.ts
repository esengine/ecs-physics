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
}