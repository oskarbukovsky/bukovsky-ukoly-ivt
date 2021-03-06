$(document).ready(function() {
    $("#chat-username").text(urlParams.get("user"));
    document.getElementById("chat-conversation").scroll(0, 999999999999);

    $(".chat-icon-info").click(function() {
        var slider_width = $('.chat-right').width();
        if ($('.chat-right').css("margin-right") == slider_width + "px" && !$('.chat-right').is(':animated')) {
            $('.chat-right').animate({
                "margin-right": '-=' + slider_width
            }, {
                duration: 150,
                step: function(currentLeft) {
                    resized();
                }
            });
        } else {
            if (!$('.chat-right').is(':animated')) {
                $('.chat-right').animate({
                    "margin-right": '+=' + slider_width
                }, {
                    duration: 150,
                    step: function(currentLeft) {
                        resized();
                    }
                });
            }
        }
    });
});

function isEmpty(value) {
    return (value == null || value.length === 0);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener("resize", resized);

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("chat-send-submit").click();
    }
});

function resized() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    $(".chat-right").css("right", -$(".chat-right").outerWidth())

    $(".chat-top").width($("html").width() - ($(".chat-right").outerWidth(true) - $(".chat-right").outerWidth()) - 360);
    $(".chat-conversation").width($("html").width() - ($(".chat-right").outerWidth(true) - $(".chat-right").outerWidth()) - 360);
    $(".chat-send").width(window.innerWidth - ($(".chat-right").outerWidth(true) - $(".chat-right").outerWidth()) - 360);
    $(".chat-send-text").width(window.innerWidth - 156 - ($(".chat-right").outerWidth(true) - $(".chat-right").outerWidth()) - 360);

    $(".chat-conversation").height(window.innerHeight + 1 - 64 - 46);
    $(".chat-contacts").height(window.innerHeight - 2 - 144);
}

async function addmessage() {
    if (isEmpty(document.getElementById("chat-send-text").value)) {
        return;
    }
    var value = document.getElementById("chat-send-text").value;
    $(".chat-conversation").append('<div class="chat-msg-own">' + value + '</div>');

    var temp = document.getElementById("chat-last-msg");
    document.getElementById("chat-last-msg").nextElementSibling.id = "chat-last-msg";
    temp.id = "";

    document.getElementById("chat-send-text").value = "";
    document.getElementById("chat-conversation").scroll(0, 999999999999);

    await sleep(1000);
    document.getElementById("chat-active-last-time").innerHTML = "&#8729 1 min";
    document.getElementById("chat-active-last-msg").innerHTML = "Já: " + value;

}
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var user = urlParams.get("user")