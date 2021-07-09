module physics {
    export class FixedArray2<T> {
        _value0: T;
        _value1: T;

        public get(index: number) {
            switch (index) {
                case 0:
                    return this._value0;
                case 1:
                    return this._value1;
                default:
                    throw new Error('index out of range');
            }
        }

        public set(index: number, value: T) {
            switch (index) {
                case 0:
                    this._value0 = value;
                    break;
                case 1:
                    this._value1 = value;
                    break;
                default:
                    throw new Error('index out of range');
            }
        }
    }

    export class FixedArray3<T> {
        _value0: T;
        _value1: T;
        _value2: T;

        public get(index: number) {
            switch (index) {
                case 0:
                    return this._value0;
                case 1:
                    return this._value1;
                case 2:
                    return this._value2;
                default:
                    throw new Error('index out of range');
            }
        }

        public set(index: number, value: T) {
            switch (index) {
                case 0:
                    this._value0 = value;
                    break;
                case 1:
                    this._value1 = value;
                    break;
                case 2:
                    this._value2 = value;
                    break;
                default:
                    throw new Error('index out of range');
            }
        }
    }
}