// Author - Ejaz

let visited = []; // array to put two consecutive visited cards
let openCards = []; // array of open cards
let moves = 0; // total moves counter
let startTime = 0;
let intervalId = 0;
let starsEarned = 3; // starts with 3 stars

// each card icon
let cards = ["fa-diamond", "fa-diamond", "fa-anchor", "fa-anchor", 
	"fa-bolt", "fa-bolt", "fa-cube", "fa-cube", 
	"fa-leaf", "fa-leaf", "fa-bomb", "fa-bomb", 
	"fa-bicycle", "fa-bicycle",	"fa-paper-plane-o", "fa-paper-plane-o"];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// starting the game by resetting every variable
function init() {

	visited = [];
	openCards = [];
	moves = 0;

	$('.deck').empty();
	clearInterval(intervalId); // stop setInterval
	updateStars(moves); // calling the function to update the stars 

	// current time in ms
	startTime = Date.now();
	$('.time').text(getMyTime(startTime));
	$('.moves').text(moves);

	let shuffledCards = '';
	cards = shuffle(cards);

	for (let i = 0; i < cards.length; i++) {
		shuffledCards += "<li class=\"card clickable\"><i class=\"fa " + cards[i] + "\"></i></li>";
	}
	$('.deck').html(shuffledCards);

	// start the timer now
	intervalId = setInterval(function() {
		$('.time').text(getMyTime(startTime));
	}, 1000);

}

// get time in hh : mm : ss format
function getMyTime(startTime) {
	currentMilliSeconds = Date.now();
	timeElapsed = (currentMilliSeconds - startTime) / 1000; // seconds
	let hours = String(Math.floor(timeElapsed / 3600));
	let mins = String(Math.floor((timeElapsed - hours * 3600) / 60));
	let seconds = String(Math.floor(timeElapsed - hours * 3600 - mins * 60));

	return ((String(hours).length === 1 ? ("0" + hours) : hours) + 
			" : " + (mins.length === 1 ? ("0" + mins) : mins) + 
			" : " + (seconds.length === 1 ? ("0" + seconds) : seconds));
}

// for the final result pop-up, creating the final stars
function getStars(goldStars) {
	let htmlStr = '';
	for(let i = 0; i < goldStars; i++) {
		htmlStr += '<ul class="result-star"><li><i class="fa fa-star"></li></ul>';
	}
	return htmlStr;
}

// updating the stars with the number of moves
function updateStars(moves) {
	if (moves <= 25) {
		$('.stars li').each(function() {
			$(this).find('i').css('color', 'gold');
		});
		starsEarned = 3;
	}
	else if (moves > 25 && moves <= 35) {
		$('.stars li:nth-last-child(1)').find('i').css('color', 'black');
		starsEarned = 2;
	} else if (moves > 35) {
		$('.stars li:nth-last-child(2)').find('i').css('color', 'black');
		starsEarned = 1;
	}
}


// handling each click on the card
$('.deck').on('click', '.clickable', function() {
	moves += 1;
	$('.moves').text(moves);
	updateStars(moves);

	// to animate the opening of the card
	$(this).addClass('open show');
	visited.push($(this)); // collecting the visited cards

	if( visited.length === 2) {

		// to handle clicking of the same card twice
		if(visited[0].is(visited[1])) {
			visited[0].removeClass('open show');
			visited = [];
		}

		// checking if the cards have the same icon
		if(visited[0].find('i').attr('class') !== visited[1].find('i').attr('class')) {
			setTimeout(function() {
				// animate when the cards do not match
				for(let j = 0; j < visited.length; j++) {
					visited[j].addClass('wrong');
				}
				setTimeout(function() {
					// close the cards
					for(let j = 0; j < visited.length; j++) {
						visited[j].removeClass('open show wrong');
					}			
					visited = [];
				}, 500)
			}, 500);								
		} else {
			// animate when the cards match
			for(let j = 0; j < visited.length; j++) {
				visited[j].addClass('match');
				visited[j].removeClass('clickable');
				openCards.push(visited[j]);
			}
			visited = [];			
		}

		// when all the cards are open, display the final pop-up
		if (openCards.length === cards.length) {
			let totalTime = getMyTime(startTime);
			clearInterval(intervalId);
			setTimeout(function() {
				$('.modal').removeClass('hidden');
				$('.moves-count').text(moves);
				$('.stars-count').html(getStars(starsEarned));
				$('.time-taken').text(totalTime)
			}, 500);
		}
	};
})

// closing the pop-up and restarting the game
$('.close-modal').on('click', function closeModal() {
	$('.modal').addClass('hidden');
	init();
})

// restarting the game
$('.restart').on('click', function() {
	init();
})

// remove pop-up screen with escape key
$(document).keypress(function(e) {
     if (e.keyCode == 27) { 
     	$('.modal').addClass('hidden');
    }
});

// start the game
init();

