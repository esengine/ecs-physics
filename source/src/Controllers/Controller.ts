///<reference path="../Common/PhysicsLogic/FilterData.ts" />
module physics {
    export enum ControllerType {
        gravityController = (1 << 0),
        velocityLimitController = (1 << 1),
        abstractForceController = (1 << 2),
        buoyancyController = (1 << 3)
    }

    export class ControllerFilter {
        public controllerFlags: ControllerType;

        /**
         * 忽略控制器。 控制器对此主体无效
         * @param controller 
         */
        public ignoreController(controller: ControllerType) {
            this.controllerFlags |= controller;
        }

        /**
         * 恢复控制器。 控制器会影响此主体
         * @param controller 
         */
        public restoreController(controller: ControllerType) {
            this.controllerFlags &= ~controller;
        }

        /**
         * 确定此主体是否忽略指定的控制器
         * @param controller 
         * @returns 
         */
        public isControllerIgnored(controller: ControllerType) {
            return (this.controllerFlags & controller) == controller;
        }
    }

    export abstract class Controller extends FilterData {
        public enabled: boolean;
        public world: World;

        _type: ControllerType;

        protected constructor(controllerType: ControllerType) {
            super();
            this._type = controllerType;
        }

        public isActiveOn(body: Body) {
            if (body.controllerFilter.isControllerIgnored(this._type))
                return false;

            return super.isActiveOn(body);
        }

        public abstract update(dt: number): void;
    }
}