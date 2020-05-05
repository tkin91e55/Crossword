// A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
var crswd = (function($) {

    var helder;
    var puzzleData;
    //variable name state is occupied after returning the CrosswordDemo
    var stateJson = {
        'answeredAll' : false
    },
    channel;

    console.log("crosswordDemo init");

	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
	    puzzleData = [
		 	{
				clue: "First letter of greek alphabet",
				answer: "alpha",
				position: 1,
				orientation: "across",
				startx: 1,
				starty: 1
			},
			{
				clue: "Defines the alpha-numeric characters that are typically associated with text used in programming",
				answer: "ascii",
				position: 1,
				orientation: "down",
				startx: 1,
				starty: 1
			}
		] 

		helder = $('#puzzle-wrapper').CrosswordDemo(puzzleData);
        console.log(helder.util.checkSolved('alpha'));
        console.log(helder.testStr);
		
	})

    if (window.parent !== window) {
        channel = Channel.build({
            window: window.parent,
            origin: "*",
            scope: "JSInput"
        });

        channel.bind("getGrade", getGrade);
        channel.bind("getState", getState);
        channel.bind("setState", setState);
    }

    function getGrade() {
        // The following return value may or may not be used to grade
        // server-side.
        // If getState and setState are used, then the Python grader also gets
        // access to the return value of getState and can choose it instead to
        // grade.
        return JSON.stringify(stateJson['answeredAll']);
    }

    function getState() {
        console.log("getState");
        stateJson["answeredAll"] = true;
        puzzleData.forEach(function (item, index) {
            if (helder.util.checkSolved(item['answer']) == false) {
                stateJson["answeredAll"] = false;
            }
        });
        return JSON.stringify(stateJson);
    }

    // This function will be called with 1 argument when JSChannel is not used,
    // 2 otherwise. In the latter case, the first argument is a transaction
    // object that will not be used here
    // (see http://mozilla.github.io/jschannel/docs/)
    function setState() {
        stateStr = arguments.length === 1 ? arguments[0] : arguments[1];
        state = JSON.parse(stateStr);
    }

    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade
    };  
	
})(jQuery)