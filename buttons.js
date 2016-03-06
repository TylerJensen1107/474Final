var scales = {
    'Cmaj' : ['C','D','E','F','G','A','B','C'],
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
        var currNote = currScale[i];
        var note = $('<div class=key id=note' + currNote + '>' + '<span>' + currNote + '</span>' + '</div>');
        note.click(notePress.bind(undefined, i));
        note.prop("index",i);
        note.appendTo('#keyboardContainer');
    }
}

function notePress(index, event) {
    actOnKey(index);
}

$(document).ready(function() {
    changeScale(defaultScale);
    loadKeyboard();
});


