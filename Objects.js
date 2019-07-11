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
    this.angle += (this.rotate_speed * elapsed);
    this.angle %= (Math.PI * 2);
}

Mass.prototype.moving = function(angle, force, elapsed) {
    this.x_speed += Math.cos(angle) * force * elapsed / this.mass;
    this.y_speed += Math.sin(angle) * force * elapsed / this.mass;
}

Mass.prototype.twist = function(force, elapsed) {
    this.rotate_speed += force * elapsed / this.mass;
}

// Mass(x, y, mass, radius, angle, x_speed, y_speed, rotate_speed) 
function Asteroid(x, y, mass, x_speed, y_speed, rotate_speed) {
    let density = 1;
    let radius = Math.sqrt((mass / density) / Math.PI);
    Mass.call(this, x, y, mass, radius, 0, x_speed, y_speed, rotate_speed);
    this.noise = 0.2;
    this.shape = [];
    this.circumference = 2 * Math.PI * this.radius;
    this.segments = this.circumference / 15;
    this.segments = Math.max(5, Math.min(25, this.segments));
    for (let i = 0; i < this.segments; i++) {
        this.shape.push(Math.random() - 0.5);
    }
}

Asteroid.prototype = Object.create(Mass.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.draw = function(context, guide) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    draw_asteroid(context, this.radius, this.shape, {
        guide: guide,
        noise: this.noise
    });
    context.restore();
}