//Begin of google api varibles
// Client ID and API key from the Developer Console
var CLIENT_ID = '823167154939-kq1pa2a8574vviapcj6m7jukqnff41g8.apps.googleusercontent.com';
var API_KEY = 'AIzaSyATGHwXQFEZaidzwkfqhyOMw7cAEBwKcDI';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
//EO Google vars

//Jquery onready document setup functions
$(document).ready(function() {

    //Update time on taskbar
    setInterval(function() {
        var dt = new Date();
        document.getElementById("datetime").innerHTML = (("0" + dt.getHours()).slice(-2)) + ":" +
            (("0" + dt.getMinutes()).slice(-2)) + ":" + (("0" + dt.getSeconds()).slice(-2)) + "<br>" + (("0" + dt.getDate()).slice(-2)) + "." + (("0" +
                (dt.getMonth() + 1)).slice(-2)) + "." + (dt.getFullYear());
    }, 999);

    //Testing windows like selection on desktop
    //document.onmouseenter = function() { showCoords(event) };

    //Get request parser
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);

    //Reads url and save variables
    var user = urlParams.get("user")
    var security = urlParams.get("security")
    var data = urlParams.get("data")

    //Check, if cookie and password is same and login user
    if (((!isEmpty(getCookie("auth"))) && (security == EncryptRSA(getCookie("auth")))) && ((isEmpty(user) || isEmpty(security) || isEmpty(data)) == false)) {
        document.body.id = "";
    };

    //Populate table>td with populated class
    var i = 1
    $('td').each(function(index) {
        $(this).attr("id", ("desktop-" + index));
        if (document.getElementById("desktop-" + index).children.length > 0) {
            this.classList.add("populated");
        }
    });

    /*Search structure function
    $("search-open").keydown(function(){
        $("search-box-content").css("background-color", "yellow");
      });*/

    //Set desktop size
    var dragbar = getPosition(document.getElementById("dragbar"));
    $('#desktop').css("height", dragbar.top);
    $('#windows-holder').css("height", dragbar.top);

    //On click to start button open/close menu
    $("#start-open").click(function() {
        $("#start-box").fadeToggle(50);
    });

    //On click outside from menu close it
    $("#start-box").click(function() {
        $("#start-box").fadeToggle(50);
    });

    //On click to search button open search box
    $("#search-open").click(function() {
        $("#search-box").fadeIn(50);
    });

    //On click outside the box close it
    $("#search-box").click(function() {
        $("#search-box").fadeOut(50);
        document.getElementById("search-open").value = "";
    });

    //Variable taskbar script
    var i = 0;
    $('#dragbar').mousedown(function() {
        $('#mousestatus').html("mousedown" + i++);
        $(document).mousemove(function(e) {
            $('#navbar').css("height", document.body.scrollHeight - e.pageY + 2);
            $('#dragbar').css("bottom", document.body.scrollHeight - e.pageY - 3);
            if ((document.body.scrollHeight - e.pageY < 40)) {
                e.pageY = document.body.scrollHeight - 40;
            }
            if ((document.body.scrollHeight - e.pageY > 88)) {
                e.pageY = document.body.scrollHeight - 88;
            }
            $('#start-box-content').css("bottom", document.body.scrollHeight - e.pageY + 2);
            $('#search-box-content').css("bottom", document.body.scrollHeight - e.pageY + 2);
            $('#desktop').css("height", e.pageY);
            $('#windows-holder').css("height", e.pageY);
        })
    })
    $(document).mouseup(function() {
        $('#clickevent').html('in another mouseUp event' + i++);
        $(document).unbind('mousemove');
    })
});

//Fix desktop when resizing
$(window).resize(function() {
    var dragbar = getPosition(document.getElementById("dragbar"));
    $('#desktop').css("height", dragbar.top);
    $('#windows-holder').css("height", dragbar.top);
});

//Selection box mouse position on mousemove and mousedown
function showCoords(event) {
    var clicking = false;

    $("#windows-holder").mousedown(function() {
        clicking = true;
    });

    $("#windows-holder").mouseup(function() {
        console.log("released");
    });

    $(document).mouseup(function() {
        clicking = false;
    });
    $("#windows-holder").mousemove(function() {
        if (clicking === false) return;

        // Mouse click + moving logic here
        console.log("event:" + event);
        console.log(event);
        console.log(event.pageX + ", " + event.pageY);
    });
};

