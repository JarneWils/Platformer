// background info
class Sprite {
    constructor({position, imageSrc, frameRate = 1, frameBuffer = 1, scale = 1}){
        // frame rate standaard is 1, in script.js kan je frameRate nu aanpassen bij het importeren van een image
        // frame buffer is 6 en bepaald de snelheid van de animatie
        this.position = position;
        this.scale = scale;
        this.loaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.width = this.image.width / this.frameRate * this.scale;
            this.height = this.image.height * this.scale;
            this.loaded = true;
        };
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elepsedFrames = 0;
    };
    draw() {
        if (!this.image) return
        const cropbox = {
            position: {
                x: this.currentFrame * this.image.width / this.frameRate,
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        };
        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        );
    };
    update() {
        this.draw();
        this.updateFrames();
    };
    updateFrames(){
        this.elepsedFrames++;
        if(this.elepsedFrames % this.frameBuffer === 0) {
            if(this.currentFrame < this.frameRate - 1)
            this.currentFrame++;
            else
            this.currentFrame = 0;
        }
        
    };
};




//player info
class Player extends Sprite{
    constructor({position, collisionBlocks, imageSrc, frameRate, scale = 1, animations}) { // Hier kan je de player scalen
        super({imageSrc, frameRate, scale});
        //positie
        this.position = position;
        //snelheid
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 100;
        this.height = 100;
        this.collisionBlocks = collisionBlocks;
        this.isJumping = false;

        //animaties regelen
        this.animations = animations;
        this.lastDirection = 'right';

        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;
        }

        // camera beweging box
        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 400,
            height: 160,
        }
    };

    // wisselen tussen sprites (animeren)
    switchSprite(key) {
        if(this.image === this.animations[key].image || this.loaded === false)
            return
        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    };

    updateCameraBox() {
        this.cameraBox = {
            position: {
                x: this.position.x - 250,
                y: this.position.y - 150,
            },
            width: 600,
            height: 400,
        };
    };
    panCameraToLeft({canvas, camera}) {
        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;
        if (cameraBoxRight >= canvas.width){
            camera.position.x -= this.velocity.x;
        };
    };

    // player wordt getekend in sprite class
    update() {
        this.updateFrames();

        this.updateCameraBox();
        c.fillStyle = 'rgba(0, 255, 0, 0.5)';
        c.fillRect(
        this.cameraBox.position.x,
        this.cameraBox.position.y,
        this.cameraBox.width,
        this.cameraBox.height)

        /*
        c.fillStyle = 'rgba(0, 255, 0, 0.5)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        */
       

        this.draw();
        // collision with bottom
        this.position.x += this.velocity.x;
        this.checkForHorizontalCollisions();
        this.applyGravity();
        this.checkForVerticalCollisions();
    };
    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if(
                collision({ // functie uitgeschreven in function.js
                    object1: this,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0; // stop met links/rechts bewegen bij collision
                    this.position.x = collisionBlock.position.x - this.width -0.01 ; // bij collision positie links van een blokje zetten
                    break
                };
                if (this.velocity.x < 0) {
                    this.velocity.x = 0; // stop met links/rechts bewegen bij collision
                    this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01 ; // bij collision positie rechts van een blokje zetten
                    break
                };
            };
        };
    };
    applyGravity() {
        // add gravity
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    };
    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if(
                collision({ // functie uitgeschreven in function.js
                    object1: this,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0; // stop met stijgen/dalen bij collision
                    this.position.y = collisionBlock.position.y - this.height -0.01 ;
                    this.isJumping = false; // bij collision positie op een blokje zetten
                };
                if (this.velocity.y < 0) {
                    this.velocity.y = 0; // stop met stijgen/dalen bij collision
                    this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01 ; // bij collision positie onder een blokje zetten
                };
            };
        };
    };
};




// collisionblok van 16px op 16px maar de map is gerenderd op 400% dus doe je 16*4=64
class CollisionBlock {
    constructor({position, imageSrc}){
        this.position = position;
        this.width = 64;
        this.height = 64
    };
    draw() {
        
        c.fillStyle = 'rgba(255, 0, 0, 0.5)';
        c.fillRect(this.position.x, this.position.y,  this.width, this.height);
        
    };
    update() {
        this.draw();
    };
};