function Mass(x, y, mass, radius, angle, x_speed, y_speed, rotate_speed) {
    this.x = x;
    this.y = y;
    this.mass = mass || 1;
    this.radius = radius;
    this.x_speed = x_speed || 0;
    this.y_speed = y_speed || 0;
    this.rotate_speed = rotate_speed || 0;
    this.angle = angle;
}

Mass.prototype.update = function(elapsed, canvas) {
    if (this.x + this.radius < 0) {
        this.x = canvas.width + this.radius;
    }
    if (this.x - this.radius > canvas.width) {
        this.x = -this.radius;
    }
    if (this.y + this.radius < 0) {
        this.y = canvas.height + this.radius;
    }
    if (this.y - this.radius > canvas.height) {
        this.y = -this.radius
    }
    this.x += this.x_speed * elapsed;
    this.y += this.y_speed * elapsed;
    this.angle += (this.rotate_speed * elapsed) % (Math.PI * 2);
}

Mass.prototype.moving = function(angle, force, elapsed) {
    this.x_speed += Math.cos(angle) * this.radius * force * elapsed;
    this.y_speed += Math.sin(angle) * this.radius * force * elapsed;
}

// Does it need angle?
Mass.prototype.twist = function(force, elapsed) {
    this.rotate_speed += Math.PI * 2 * force * elapsed;
}

// Test Mass
Mass.prototype.draw = function(context) {
    context.save();
    context.lineWidth = 1.25;
    context.fillStyle = "ivory";
    context.strokeStyle = "ivory";
    context.beginPath();
    context.rect(this.x, this.y, 20, 20);
    context.fill();
    context.restore();
}