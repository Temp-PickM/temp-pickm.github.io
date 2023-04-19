import * as v from "./modules/vectorMath.js";

var simOBJ;
var spawners = [];
var particles = [];
var physicTime = 8;
var simTime = 0;
var dt = (1/50)/physicTime;

var camera;

var fallspeed = 0.980665/physicTime;

var spawnPerspawner = 2000/8;

var simMaxX = (window.innerWidth * 1);
var simMaxY = (window.innerHeight * 1);
var tileSize = 10;
var grid = [];
var tempGrid = [];

var dirx1 = 0;
var diry1 = 0;
var dirx2 = 0;
var diry2 = 0;
var dirx3 = 0;
var diry3 = 0;

var preTime = 0;
var time = 0;
var delta = 0;

var avgx = 0;
var avgy = 0;

var rC = [100, 150, 75];//[200, 100, 100];
var gC = [150, 225, 75];//[100, 200, 100];
var bC = [75, 225, 150];//[100, 100, 200];
var aC = [75, 225, 100];

function startGame() {
    gamescreen.start();
    gamescreen.x = 0;
    gamescreen.y = 0;
    camera = new cam(simMaxX/2, simMaxY/2, 1);
    simOBJ = new sim();
    for (let i = 0; i < (simMaxX / tileSize); i++) {
        for (let index = 0; index < (simMaxY / tileSize); index++) {
            tempGrid.push(new tiles((i * tileSize), (index * tileSize), tileSize));
        }
        grid.push(tempGrid);
        tempGrid = [];
    }

    particles.push(new object(new v.Vector2(5, 5), new v.Vector2(5, 5), 5, 100, 0, [10, 10, 10]));

    //particles.push(new object(new v.Vector2(480, 500), new v.Vector2(479.5, 500.5), 5, 100, 0, [255, 255, 255]));
    //particles.push(new object(new v.Vector2(500, 480), new v.Vector2(500.5, 479.5), 5, 100, 0, [255, 255, 255]));

    spawners.push(new spawner(30, 55, 28.5, 55, spawnPerspawner-1, 100, 5, rC));
    spawners.push(new spawner(30, 75, 28.5, 75, spawnPerspawner-1, 100, 5, rC));

    spawners.push(new spawner(30, simMaxY - 55, 28.5, simMaxY - 55, spawnPerspawner-1, 100, 5, gC));
    spawners.push(new spawner(30, simMaxY - 75, 28.5, simMaxY - 75, spawnPerspawner-1, 100, 5, gC));

    spawners.push(new spawner(simMaxX - 30, 55, simMaxX - 28.5, 55, spawnPerspawner-1, 100, 5, bC));
    spawners.push(new spawner(simMaxX - 30, 75, simMaxX - 28.5, 75, spawnPerspawner-1, 100, 5, bC));

    spawners.push(new spawner(simMaxX - 30, simMaxY - 55, simMaxX - 28.5, simMaxY - 55, spawnPerspawner-1, 100, 5, aC));
    spawners.push(new spawner(simMaxX - 30, simMaxY - 75, simMaxX - 28.5, simMaxY - 75, spawnPerspawner-1, 100, 5, aC));
}

var gamescreen = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 20);
        window.addEventListener("mousemove", function (a){
            gamescreen.x = a.pageX;
            gamescreen.y = a.pageY;
        });
    },
    clear : function() {
        this.context.fillStyle = "rgba(0, 0, 0, 0.75)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function spawner(x, y, px, py, max, mass, radius, colour) {
    this.max = max;
    this.mass = mass;
    this.x = x;
    this.y = y;
    this.px = px;
    this.py = py;
    this.shift = 0;
    this.radius = radius;
    this.colour = colour;
    this.summon = function() {
        particles.push(new object(new v.Vector2(this.x, this.y), new v.Vector2(this.px, this.py), this.radius, this.mass, particles.length, this.colour));
    }
}

function cam(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.update = function(inx, iny, inz) {
        this.x += inx;
        this.y += iny;
        this.z += inz;
    }
    this.forcePosition = function(inx, iny) {
        this.x = inx;
        this.y = iny;
    }
}

function object(pos, prePos, radius, mass, index, colour) {
    this.pos = {
        x : pos.x,
        y : pos.y
    };
    this.prePos = {
        px : prePos.x,
        py : prePos.y
    };
    this.colour = colour;
    this.acc = new v.Vector2(0, 0);
    this.r = radius;
    this.mass = mass;
    this.index = index;
    this.newPos = function(dt) {
        this.vPos = new v.Vector2(this.pos.x, this.pos.y);
        this.vPrePos = new v.Vector2(this.prePos.px, this.prePos.py);
        this.vel = v.VectorSubtract(this.vPos, this.vPrePos, 2);
        this.prePos.px = this.pos.x;
        this.prePos.py = this.pos.y;
        this.vel = v.VectorAdd(this.vel, v.ScaleVector(this.acc, dt, 2), 2);
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.acc = v.VectorSubtract(this.acc, this.acc, 2);
    }
    this.update = function(cx, cy, z) {
        this.tx = ((this.pos.x - cx)/z) + (gamescreen.canvas.width/2);
        this.ty = ((this.pos.y - cy)/z) + (gamescreen.canvas.height/2);
        var ctx = gamescreen.context;
        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.r/z, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb("+String(this.colour[0])+", "+String(this.colour[1])+", "+String(this.colour[2])+")"//Math.abs(this.vel.x * 25)+Math.abs(this.vel.y * 25)+this.colour[0])+", "+String(Math.abs(this.vel.x * 25)+Math.abs(this.vel.y * 25)+this.colour[1])+", "+String(Math.abs(this.vel.x * 25)+Math.abs(this.vel.y * 25)+this.colour[2])+")"//this.colour;
        ctx.fill();
    }
}