//Google onSignIn function
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId());
    console.log("password:" + profile.getId() + profile.getEmail())
    document.getElementById("password").value = profile.getId() + profile.getEmail();
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    document.getElementById("username").value = profile.getFamilyName();
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    //TODO
    //listFiles();

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    /*
    beforelogin();
    frameSource();
    openFullscreen();
    document.getElementById("form").submit();*/
}

//Google drive list get file api

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

//None making function, timeouting
function none() {
    return 0;
}

//Window fading function
function fademe(ele0, ele1) {
    $(ele0).fadeToggle(150);
    $(ele1).toggleClass("active");
}

//Make the DIV element draggagle:
dragElement(document.getElementById("word"));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

//Better drag for windows ?
/*
var mydragg = function() {
    return {
        move: function(divid, xpos, ypos) {
            divid.style.left = xpos + 'px';
            divid.style.top = ypos + 'px';
        },
        startMoving: function(divid, container, evt) {
            console.log(divid);
            console.log(container);
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                divTop = divid.style.top,
                divLeft = divid.style.left,
                eWi = parseInt(divid.style.width),
                eHe = parseInt(divid.style.height),
                cWi = parseInt(document.getElementById(container).style.width),
                cHe = parseInt(document.getElementById(container).style.height);
            divid.style.cursor = 'move';
            divTop = divTop.replace('px', '');
            divLeft = divLeft.replace('px', '');
            var diffX = posX - divLeft,
                diffY = posY - divTop;
            document.onmousemove = function(evt) {
                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    aX = posX - diffX,
                    aY = posY - diffY;
                if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHe > cHe) aY = cHe - eHe;
                mydragg.move(divid, aX, aY);
            }
        },
        stopMoving: function(divid, container) {
            var a = document.createElement('script');
            divid.style.cursor = 'default';
            document.onmousemove = function() {}
        },
    }
}();*/


/**
 * Print files.
 */
function listFiles() {
    gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
        appendPre('Files:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
            }
        } else {
            appendPre('No files found.');
        }
    });
}

//Get position of element with parrameter document.getElementById()
function getPosition(element) {
    var clientRect = element.getBoundingClientRect();
    return {
        left: clientRect.left + document.body.scrollLeft,
        top: clientRect.top + document.body.scrollTop
    };
}

