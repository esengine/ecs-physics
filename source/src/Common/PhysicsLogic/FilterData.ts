module physics {
    /**
     * 包含可以确定是否应处理对象的筛选器数据
     */
    export abstract class FilterData {
        /**
         * 禁用特定类别的逻辑。类别。默认为无。 
         */
        public disabledOnCategories: Category = Category.none;

        /**
         * 禁用特定组上的逻辑 
         */
        public disabledOnGroup: number;

        /**
         * 默认情况下，对特定类别Category.All启用逻辑
         */
        public enabledOnCategories: Category = Category.all;

        /**
         * 在特定组上启用逻辑
         */
        public enabledOnGroup: number;

        public isActiveOn(body: Body) {
            if (body == null || !body.enabled || body.isStatic) 
                return false;

            if (body.fixtureList == null)
                return false;

            for (let fixture of body.fixtureList) {
                if ((fixture.collisionGroup == this.disabledOnGroup) && fixture.collisionGroup != 0 && this.disabledOnGroup != 0)
                    return false;

                if ((fixture.collisionCategories & this.disabledOnCategories) != Category.none)
                    return false;

                if (this.enabledOnGroup != 0 || this.enabledOnCategories != Category.all) {
                    if ((fixture.collisionGroup == this.enabledOnGroup) && fixture.collisionGroup != 0 &&
                        this.enabledOnGroup != 0) 
                        return true;

                    if ((fixture.collisionCategories & this.enabledOnGroup) != Category.none &&
                        this.enabledOnCategories != Category.all)
                            return true;
                } else {
                    return true;
                }
            }

            return false;
        }
    }
}