function tiles(x, y, len) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.hasIndex = false;
    this.indices = [];
    this.getIndex = function(x, y, index) {
        if (x >= this.x && x <= (this.x + this.len)) {
            if (y >= this.y && y <= (this.y + this.len)) {
                this.indices.push(index);
                this.hasIndex = true;
            }
        }
    }
}

function sim() {
    this.calcDirDist = function(x1, x2, y1, y2, r1, r2) {
        this.dist = Math.sqrt(Math.pow((x1-x2), 2)+Math.pow((y1-y2), 2));
        this.dir = Math.atan2((y1-y2), (x1-x2));
        this.radii = r1 + r2;
    }
    this.calForces = function(inSx1, inSy1, inSx2, inSy2, m1, m2) {
        this.tX1 = (((inSx1) + (inSx2)) / 2);
        this.tY1 = (((inSy2) + (inSy1)) / 2);

        this.tX2 = (((inSx2) + (inSx1)) / 2);
        this.tY2 = (((inSy1) + (inSy2)) / 2);
    }
    this.updateText = function(x, y, text) {
        this.ctx = gamescreen.context;
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = "30px Ariel";
        this.ctx.fillText(text, x, y);
    }
    this.updateCircles = function(x, y, colour, radius) {
        this.ctx = gamescreen.context;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = "rgba("+String(colour[0])+", "+String(colour[1])+", "+String(colour[2])+", "+String(colour[3])+")";
        this.ctx.fill();
    }
}