//Set browser cookie to days
function setCookiedays(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//Set browser cookie to hours
function setCookiehours(name, value, hours) {
    var expires = "";
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//Read browser cookie 
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

//Erase browser cookie 
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Waiting function set by ms
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

//Checking function if something is null, undefined, "", [], then true
function isEmpty(value) {
    return (value == null || value.length === 0);
}

//Rsa crypting function
function EncryptRSA(attr) {

    //rsaKeys(128);

    rsa_e = "17";
    rsa_pq = "134561597,242997752,245819979,187447108,248985824,25648167,235622872,144502096,106877395,6";

    var mpi = s2r(b2mpi(rsa_pq) + b2mpi(rsa_e));
    mpi = mpi.replace(/\n/, '');
    var s = r2s(mpi);
    var l = Math.floor((s.charCodeAt(0) * 256 + s.charCodeAt(1) + 7) / 8);

    mod = mpi2b(s.substr(0, l + 2));
    exp = mpi2b(s.substr(l + 2));

    return (s2hex(b2s(RSAencrypt(s2b(attr + String.fromCharCode(1)), exp, mod))));
}


//Function to calculate md5 hash of text string
function beforelogin() {
    var input_md5 = document.getElementById("password").value;
    var hash = CryptoJS.MD5(input_md5);
    setCookiehours("auth", hash, 1);
    document.getElementById("hidden-hashed").value = EncryptRSA(hash);
};

//Function do decrpyt result adress
function login() {
    document.body.id = "";
    /*encrip(
        document.getElementById('hidden-secret'),
        document.getElementById('hidden-hashed'),
        document.getElementById('hidden-adress')
    )*/ //NOT in use !


};

//Testing frame work function
function frameSource() {
    var hiddenFrame = document.getElementById("hiddenFrame");
    hiddenFrame.src = "http://bukovsky-ukoly-ivt.eu/netos.html?user=" + document.getElementById("username").value + "&security=" + document.getElementById("hidden-hashed").value + "&data=.";
    history.pushState({}, null, hiddenFrame.src);
    var att = document.createAttribute("frameborder");
    att.value = "0";
    hiddenFrame.setAttributeNode(att);
    var att = document.createAttribute("style");
    att.value = "z-index:1009;overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px";
    hiddenFrame.setAttributeNode(att);
    var att = document.createAttribute("height");
    att.value = "100%";
    hiddenFrame.setAttributeNode(att);
    var att = document.createAttribute("width");
    att.value = "100%";
    hiddenFrame.setAttributeNode(att);
    hiddenFrame.classList.remove("hide");
}

//Fullscreen opening function 
function openFullscreen() {
    var elem = document.body;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

//Check if exist child object of element
function hasChildren(att) {
    var ans = false;
    if (document.getElementById(att).children.length > 0) {
        ans = true;
    }

    return ans;
}

//Drag and drop setup function
function allowDrop(ev) {
    ev.preventDefault();
}

//Drag and drop drag function for desktop
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.parentElement.classList.remove("populated");
}

//Drag and drop drop function for desktop to taskbar
/*
function droptaskbar(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (isEmpty(document.getElementById(data))) {
        return 0;
    }
    $(document.getElementById(data)).clone().appendTo(document.getElementById(ev.target.id));
}*/
function droptaskbar(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (isEmpty(document.getElementById(data))) {
        return 0;
    }

    console.log(ev.target);
    console.log(document.getElementById(data));

    var cln = document.getElementById(data).cloneNode(true);
    document.getElementById(data).parentElement.className += " populated";

    ev.target.appendChild(cln);

    console.log(cln);
}

//Drag and drop drop function for desktop
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    console.log(ev.target);
    console.log(document.getElementById(data));

    if (isEmpty(document.getElementById(data))) {
        return 0;
    }
    //Fix for inserting itself
    if (ev.target.nodeName == "TD") {
        ev.target.className += " populated";
        ev.target.appendChild(document.getElementById(data));
    } else {
        ev.target.parentElement.className += " populated";
        ev.target.parentElement.appendChild(document.getElementById(data));
    }
}

//Fuction to check doubleckick on element 
function doubleclick(el, onsingle, ondouble) {
    if (el.getAttribute("data-dblclick") == null) {
        el.setAttribute("data-dblclick", 1);
        setTimeout(function() {
            if (el.getAttribute("data-dblclick") == 1) {
                onsingle();
            }
            el.removeAttribute("data-dblclick");
        }, 300);
    } else {
        el.removeAttribute("data-dblclick");
        ondouble();
    }
}

//Taskbar moving elements script
jQuery(function() {

    // loop through the original items...
    jQuery("#original_items li").each(function() {

        // clone the original items to make their
        // absolute-positioned counterparts...
        var item = jQuery(this);
        var item_clone = item.clone();
        // 'store' the clone for later use...
        item.data("clone", item_clone);

        // set the initial position of the clone
        var position = item.position();
        /*
        console.log(item);
        console.log(item.data);
        console.log(item_clone);*/
        item_clone.css("left", position.left);
        item_clone.css("top", position.top);

        // append the clone...
        jQuery("#cloned_items").append(item_clone);
    });

    // create our sortable as usual...
    // with some event handler extras...
    jQuery("#original_items").sortable({
        axis: "x",

        // on sorting start, hide the original items...
        // only adjust the visibility, we still need
        // their float positions..!
        start: function(e, ui) {
            // loop through the items, except the one we're
            // currently dragging, and hide it...
            ui.helper.addClass("exclude-me");
            jQuery("#original_items li:not(.exclude-me)")
                .css("visibility", "hidden");

            // get the clone that's under it and hide it...
            ui.helper.data("clone").hide();
        },

        stop: function(e, ui) {
            // get the item we were just dragging, and
            // its clone, and adjust accordingly...
            jQuery("#original_items li.exclude-me").each(function() {
                var item = jQuery(this);
                var clone = item.data("clone");
                var position = item.position();

                // move the clone under the item we've just dropped...
                clone.css("left", position.left);
                clone.css("top", position.top);
                clone.show();

                // remove unnecessary class...
                item.removeClass("exclude-me");
            });

            // make sure all our original items are visible again...
            jQuery("#original_items li").css("visibility", "visible");
        },

        // here's where the magic happens...
        change: function(e, ui) {
            // get all invisible items that are also not placeholders
            // and process them when ordering changes...
            jQuery("#original_items li:not(.exclude-me, .ui-sortable-placeholder)").each(function() {
                var item = jQuery(this);
                var clone = item.data("clone");

                // stop current clone animations...
                clone.stop(true, false);

                // get the invisible item, which has snapped to a new
                // location, get its position, and animate the visible
                // clone to it...
                var position = item.position();
                clone.animate({
                    left: position.left,
                    top: position.top
                }, 100);
            });
        }
    });
});