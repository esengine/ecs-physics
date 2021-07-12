module physics {
    export class BodyFactory {
        public static createBody(world: World, position: es.Vector2 = new es.Vector2(), rotation: number = 0,
            bodyType: BodyType = BodyType.static, userData = null) {
            return new Body(world, position, rotation, bodyType, userData);
        }
    }
}