function baseUpdate() {
    for (let index = 0; index < spawners.length; index++) {
        if (simTime <= spawners[index].max*1 && simTime % 1 == 0) {
            spawners[index].summon();
        }
    }

    simTime += 1;

    dirx1 = (100 * Math.cos(simTime/10));
    diry1 = (100 * Math.sin(simTime/10));
    dirx2 = (100 * Math.cos(simTime/25)) + (50 * Math.cos(simTime/5));
    diry2 = (100 * Math.sin(simTime/25)) + (50 * Math.sin(simTime/5));
    dirx3 = (150 * Math.cos(simTime/50)) + (130 * Math.cos(simTime/50)) + (50 * Math.cos(simTime/6));
    diry3 = (150 * Math.sin(simTime/50)) + (130 * Math.sin(simTime/50)) + (50 * Math.sin(simTime/6));

    for (let indrex = 0; indrex < physicTime; indrex++) {
        for (let index = 0; index < grid.length; index++) {
            for (let i = 0; i < grid[index].length; i++) {
                grid[index][i].hasIndex = false;
                grid[index][i].indices = [];
            }
        }
        //particles[0].pos.x = gamescreen.x;
        //particles[0].pos.y = gamescreen.y;
        for (let index = 0; index < particles.length; index++) {
            if (indrex % 8 == 0 && index != 0) {
                simOBJ.calcDirDist(particles[index].pos.x, ((camera.x + (gamescreen.x - (gamescreen.canvas.width/2)) * camera.z)), particles[index].pos.y, ((camera.y + (gamescreen.y - (gamescreen.canvas.height/2)) * camera.z)), 1, 1);
                particles[index].acc = v.VectorSubtract(particles[index].acc, new v.Vector2(physicTime * (-5000/(5+((simOBJ.dist * simOBJ.dist)))) * Math.cos(simOBJ.dir), physicTime * (-5000/(5+((simOBJ.dist * simOBJ.dist)))) * Math.sin(simOBJ.dir)), 2)
            }
            
            particles[index].acc = v.VectorSubtract(particles[index].acc, new v.Vector2(0, fallspeed), 2);
            
            simOBJ.calcDirDist(particles[index].pos.x, (simMaxX/5)+(dirx1), particles[index].pos.y, (simMaxY/2)+(diry1), particles[index].r, particles[index].r);
            particles[index].acc = v.VectorSubtract(particles[index].acc, new v.Vector2(((250)/(simOBJ.dist + 10)) * Math.cos(simOBJ.dir), ((250)/(simOBJ.dist + 10)) * Math.sin(simOBJ.dir)), 2)
            particles[index].acc = v.VectorSubtract(particles[index].acc, new v.Vector2(((-10000)/((simOBJ.dist * simOBJ.dist) + 10)) * Math.cos(simOBJ.dir), ((-10000)/((simOBJ.dist * simOBJ.dist) + 10)) * Math.sin(simOBJ.dir)), 2)


            simOBJ.calcDirDist(particles[index].pos.x, (simMaxX/1.25)+(dirx2), particles[index].pos.y, (simMaxY/2)+(diry2), particles[index].r, particles[index].r);
            particles[index].acc = v.VectorSubtract(particles[index].acc, new v.Vector2(((250)/(simOBJ.dist + 10)) * Math.cos(simOBJ.dir), ((250)/(simOBJ.dist + 10)) * Math.sin(simOBJ.dir)), 2)
            
            simOBJ.calcDirDist(particles[index].pos.x, (simMaxX/2)+(dirx3), particles[index].pos.y, (simMaxY/2)+(diry3), particles[index].r, particles[index].r);
            particles[index].acc = v.VectorSubtract(particles[index].acc, new v.Vector2(((-2500)/((simOBJ.dist * simOBJ.dist) + 10)) * Math.cos(simOBJ.dir), ((-2500)/((simOBJ.dist * simOBJ.dist) + 10)) * Math.sin(simOBJ.dir)), 2)
            
            particles[index].newPos(dt);
            if (particles[index].pos.y >= simMaxY - particles[index].r) {
                particles[index].pos.y = simMaxY - particles[index].r;
            }
            if (particles[index].pos.y <= 0 + particles[index].r) {
                particles[index].pos.y = 0 + particles[index].r;
            }
            if (particles[index].pos.x >= simMaxX - particles[index].r) {
                particles[index].pos.x = simMaxX - particles[index].r;
            }
            if (particles[index].pos.x <= 0 + particles[index].r) {
                particles[index].pos.x = 0 + particles[index].r;
            }

            var ix = Math.trunc(particles[index].pos.x / tileSize);
            var iy = Math.trunc(particles[index].pos.y / tileSize);

            grid[ix][iy].getIndex(particles[index].pos.x, particles[index].pos.y, index);
        }
        for (let index = 0; index < grid.length-1; index++) {
            for (let i = 0; i < grid[index].length-1; i++) {
                var indices = [];
                for (let item = -1; item < 1; item++) {
                    for (let tem = -1; tem < 1; tem++) {
                        for (let t = 0; t < grid[index - item][i - tem].indices.length; t++) {
                            indices.push(grid[index - item][i - tem].indices[t]);
                        }
                    }
                }
                for (let it = 0; it < indices.length; it++) {
                    for (let is = 0; is < indices.length; is++) { 
                        if (indices[it] != indices[is]) {
                            simOBJ.calcDirDist(particles[indices[it]].pos.x, particles[indices[is]].pos.x, particles[indices[it]].pos.y, particles[indices[is]].pos.y, particles[indices[it]].r, particles[indices[is]].r);
                            if (simOBJ.dist < simOBJ.radii) {
                                var minDist = simOBJ.radii - simOBJ.dist
                                particles[indices[it]].pos.x += (minDist/2) * Math.cos(simOBJ.dir);
                                particles[indices[it]].pos.y += (minDist/2) * Math.sin(simOBJ.dir);
                                particles[indices[is]].pos.x -= (minDist/2) * Math.cos(simOBJ.dir);
                                particles[indices[is]].pos.y -= (minDist/2) * Math.sin(simOBJ.dir);
                            }
                        }
                    }
                }
            }
        }
    }
}

function updateVisuals() {
    for (let index = 0; index < particles.length; index++) {
        particles[index].update(camera.x, camera.y, camera.z);
    };
    //simOBJ.updateText(10, 30, "Particles: "+String(particles.length));
    //simOBJ.updateText(10, 60, "Sim Time: "+String(simTime));

    preTime = time;
    time = window.performance.now()/20;
    delta = Math.round((time - preTime)* 1000)/1000;
    //simOBJ.updateText(10, 90, "Delta: "+String(delta));
    //simOBJ.updateCircles((simMaxX/5)+(dirx1), (simMaxY/2)+(diry1), [50, 50, 255, 0.75], 15);
    //simOBJ.updateCircles((simMaxX/1.25)+(dirx2), (simMaxY/2)+(diry2), [50, 50, 255, 0.75], 15);
    //simOBJ.updateCircles((simMaxX/2)+(dirx3), (simMaxY/2)+(diry3), [255, 50, 50, 0.75], 15);
    avgx = 0;
    avgy = 0;
    for (let i = 0; i < particles.length; i++) {
        avgx += particles[i].pos.x;
        avgy += particles[i].pos.y;
    }
    avgx /= particles.length;
    avgy /= particles.length;    
    //simOBJ.updateCircles(avgx, avgy, [0, 255, 0, 0.5], 20);
}

function updateGame() {
    gamescreen.clear();
    baseUpdate();
    updateVisuals();
}

startGame();
