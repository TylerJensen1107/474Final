var context = new AudioContext();
pressed_keys = {};
oscillators = {};
gains = {};

for(var i = 0; i < 10; i++) {
    var vco = context.createOscillator();
    vco.type = vco.SINE;
    vco.frequency.value = 0;
    vco.start(0);
    oscillators[i] = vco;
}

for(var i = 0; i < 10; i++) {
    var vca = context.createGain();
    vca.gain.value = 0;
    

    /* Connections */
    oscillators[i].connect(vca);
    vca.connect(context.destination);
    vca.gain.value = 0;

    gains[i] = vca;
}

var chords = ["I", "ii", "iii", "IV", "V", "vi"];

var frequencyOf = {0 : 130.81,
                1: 146.83,
                2: 164.81,
                3: 174.61,
                4: 196.00,
                5: 220.00,
                6: 246.94,
                7: 261.63,
                8: 293.66,
                9: 329.63
            };

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

function playNote(note, frequency) {
    console.log(note);
  oscillators[note].frequency.value = frequency;
  gains[note].gain.value = 1;
  pressed_keys[note] = true;
}

function stopNote(note, _) {
  delete pressed_keys[note];
  gains[note].gain.value = 0;
}

function keyListener(event){ 
    event = event || window.event; 
    var key = event.key || event.which || event.keyCode;
    console.log(key);
}

document.onkeydown = function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    console.log(key);
    if(key >= 49 && key <= 57) {
        actOnKey(key - 49);
    } else if(key == 48) {
        actOnKey(9)
    }
}

function actOnKey(key) { 
    console.log('key:'+key);

    if(!pressed_keys[key])
        playNote(key, frequencyOf[key]);
    else
        stopNote(key);

    console.log(pressed_keys);
    checkChord();

    console.log(key);
    $('#note'+key).toggleClass('active');
}


function checkChord() {

    for(var i = 0; i < 8; i++) {
        if(pressed_keys[i]) {
            var triad = false;
            for(var j = 1; j < 3; j++) {
                if((pressed_keys[i % 7] || pressed_keys[i]) && (pressed_keys[(i + j*2) % 7] || pressed_keys[i + j*2]) && j == 2 && triad) {
                    console.log(i + ' ' + j + ' ' + pressed_keys);
                    console.log(chords[i] + "CHORD");
                    $('#chord').html(chords[i]);
                    return;
                }
                if((pressed_keys[i % 7] || pressed_keys[i]) && (pressed_keys[(i + j*2) % 7] || pressed_keys[i + j*2]))  triad = true;
            }
        }
    }
    $('#chord').html("chord");
}
