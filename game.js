function collision(obj1, obj2) {
    return distance(obj1, obj2) < (obj1.radius + obj2.radius);
}

function distance(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

function AsteroidsGame(id) {
    this.canvas = document.getElementById(id);
    this.c = this.canvas.getContext("2d");
    this.guide = false;
    this.damaged_mass = 1000;
    this.asteroid_mass = 10000;
    this.asteroid_force = 5000000;
    this.ship_mass = 10;
    this.move_power = 1000;
    this.projectile_force = 200;
    this.ship = new Ship(
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.ship_mass,
        20,
        this.move_power,
        this.projectile_force
    );
    this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
    this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
    this.canvas.focus();
    this.health_indicator = new Indicator(
        "Health", 15, 15, 100, 15
    );
    this.score_indicator = new NumberIndicator(
        "Score", this.canvas.width - 100, 15
    );
    this.level_indicator = new NumberIndicator(
        "Level", this.canvas.width / 2, 15
    );
    this.game_over_indicator = new GameOverIndicator(
        "GAME OVER", "Please press space bar to play again.",
        this.canvas.width / 2,
        this.canvas.height * 0.4
    );
    this.reset();

    window.requestAnimationFrame(this.frame.bind(this));
}

AsteroidsGame.prototype.reset = function() {
    this.score = 0;
    this.projectiles = [];
    this.asteroids = [];
    this.level = 0;
    this.total_health = 2;
    this.health = this.total_health;
    this.level_up();
}

AsteroidsGame.prototype.level_up = function() {

    this.level += 1;
    for (let i = 0; i < this.level; i++) {
        this.asteroids.push(this.asteroid_live());
    }


}

AsteroidsGame.prototype.keyDown = function(e) {
    this.key_handle(e, true);
}
AsteroidsGame.prototype.keyUp = function(e) {
    this.key_handle(e, false);
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

AsteroidsGame.prototype.split_asteroid = function(asteroid, elapsed) {
    asteroid.mass -= this.damaged_mass;
    this.score += this.damaged_mass;
    let split_rate = 0.25 + Math.random() * 0.5;
    as1 = asteroid.child(asteroid.mass * split_rate);
    as2 = asteroid.child(asteroid.mass * (1 - split_rate));
    [as1, as2].forEach(function(child) {
        if (child.mass <= this.damaged_mass) {
            this.score += child.mass;
        } else {
            this.asteroids.push(child);
            this.asteroid_live_moving(child, elapsed);
        }
    }, this);
}

AsteroidsGame.prototype.key_handle = function(e, value) {
    let handled_nothing = false;
    switch (e.key || e.keyCode) {
        case 38:
        case "ArrowUp":
            this.ship.go_forward = value;
            break;
        case 37:
        case "ArrowLeft":
            this.ship.turn_left = value;
            break;
        case 39:
        case "ArrowRight":
            this.ship.turn_right = value;
            break;
        case 40:
        case "ArrowDown":
            this.ship.go_backward = value;
            break;
        case 71:
        case "g":
            if (value) this.guide = !this.guide;
            break;
        case 32:
        case " ":
            if (this.health <= 0) {
                this.reset();
            } else {
                this.ship.fire_on = value;
            }
            break;
        default:
            handled_nothing = true;
    }
    if (!handled_nothing) e.preventDefault();
}

AsteroidsGame.prototype.draw = function() {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.guide) {
        draw_grid(this.c);
        this.asteroids.forEach(function(asteroid) {
            draw_line(this.c, asteroid, this.ship);
            this.projectiles.forEach(function(projectile) {
                draw_line(this.c, asteroid, projectile);
            }, this);
        }, this);
    }
    this.health_indicator.draw(this.c, this.health, this.total_health);
    this.score_indicator.draw(this.c, this.score);
    this.level_indicator.draw(this.c, this.level);
    this.asteroids.forEach(function(asteroid) {
        asteroid.draw(this.c, this.guide);
    }, this);
    if (this.health <= 0) {
        this.game_over_indicator.draw(this.c);
        return;
    }
    this.ship.draw(this.c, this.guide);
    this.projectiles.forEach(function(projectile) {
        projectile.draw(this.c);
    }, this);
}

AsteroidsGame.prototype.update = function(elapsed) {
    if (this.asteroids.length == 0) {
        this.level_up();
    }
    this.ship.compromised = false;
    this.asteroids.forEach(function(asteroid) {
        asteroid.update(elapsed, this.canvas);
        if (collision(asteroid, this.ship)) {
            this.ship.compromised = true;
        }
    }, this);
    if (this.health <= 0) {
        return;
    }
    if (this.ship.compromised) {
        this.health -= Math.min(elapsed, this.health);
    }
    this.ship.update(elapsed, this.canvas);
    this.projectiles.forEach(function(projectile, i) {
        projectile.update(elapsed, this.canvas);
        if (projectile.life <= 0) {
            this.projectiles.splice(i, 1);
        } else {
            this.asteroids.forEach(function(asteroid, j) {
                if (collision(projectile, asteroid)) {
                    this.asteroids.splice(j, 1);
                    this.projectiles.splice(i, 1);
                    this.split_asteroid(asteroid);
                }
            }, this);
        }
    }, this);
    if (this.ship.fire_on && this.ship.projectile_reload) {
        this.projectiles.push(this.ship.projectile(elapsed));
    }

}

AsteroidsGame.prototype.frame = function(timestamp) {
    if (!this.previous) this.previous = timestamp;
    let elapsed = timestamp - this.previous;
    this.update(elapsed / 1000);
    this.draw();
    this.previous = timestamp;
    window.requestAnimationFrame(this.frame.bind(this));
}