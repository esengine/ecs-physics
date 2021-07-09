module physics {
    export class FSBodyDef {
        public bodyType: BodyType = BodyType.static;
        public linearVelocity: es.Vector2;
        public angularVelocity: number = 0;
        public linearDamping: number = 0;
        public angularDampint: number = 0;

        public isBullet: boolean;
        public isSleepingAllowed: boolean = true;
        public isAwake: boolean = true;
        public fixedRotation: boolean;
        public ignoreGravity: boolean;
        public gravityScale: number = 1;
        public mass: number = 0;
        public inertia: number = 0;
    }
}