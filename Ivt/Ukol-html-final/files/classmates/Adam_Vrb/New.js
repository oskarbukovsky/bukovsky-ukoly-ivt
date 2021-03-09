

function zavri() {
    document.getElementById("close").style.display = "none";

}
function zavri2() {
    document.getElementById("close2").style.height = "1px";
    document.getElementById("nebraba").style.display = "none";
}
function zavri3() {
    document.getElementById("close2").style.height = "1px";
    document.getElementById("nebraba2").style.display = "none";
}


var i = 0;
var images = [];
var time = 1000;
images = ['merch2.jpg', 'merch3.jpg', 'merch4.jpg'];




function zmen() {
    document.slide.src = images[i];

    if (i < images.length - 1) {
        i++
    }
    else {
        i = 0;
    }
    setTimeout("zmen()", time);
}

window.onload = zmen;

var v = 0;

function zavri() {
    document.getElementById("close").style.display = "none";
    v++;
    if (v > 1) {
        document.onclick = bait();
    }

}
function zavri2() {
    document.getElementById("close2").style.height = "1px";
    document.getElementById("nebraba").style.display = "none";
    v++;
    if (v > 1) {
        document.onclick = bait();
    }
}
function zavri3() {
    document.getElementById("close2").style.height = "1px";
    document.getElementById("nebraba2").style.display = "none";
    v++;
    if (v > 1) {
        document.onclick = bait();
    }


}


function bait() {
    location.href = "https://ventolin1.bandcamp.com/merch";
}





var o=0;
var obrazky=[];
obrazky=['merch2.jpg', 'merch3.jpg', 'merch4.jpg', 'arab.jpg', 'disco.gif', 'dukaz.jpg', 'merch1.jpg','obrazek.jpg','obrazek2.jpg','obrazek3.jpg','obrazek4.jpg','okey.gif','parba.gif','Sexy.gif','Warning.gif'];


function dalsi(){
o++;
if(o>=15){
    o=0;
}
document.getElementById("obraz").src=obrazky[o];

}

function predchozi(){
o--;
if(o<0){
    o=14;

}
document.getElementById("obraz").src=obrazky[o]; 


}
