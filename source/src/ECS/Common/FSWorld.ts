module physics {
    export class FSWorld extends es.SceneComponent {
        public world: World;

        constructor(gravity = new es.Vector2(0, 9.82)){
            super();

            this.world = new World(gravity);
        }

        onEnabled() {
            this.world.enabled = true;
        }

        onDisabled() {
            this.world.enabled = false;
        }

        onRemovedFromScene() {
            this.world.clear();
            this.world = null;
        }

        update() {
            this.world.step(es.Time.deltaTime);
        }
    }
}