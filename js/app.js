/*
 * Create a list that holds all of your cards
 */

let visited = [];
let openCards = [];
let moves = 0;
let startTime = 0;
let intervalId = 0;
let starsEarned = 3;

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

function init() {

	$('.deck').empty();
	clearInterval(intervalId);
	visited = [];
	openCards = [];
	moves = 0;
	updateStars(moves);
	startTime = Date.now();
	$('.time').text(getMyTime(startTime));

	intervalId = setInterval(function() {
		$('.time').text(getMyTime(startTime));
	}, 1000);


	$('.moves').text(moves);
	let shuffledCards = '';
	cards = shuffle(cards);

	for (let i = 0; i < cards.length; i++) {
		shuffledCards += "<li class=\"card clickable\"><i class=\"fa " + cards[i] + "\"></i></li>";
	}
	$('.deck').html(shuffledCards);
}

init();

$('.deck').on('click', '.clickable', function() {
	moves += 1;
	$('.moves').text(moves);
	updateStars(moves);
	$(this).addClass('open show');
	visited.push($(this));

	if( visited.length === 2) {
		if(visited[0].is(visited[1])) {
			visited[0].removeClass('open show');
			visited = [];
		}

		if(visited[0].find('i').attr('class') !== visited[1].find('i').attr('class')) {
			setTimeout(function() {
				for(let j = 0; j < visited.length; j++) {
					visited[j].addClass('wrong');
				}
				setTimeout(function() {
					for(let j = 0; j < visited.length; j++) {
						visited[j].removeClass('open show wrong');
					}			
					visited = [];
				}, 500)
			}, 500);								
		} else {
			for(let j = 0; j < visited.length; j++) {
				visited[j].addClass('match');
				visited[j].removeClass('clickable');
				openCards.push(visited[j]);
			}
			visited = [];			
		}

		if (openCards.length === cards.length) {
			let totalTime = getMyTime(startTime);
			clearInterval(intervalId);
			setTimeout(function() {
				$('.modal').removeClass('hidden');
				// $('.modal-text').html('<p>Total Moves : ' + moves + '<br /> Stars : ' + getStars().html() + '<br />Time Elapsed : ' + totalTime + '</p>')
				$('.moves-count').text(moves);
				$('.stars-count').html(getStars(starsEarned));
				$('.time-taken').text(totalTime)
			}, 500);
		}
	};
})


function getStars(goldStars) {
	let htmlStr = '';
	for(let i = 0; i < goldStars; i++) {
		htmlStr += '<ul class="result-star"><li><i class="fa fa-star"></li></ul>';
	}
	return htmlStr;
}

$('.close-modal').on('click', function closeModal() {
	$('.modal').addClass('hidden');
	init();
})

$('.restart').on('click', function() {
	init();
})

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

$(document).keypress(function(e) {
     if (e.keyCode == 27) { 
     	$('.modal').addClass('hidden');
    }
});

// intervalId = setInterval(function() {
// 	$('.time').text(getMyTime(startTime));
// }, 1000);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
