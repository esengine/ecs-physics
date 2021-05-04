module physics {
    export class TOIInput {
        public proxyA: DistanceProxy = new DistanceProxy();
        public proxyB: DistanceProxy = new DistanceProxy();
        public sweepA: Sweep;
        public sweepB: Sweep;
        public tMax: number;
    }

    export enum TOIOutputState {
        unknown,
        failed,
        overlapped,
        touching,
        seperated
    }
}