var scales = {
    'Cmaj' : ['A','B','C','D','E','F','G','H'],
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
        note.click(notePress);
        note.prop("index",i);
        note.appendTo('#keyboardContainer');
    }
}

function notePress() {
    alert($(this).html() + $(this).prop("index"));
}

$(document).ready(function() {
    changeScale(defaultScale);
    loadKeyboard();
});