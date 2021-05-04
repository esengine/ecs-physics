module physics {
    export class TimeStep {
        public dt: number;
        public dtRatio: number;
        public inv_dt: number;
    }

    export class Position {
        public c: es.Vector2;
        public a: number;
    }

    export class Velocity {
        public v: es.Vector2;
        public w: number;
    }

    export class SolverData {
        public step: TimeStep;
        public positions: Position[];
        public velocities: Velocity[];
    }
}