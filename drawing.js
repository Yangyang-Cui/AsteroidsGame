function draw_grid(c, options) {
    options = options || {};
    c.save();
    c.strokeStyle = "green";
    c.fillStyle = "yellow";
    for (let i = 0; i < c.canvas.width; i += 10) {
        // every 50th line width is 1.0;
        // the others will be 0.65.
        c.lineWidth = (i % 50 === 0) ? 1.0 : 0.65;
        c.beginPath();
        // draw vertical line;
        c.moveTo(i, 0);
        c.lineTo(i, c.canvas.height);
        c.stroke();
        c.beginPath();
        // draw horizontal line
        c.moveTo(0, i);
        c.lineTo(c.canvas.width, i);
        c.stroke();
        if (i % 50 === 0) {
            // draw vertical number
            c.fillText(i, 0, i + 10);
            //draw horizontal number
            c.fillText(i, i, 10);
        }
    }
    c.restore();
}

function draw_asteroid(c, radius, shape, options) {
    options = options || {};
    c.strokeStyle = "rgb(220,150,120)";
    c.fillStyle = "rgba(100%,100%,100%, 50%)";
    c.lineWidth = 1.25;
    let angle = Math.PI * 2 / shape.length;
    let noise = options.noise;
    // Draw asteroid
    c.beginPath();
    c.save();
    for (let i = 0; i < shape.length; i++) {
        c.rotate(angle);
        c.lineTo(0, radius + radius * shape[i] * noise);
    }
    c.closePath();
    c.stroke();
    c.fill();
    c.restore();
    // Draw guide
    if (options.guide) {
        c.save();
        c.lineWidth = 0.45;
        c.strokeStyle = "ivory";
        c.beginPath();
        c.arc(0, 0, radius, 0, Math.PI * 2);
        c.stroke();
        c.restore();
    }
}

function draw_ship(c, radius, options) {
    options = options || {};
    c.save();
    c.strokeStyle = "#80ffcc";
    c.fillStyle = "#ffff00";
    c.lineWidth = 2;
    let angle = 0.25 * Math.PI;
    // Compromised
    if (options.compromised && options.guide) {
        c.save();
        c.fillStyle = "red";
        c.beginPath();
        c.arc(0, 0, radius, 0, Math.PI * 2);
        c.fill();
        c.restore();
    }
    // Draw thruster
    if (options.thruster_on) {
        c.save();
        c.strokeStyle = "#ffffff";
        c.fillStyle = "#ff66a3";
        c.lineWidth = 5;
        c.beginPath();
        c.moveTo(
            Math.cos(Math.PI - angle) * radius / 2,
            Math.sin(Math.PI - angle) * radius / 2
        );
        c.quadraticCurveTo(-2 * radius, 0,
            Math.cos(Math.PI + angle) * radius / 2,
            Math.sin(Math.PI + angle) * radius / 2
        )
        c.stroke();
        c.fill();
        c.restore();
    }
    // Draw ship
    c.beginPath();
    c.moveTo(radius, 0);
    c.quadraticCurveTo(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.cos(Math.PI - angle) * radius,
        Math.sin(Math.PI - angle) * radius);
    c.quadraticCurveTo(-0.25 * radius, 0,
        Math.cos(Math.PI + angle) * radius,
        Math.sin(Math.PI + angle) * radius);
    c.quadraticCurveTo(
        Math.cos(-angle) * radius,
        Math.sin(-angle) * radius,
        radius,
        0);
    c.stroke();
    c.fill();
    c.restore();
    // Draw guide
    if (options.guide) {
        c.save();
        c.strokeStyle = "ivory";
        c.lineWidth = 1.0;
        c.beginPath();
        c.arc(0, 0, radius, 0, Math.PI * 2);
        c.stroke();
        c.restore();
    }
}

function draw_projectile(c, radius, life) {
    c.save();
    c.fillStyle = "rgb(100%, 100%," + 100 * life + "%)";
    c.beginPath();
    c.arc(0, 0, radius * life, 0, Math.PI * 2);
    c.fill();
    c.restore();
}

function draw_line(c, obj1, obj2) {
    c.save();
    c.strokeStyle = "ivory";
    c.lineWidth = 0.75;
    c.beginPath();
    c.moveTo(obj1.x, obj1.y);
    c.lineTo(obj2.x, obj2.y);
    c.stroke();
    c.restore();
}