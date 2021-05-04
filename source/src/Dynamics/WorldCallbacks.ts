module physics {
    export type beginContactDelegate = (contact: Contact) => boolean;
    export type collisionFilterDelegate = (fixtureA: Fixture, fixtureB: Fixture) => boolean;
    export type endContactDelegate = (contact: Contact) => void;
    export type broadphaseDelegate = (proxyA: FixtureProxy, proxyB: FixtureProxy) => void;
    export type postSolveDelegate = (contact: Contact, impulse: ContactVelocityConstraint) => void;
    export type preSolveDelegate = (contact: Contact, oldManifold: Manifold) => void;
    export type afterCollisionEventHandler = (fixtureA: Fixture, fixtureB: Fixture, contact: Contact,
        impulse: ContactVelocityConstraint) => void;
    export type beforeCollisionEventHandler = (fixtureA: Fixture, fixtureB: Fixture) => boolean
    export type onCollisionEventHandler = (fixtureA: Fixture, fixtureB: Fixture, contact: Contact) => boolean;
    export type onSeperationEventHandler = (fixtureA: Fixture, fixtureB: Fixture) => void;
    export type bodyDelegate = (body: Body) => void;
    export type fixtureDelegate = (fixture: Fixture) => void;
    export type jointDelegate = (joint: Joint) => void;
    export type controllerDelegate = (controller: Controller) => void;
}