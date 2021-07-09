let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    },
    autoCenter: true
};


let game = new Phaser.Game(config);

let frog,mumfrog;
let left,right,up,down;
let tweenHeart;

function init() {
   
}

function preload() {
    this.load.image('background','./assets/images/FroggerBackground.png');
    this.load.image('frog','./assets/images/Frog.png');
    this.load.image('mumfrog','./assets/images/MumFrog.png');
    this.load.image('heart','./assets/images/heart.png');

}

function create() {
    //interactivité selon les touches directionnelles:
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); 
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); 
    
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); 
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); 
    
    backgroundImage = this.add.image(0,0,'background');
    backgroundImage.setOrigin(0,0);
    
    frog = this.add.image(240,300,'frog');

    mumfrog = this.add.image(Phaser.Math.Between(0,460),0,'mumfrog')
    mumfrog.setOrigin(0,0);

    let heart = this.add.image(240,160,'heart');
    heart.setScale(0.0);

    tweenHeart = this.tweens.add({
        targets: heart,
        scale: 3.5, 
        duration: 2000, 
        ease: 'Linear', 
        yoyo: true,
        loop: 0,
        paused:true,
        });



}

function update() {
   if(Phaser.Input.Keyboard.JustDown(down)&& frog.y <304){
       frog.y += 16;
       frog.setAngle(180);
   }

   if(Phaser.Input.Keyboard.JustDown(up)&& frog.y > 16){
       frog.y -= 16;
       frog.setAngle(0);
   }

   if(Phaser.Input.Keyboard.JustDown(left)&& frog.x > 16){ 
        frog.x -= 16;
        frog.setAngle(-90);
   }

   if(Phaser.Input.Keyboard.JustDown(right)&& frog.x < 464){
        frog.x += 16;
        frog.setAngle(90);
   }

   if(Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(),mumfrog.getBounds())){
       frog.x = -100;
       tweenHeart.play();
       
   
   } 

}