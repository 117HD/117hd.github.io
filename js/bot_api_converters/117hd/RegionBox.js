import {AABB} from './AABB.js';

export class RegionBox {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    toAabb() {
        let x1 = this.from >>> 8;
        let y1 = this.from & 0xFF;
        let x2 = this.to >>> 8;
        let y2 = this.to & 0xFF;

        if (x1 > x2) {
            [x1, x2] = [x2, x1]; // Swap values
        }
        if (y1 > y2) {
            [y1, y2] = [y2, y1]; // Swap values
        }

        return new AABB(
            (x1 << 6),
            (y1 << 6),
            0,
            ((x2 + 1) << 6) - 1,
            ((y2 + 1) << 6) - 1,
            0
        );
    }
}