function Mass(x, y, mass, radius, x_speed, y_speed, rotate_speed) {
    this.x = x;
    this.y = y;
    this.mass = mass || 1;
    this.radius = radius;
    this.x_speed = x_speed || 0;
    this.y_speed = y_speed || 0;
    this.rotate_speed = rotate_speed || 0;
}

Mass.prototype.update(elapsed, canvas) {
    if (this.x + this.radius < 0) {
        this.x = canvas.width + this.radius;
    }
    if (this.x - this.radius > canvas.width) {
        this.x = -this.radius;
    }
    // if(this.y + this.)
}