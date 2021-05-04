module physics {
    /**
     * 在显示和模拟单位之间转换单位
     */
    export class FSConvert {
        /**
         * 将模拟（米）转换为显示（像素） 
         */
        public static simToDisplay: number = 100;

        /**
         * 将显示（像素）转换为模拟（米） 
         */
        public static displayToSim: number = 1 / FSConvert.simToDisplay;
    }
}