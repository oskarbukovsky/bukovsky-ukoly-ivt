//timer
var seconds = 0;

var el = document.getElementById('seconds-counter');

function incrementSeconds() {
    seconds += 1;
    
    el.innerText = "You have wasted " + seconds + " seconds by being on this awesome page";
}
var cancel = setInterval(incrementSeconds, 1000);
