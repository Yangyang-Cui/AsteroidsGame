function collision(obj1, obj2) {
    return distance(obj1, obj2) < (obj1.radius + obj2.radius);
}

function distance(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

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

// Mass(x, y, mass, radius, angle, x_speed, y_speed, rotate_speed) 
function Ship(x, y, mass, radius, move_power, projectile_force) {
    // Does Ship need density? Or directly give it radius?
    // let density = 1;
    // let radius = Math.sqrt((mass / density) / Math.PI);
    // Does it need ", x_speed, y_speed, rotate_speed" in Mass.call()?
    Mass.call(this, x, y, mass, radius, Math.PI * 1.5);
    this.go_forward = false;
    this.turn_left = false;
    this.turn_right = false;
    this.go_backward = false;
    this.fire_on = false;
    this.move_power = move_power;
    this.turn_power = this.move_power / 20;
    this.projectile_force = projectile_force;
}
Ship.prototype = Object.create(Mass.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.draw = function(context, guide) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    draw_ship(context, this.radius, {
        guide: guide,
        thruster_on: this.go_forward
    });
    context.restore();
}

// Mass.prototype.moving = function(angle, force, elapsed)
// angle ?
Ship.prototype.update = function(elapsed) {
    Mass.prototype.update.apply(this, arguments);
    this.moving(this.angle, (this.go_forward - this.go_backward) * this.move_power, elapsed);
    this.twist((this.turn_right - this.turn_left) * this.turn_power, elapsed);
}
Ship.prototype.projectile = function(elapsed) {
    let p = new Projectile(1,
        this.x + Math.cos(this.angle) * this.radius,
        this.y + Math.sin(this.angle) * this.radius,
        0.0025,
        this.x_speed,
        this.y_speed,
        this.rotate_speed);
    p.moving(this.angle, this.projectile_force, elapsed);
    this.moving(this.angle + Math.PI, this.projectile_force, elapsed);
    return p;
}

// Mass(x, y, mass, radius, angle, x_speed, y_speed, rotate_speed) 
function Projectile(lifetime, x, y, mass, x_speed, y_speed, rotate_speed) {
    let density = 0.001;
    let radius = Math.sqrt((mass / density) / Math.PI);
    Mass.call(this, x, y, mass, radius, 0, x_speed, y_speed, rotate_speed);
    this.lifetime = lifetime;
    this.life = 1;
}
Projectile.prototype = Object.create(Mass.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.draw = function(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    draw_projectile(context, this.radius, this.life);
    context.restore();
}
Projectile.prototype.update = function(elapsed) {
    Mass.prototype.update.apply(this, arguments);
    this.life -= (elapsed / this.lifetime);
}