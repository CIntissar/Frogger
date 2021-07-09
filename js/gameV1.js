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
let car = [];
let onWelcomeScreen = true;
let timerText;
let counter;
let countdownTimer;
let deadFrog;
let savedFrog = 0;
let jumpSound;
let traficSound;
let smashSound;
let counterSafeText;
let life = 3;
let lifeImage = [];

function init() {
   
}

function preload() {
    this.load.image('titleScreen','./assets/images/TitleScreen.png');
    this.load.image('playButton','./assets/images/playButton.png');

    this.load.image('background','./assets/images/FroggerBackground.png');
    this.load.image('frog','./assets/images/Frog.png');
    this.load.image('death','./assets/images/deadFrog.png');
    this.load.image('mumfrog','./assets/images/MumFrog.png');
    this.load.image('heart','./assets/images/heart.png');
    this.load.image('car0','./assets/images/car.png');
    this.load.image('car1','./assets/images/F1-1.png');
    this.load.image('car2','./assets/images/snowCar.png');
    this.load.image('life','./assets/images/life.png');

    //Music
    this.load.audio('paf', './assets/audio/smashed.wav');
    this.load.audio('jump', './assets/audio/coaac.wav');
    this.load.audio('trafic', './assets/audio/trafic.wav');

    //font
    loadFont('carterOne','./assets/CarterOne.ttf');
}

function create() {

    //interactivité selon les touches directionnelles:
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); 
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); 
    
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); 
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); 
    
    backgroundImage = this.add.image(0,0,'background');
    backgroundImage.setOrigin(0,0);
    
    counterSafeText = this.add.text(400,5,'',{ fontFamily: 'carterOne', fontSize: 15, color: '#ffffff',});
    

    timerText = this.add.text(420, 18, "", { fontFamily: 'carterOne', fontSize: 15, color: '#ffffff'});
    countdownTimer = this.time.addEvent({
        delay: 1000,
        callback: deathType, 
        callbackScope: this, 
        repeat: -1,
        paused: true
        });

    
    frog = this.add.image(241,296,'frog');
    deadFrog = this.add.image(-100,100,'death');

    let nbrCaseMumFrog = Phaser.Math.Between(0,20);

    mumfrog = this.add.image(nbrCaseMumFrog * 16,0,'mumfrog');
    mumfrog.setOrigin(0,0);

    for(let j=0; j<3; j++){
        for (let i=0; i<10; i++) {
            let index = i + j * 10;
            let randomSpace = Phaser.Math.Between(-15,15);
            let randomIndex = Phaser.Math.Between(0,2);
            car[index] = this.physics.add.image(-50 + i *55 + randomSpace,192 + j * 32,'car'+ randomIndex);
            car[index].setOrigin(0,0);
            car[index].setVelocity(100,0);
        }
    }
    
    for(let j=0; j<3; j++){
        for (let i=0; i<10; i++) {
            let index = 30 + i + j * 10;
            let randomSpace = Phaser.Math.Between(-10,10);
            let randomIndex = Phaser.Math.Between(0,2);
            car[index] = this.physics.add.image(480 + i *55 + randomSpace, 64 + j * 32,'car'+ randomIndex);
            car[index].setOrigin(0,0);
            car[index].setAngle(180);
            car[index].setVelocity(-100,0);
        }
    }

    let heart = this.add.image(240,160,'heart');
    heart.setScale(0.0);

    tweenHeart = this.tweens.add({
        targets: heart,
        scale: 3.5, 
        duration: 2000, 
        ease: 'Linear', 
        yoyo: false,
        loop: 0,
        paused:true,
        });

    titleScreen = this.add.image(0,0,'titleScreen');
    titleScreen.setOrigin(0,0);
    titleScreen.setScale(0.68);
    titleScreen.setVisible(true);

    playButton = this.add.image(240,280,'playButton').setInteractive();
    playButton.setScale(0.2);
    playButton.setVisible(true);
    playButton.on('pointerdown', gameStart);

    scoreText = this.add.text(100,10, '', { fontFamily: 'carterOne', fontSize: 20, color: '#000000'});


    jumpSound = this.sound.add('jump');
    smashSound = this.sound.add('paf');
    traficSound = this.sound.add('trafic');
    

}

function update() {

    counterSafeText.text = "Score: " + savedFrog;

    for(let i=0; i<life; i++){
        lifeImage[i]= this.add.image(420 + i * 10,40,'life');
    }

    if(!onWelcomeScreen){
        if(Phaser.Input.Keyboard.JustDown(down)&& frog.y <304){
            frog.y += 16;
            frog.setAngle(180);
            jumpSound.play();
         }
     
         if(Phaser.Input.Keyboard.JustDown(up)&& frog.y > 16){
            frog.y -= 16;
            frog.setAngle(0);
            jumpSound.play();
         }
     
         if(Phaser.Input.Keyboard.JustDown(left)&& frog.x > 16){ 
             frog.x -= 16;
             frog.setAngle(-90);
             jumpSound.play();
         }
     
         if(Phaser.Input.Keyboard.JustDown(right)&& frog.x < 464){
             frog.x += 16;
             frog.setAngle(90);
             jumpSound.play();
         }
     
    }
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(),mumfrog.getBounds())){
       frog.x = -100;
       tweenHeart.play();
       savedFrog++;
       setTimeout(reborn,1000)

    } 


   for (let i=0; i<60; i++) {
        if(car[i].x > 500 && i<30){
        car[i].x = -50; //+ Phaser.Math.Between(0,46);
        }
        else if(car[i].x < 0 && i > 30){
         car[i].x = 480;  
        }

        if(Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(),car[i].getBounds())){
        smashSound.play();
        deadFrog.setPosition(frog.x,frog.y);
        life--;

        frog.x = -100;

        setTimeout(reborn,2000)
        }
    }
}

function gameStart(){
    titleScreen.setVisible(false);
    playButton.setVisible(false);    
    onWelcomeScreen = false;
    countdownTimer.paused = false;
    scoreText.setVisible(false);
    savedFrog = 0;
    counter = 60;
    life = 3;

    traficSound.play({loop:true});
}

function loadFont(name, url) { 
    var newFont = new FontFace(name, `url(${url})`); 
    newFont.load().then(function (loaded) { 
    document.fonts.add(loaded); 
    }).catch(function (error) { 
    return error; 
    }); 
} 

function deathType(){
    counter--;
    timerText.text = counter
    if(counter == 0 || life == 0) gameOver();
    
}

function reborn(){
    frog.setPosition(241,296);
    deadFrog.setPosition(-100,100);
}

function gameOver(){
    countdownTimer.paused = true;
    titleScreen.setVisible(true);
    playButton.setVisible(true);
    scoreText.text = "Vous avez sauvé " + savedFrog + " grenouille(s)!"
    scoreText.setVisible(true);


}