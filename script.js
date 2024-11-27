// CANVAS
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// map is geëxporteerd op 400% dus alles maal 4 doen
const scaledCanvas = {
    width: canvas.width * 4,
    heigt: canvas.height * 4,
};




// Collision array opsplitsen in rijen
// in dit geval is een rij van de map 60 tiles van 16px lang
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 60) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 60));
};
// filter de collision blokjes van 16px uit de opgesplitste array (gerenderd op 400% dus 16*4=64)
// elk symbool 202 is een blokje en elke 0 is niets
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 57) { // getal van een collision blokje
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 64,
                        y: y * 64 - canvas.height * 3,
                    }
                })
            );
        };
    });
});



// Hetzelfde geld voor de platform blocks
const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36));
};
const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 64,
                        y: y * 64 - canvas.height * 2,
                    }
                })
            );
        };
    });
});




// BACKGROUND
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'assets/img/map01.png', //BG IMAGE
});
const backgroundSize = {
    width: background.width = 2304,
    height: background.height = 1728,
};


// add player
const player = new Player({
    position: {
        x: 110,
        y: 0,
    },
    collisionBlocks: collisionBlocks,
    imageSrc: 'assets/img/Finn-StandingRight-Sprite.png', //CHARACTER STILSTAAN
    frameRate: 2, // aantal frames van de animatie
    animations: {
        StandingRight: {
            imageSrc: 'assets/img/Finn-StandingRight-Sprite.png', //CHARACTER STILSTAAN
            frameRate: 2, // aantal frames van de animatie
            frameBuffer: 16, // animatie snelheid
        },
        WalkingRight: {
            imageSrc: 'assets/img/Finn-WalkingRight-Sprite.png', //CHARACTER STILSTAAN
            frameRate: 2, // aantal frames van de animatie
            frameBuffer: 6, // animatie snelheid

        },
        JumpingRight: {
            imageSrc: 'assets/img/Finn-JumpingRight-Sprite.png', //CHARACTER STILSTAAN
            frameRate: 2, // aantal frames van de animatie
        },
        StandingLeft: {
            imageSrc: 'assets/img/Finn-StandingLeft-Sprite.png', //CHARACTER STILSTAAN
            frameRate: 2, // aantal frames van de animatie
            frameBuffer: 16, // animatie snelheid
        },
        WalkingLeft: {
            imageSrc: 'assets/img/Finn-WalkingLeft-Sprite.png', //CHARACTER STILSTAAN
            frameRate: 2, // aantal frames van de animatie
            frameBuffer: 6, // animatie snelheid

        },
        JumpingLeft: {
            imageSrc: 'assets/img/Finn-JumpingLeft-Sprite.png', //CHARACTER STILSTAAN
            frameRate: 2, // aantal frames van de animatie
        },
    },
});
//player key status
const keys = {
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
};

const gravity = 1;

// DRAW
function animate() {
    // herladen loop
    window.requestAnimationFrame(animate);
    // clear canvas
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Background
    c.save();
    c.translate(0, - background.height + canvas.height); // -image height
    background.update();
    c.restore();

    //floor collision blocks
    collisionBlocks.forEach(block => {
        block.update();
    });

    //platform collision blocks
    platformCollisionBlocks.forEach(block => {
        block.update();
    });

    // Player
    player.update();
    player.velocity.x = 0;
    if(keys.ArrowRight.pressed) {
        player.switchSprite('WalkingRight');
        player.velocity.x = 5;
        player.lastDirection = 'right';
    }
    else if(keys.ArrowLeft.pressed) {
        player.switchSprite('WalkingLeft');
        player.velocity.x = -5
        player.lastDirection = 'left';
    }
    else if(player.velocity.y === 0) {
        if(player.lastDirection === 'right'){
            player.switchSprite('StandingRight');
        }
        else player.switchSprite('StandingLeft');
    }

    if(player.velocity.y < 0) {
        if(player.lastDirection === 'right'){
            player.switchSprite('JumpingRight');
        }
        else player.switchSprite('JumpingLeft');
    }
    c.restore();
};

animate()

// player movement
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowUp':
            if(!player.isJumping) {
                player.velocity.y = -21;
                player.isJumping = true;
            }
            break;
    }
});
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});