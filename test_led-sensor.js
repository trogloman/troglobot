	

    //var five = require("johnny-five"),
    var five = require("./lib/johnny-five"),
        // or "./lib/johnny-five" when running from the source
        board = new five.Board();
     
     
    //gestionnaire d'évent
    var events = require('events');
    var eventEmitter = new events.EventEmitter();
     
    //sensor values
    var sensorLeft=null;
    var sensorRight=null;
     
    //direction
    var direction=null;
     
    board.on("ready", function() {
            console.log('board ready!');
     
      // Led mapping
      ledLeft = new five.Led({ pin: 13 });
      ledFront = new five.Led({ pin: 12 });
      ledRight = new five.Led({ pin: 11 });
     
    // Photoresistors
      photoresistoLeft = new five.Sensor({
        pin: "A0",
        freq: 250
      });
      photoresistorRight = new five.Sensor({
        pin: "A1",
        freq: 250
      });
     
      // Inject the `sensor` hardware into
      // the Repl instance's context;
      // allows direct command line access
      board.repl.inject({
         pot: photoresistoLeft,
         pot: photoresistorRight
      });
     
      // "data" get the current reading from the photoresistor
      photoresistoLeft.on("data", function() {
        sensorLeft=this.value;
         sensorComp();
      });
     photoresistorRight.on("data", function() {
         sensorRight=this.value;
         sensorComp();
     });
     
    // goFront();
     
     
    });
     
    // envent listening
    eventEmitter.on('left', goLeft);
    eventEmitter.on('right', goRight);
    eventEmitter.on('front', goFront);
     
     
     
    function goFront(){
            if(direction!='front'){
                    ledOff();
                    ledFront.strobe();
                    direction='front';
                    console.log('go front...');
            }
    }
    function goLeft(){
            if(direction!='left'){
                    ledOff();
                    ledLeft.strobe();
                    direction='left';
                    console.log('go left...');
            }
    }
    function goRight(){
            if(direction!='right'){
                    ledOff();
                    ledRight.strobe();
                    direction='right';
                    console.log('go right...');
            }
    }
    function ledOff(){
             ledFront.off();
             ledLeft.off();
             ledRight.off();
    }
    function sensorComp(){
       console.log(sensorLeft+" <_> "+sensorRight);
            if(sensorLeft>(sensorRight+5)){
                    eventEmitter.emit('left');
            }else if(sensorRight>(sensorLeft+5)){
                    eventEmitter.emit('right');
            } else{
                    eventEmitter.emit('front');
            }
    }
     
    console.log('loading...');

