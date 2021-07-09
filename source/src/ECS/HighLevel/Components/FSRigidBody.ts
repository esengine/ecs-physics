module physics {
    export class FSRigidBody extends es.Component implements es.IUpdatable {
        public body: Body;
        
        _bodyDef: FSBodyDef = new FSBodyDef();
        _ignoreTransformChanges: boolean;
        public _joints: FSJoint[] = [];

        update() {
            
        }

    }
}
