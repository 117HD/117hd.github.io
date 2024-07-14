export class AABB {
    constructor(x1, y1, z1, x2, y2, z2) {
        if (arguments.length === 1) {
            let regionId = arguments[0];
            this.minX = (regionId >>> 8) << 6;
            this.minY = (regionId & 0xFF) << 6;
            this.maxX = this.minX + 63;
            this.maxY = this.minY + 63;
            this.minZ = Number.MIN_SAFE_INTEGER;
            this.maxZ = Number.MAX_SAFE_INTEGER;
        } else if (arguments.length === 2) {
            this.minX = this.maxX = x1;
            this.minY = this.maxY = y1;
            this.minZ = Number.MIN_SAFE_INTEGER;
            this.maxZ = Number.MAX_SAFE_INTEGER;
        } else if (arguments.length === 3) {
            this.minX = this.maxX = x1;
            this.minY = this.maxY = y1;
            this.minZ = this.maxZ = z1;
        } else if (arguments.length === 4) {
            this.minX = Math.min(x1, x2);
            this.minY = Math.min(y1, y2);
            this.maxX = Math.max(x1, x2);
            this.maxY = Math.max(y1, y2);
            this.minZ = Number.MIN_SAFE_INTEGER;
            this.maxZ = Number.MAX_SAFE_INTEGER;
        } else if (arguments.length === 5) {
            this.minX = Math.min(x1, x2);
            this.minY = Math.min(y1, y2);
            this.maxX = Math.max(x1, x2);
            this.maxY = Math.max(y1, y2);
            this.minZ = this.maxZ = z1;
        } else if (arguments.length === 6) {
            this.minX = Math.min(x1, x2);
            this.minY = Math.min(y1, y2);
            this.minZ = Math.min(z1, z2);
            this.maxX = Math.max(x1, x2);
            this.maxY = Math.max(y1, y2);
            this.maxZ = Math.max(z1, z2);
        } else {
            throw new Error('Invalid number of arguments for AABB constructor');
        }
    }
}