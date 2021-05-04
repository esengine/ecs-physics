module physics {
    export enum PhysicsLogicType {
        Explosion = (1 << 0)
    }
    
    export class PhysicsLogicFilter {
        public controllerIgnores: PhysicsLogicType;
    
        /**
         * 忽略控制器。 控制器对此主体无效
         * @param type 
         */
        public ignorePhysicsLogic(type: PhysicsLogicType) {
            this.controllerIgnores |= type;
        }
    }
}
