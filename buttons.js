var scales = {
    'Cmaj' : [
        {'note': 'C', 'color': 'red'},
        {'note': 'D', 'color': 'orange'},
        {'note': 'E', 'color': 'blue'},
        {'note': 'F', 'color': 'green'},
        {'note': 'G', 'color': 'violet'},
        {'note': 'A', 'color': 'green'},
        {'note': 'B', 'color': 'pink'},
        {'note': 'C', 'color': 'purple'}
    ],
    'Cmin' : ['I','J','K','L','M','N','O','P']
};

var currScale;
var defaultScale = 'Cmaj';

function changeScale(scale) {
    currScale = scales[scale];
}

function loadKeyboard() {
    //clear keyboard
    $('#keyboardContainer').html("");

    //iterate through notes in selected scale to add to keyboard
    for (var i = 0; i < currScale.length; i++) {
        var noteObj = currScale[i];
        var note = $('<button class=\"key ui inverted button massive ' + noteObj['color'] + '\" id=\"note' + i + '\">' + noteObj['note'] + '</button>');
        note.click(notePress.bind(undefined, i));
        note.prop("index",i);
        note.appendTo('#keyboardContainer');
    }

    // var chordContainer = $('button');
    // chordContainer.addClass('key ui inverted label massive');
    // chordContainer.appendTo('#keyboardContainer');
}

function notePress(index, event) {
    actOnKey(index);
}

$(document).ready(function() {
    changeScale(defaultScale);
    loadKeyboard();
});