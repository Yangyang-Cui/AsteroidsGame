let canvas = document.getElementById("asteroid");
let context = canvas.getContext("2d");
let guide = true;
let asteroids = [];
let score = 0;
let damaged_mass = 500;
let asteroid_mass = 10000;
let asteroid_force = 5000000;

function create_asteroid() {
    return new Asteroid(
        canvas.width * Math.random(),
        canvas.height * Math.random(),
        asteroid_mass
    );
}
// Mass.prototype.moving = function(angle, force, elapsed)
// Mass.prototype.twist = function(force, elapsed) 
function asteroid_live_moving(asteroid, elapsed) {
    elapsed = elapsed || 0.016;
    asteroid.moving((Math.PI * 2) * Math.random(), asteroid_force, elapsed)
    asteroid.twist((Math.random() - 0.5) * asteroid_force * 0.01, elapsed);
}

function asteroid_live(elapsed) {
    let asteroid = create_asteroid();
    asteroid_live_moving(asteroid, elapsed);
    return asteroid;
}
asteroids.push(asteroid_live());

function asteroid_split(asteroid) {
    asteroid.mass -= damaged_mass;
    score += damaged_mass;
    let split_rate = 0.25 + (Math.random - 0.5) * 0.5;
    as1 = asteroid.child(asteroid.mass * split_rate);
    as2 = asteroid.child(asteroid.mass * (1 - split_rate));
    [as1, as2].forEach(function(child) {
        if (child.mass <= damaged_mass) {
            score += child.mass;
        } else {
            asteroids.push(child);
            asteroid_live_moving(asteroid, elapsed);
        }
    })
}
// let asteroid = new Asteroid(
//     canvas.width * Math.random(),
//     canvas.height * Math.random(),
//     10000);

// asteroid.moving((Math.PI * 2) * Math.random(), 1000, 60)
// asteroid.twist((Math.random() - 0.5) * 100, 60);

let ship = new Ship(
    canvas.width / 2,
    canvas.height / 2,
    10, 20, 1000, 200
);
let projectiles = [];

// Control ship
function key_handle(e, value) {
    let handled_nothing = false;
    switch (e.key || e.keyCode) {
        case 38:
        case "ArrowUp":
            ship.go_forward = value;
            break;
        case 37:
        case "ArrowLeft":
            ship.turn_left = value;
            break;
        case 39:
        case "ArrowRight":
            ship.turn_right = value;
            break;
        case 40:
        case "ArrowDown":
            ship.go_backward = value;
            break;
        case 71:
        case "g":
            if (value) guide = !guide;
            break;
        case 32:
        case " ":
            ship.fire_on = value;
            break;
        default:
            handled_nothing = true;
    }
    if (!handled_nothing) e.preventDefault();
}
canvas.addEventListener("keydown", function(e) {
    key_handle(e, true);
}, true);
canvas.addEventListener("keyup", function(e) {
    key_handle(e, false);
}, true);
canvas.focus();

function draw() {
    asteroids.forEach(function(asteroid, i, asteroids) {
        projectiles.forEach(function(projectile, j, projectiles) {
            draw_line(context, asteroid, projectile);
        });
        draw_line(context, asteroid, ship);
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (guide) {
        draw_grid(context);
    }
    asteroids.forEach(function(asteroid) {
        asteroid.draw(context, guide);
    })
    ship.draw(context, guide);
    projectiles.forEach(function(projectile) {
        projectile.draw(context);
    });
}

function update(elapsed, canvas) {

    asteroids.forEach(function(asteroid) {
        asteroid.update(elapsed, canvas);
    });
    ship.update(elapsed, canvas);
    projectiles.forEach(function(projectile, i) {
        projectile.update(elapsed, canvas);
        if (projectile.life <= 0) {
            projectiles.splice(i, 1);
        } else {
            asteroids.forEach(function(asteroid, j) {
                if (collision(asteroid, projectile)) {
                    projectiles.splice(j, 1);
                    asteroids.splice(j, 1);
                    asteroid_split(asteroid);
                }
            })
        }
    });
    if (ship.fire_on) {
        projectiles.push(ship.projectile(elapsed));
    }
}

let previous;

function frame(timestamp) {
    if (!previous) previous = timestamp;
    let elapsed = timestamp - previous;
    update(elapsed / 1000, canvas);
    draw();
    previous = timestamp;
    window.requestAnimationFrame(frame);
}
window.requestAnimationFrame(frame);

function AsteroidsGame(id) {
    this.canvas = document.getElementById(id);
    this.c = this.canvas.getContext("2d");
    this.guide = true;
    this.asteroids = [];
    this.score = 0;
    this.damaged_mass = 500;
    this.asteroid_mass = 10000;
    this.asteroid_force = 5000000;
    this.asteroids.push(asteroid_live);
}

AsteroidsGame.prototype.create_asteroid = function() {
    return new Asteroid(
        this.canvas.width * Math.random(),
        this.canvas.height * Math.random(),
        this.asteroid_mass
    );
}

AsteroidsGame.prototype.asteroid_live_moving = function(asteroid, elapsed) {
    elapsed = elapsed || 0.016;
    asteroid.moving(Math.PI * 2 * Math.random(), this.asteroid_force, elapsed);
    asteroid.twist((Math.random() - 0.5) * this.asteroid_force * 0.01, elapsed);
}

AsteroidsGame.prototype.asteroid_live = function(elapsed) {
    let asteroid = this.create_asteroid();
    this.asteroid_live_moving(asteroid, elapsed);
    return asteroid;
}

AsteroidsGame.prototype.asteroid_split = function(asteroid) {
    this.asteroid.mass -= this.damaged_mass;
    this.score += this.damaged_mass;
    let split_rate = 0.25 + (Math.random() - 0.5) * 0.5;
    as1 = asteroid.child(this.asteroid_mass * split_rate);
    as2 = asteroid.child(this.asteroid_mass * (1 - split_rate));
    [as1, as2].forEach(function(child) {
        if (child.mass < this.damaged_mass) {
            this.score += child.mass;
        } else {
            this.asteroids.push(child);
            this.asteroid_live_moving(child, elapsed);
        }
    }, this);
}