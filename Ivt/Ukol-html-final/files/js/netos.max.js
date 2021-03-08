/**
 * @description First release version of NetOS
 * @author Jan Oskar Bukovský <janoskarbukovsky@gmail.com & bukovsky@gchd.cz>
 * @copyright Jan Oskar Bukovský 2021
 * @supported FullHD and higher display; win10(32bit/64bit); Edge 81+, Firefox 72+, Chrome 85+, Opera 71+
 * @version 1.0
 * @since 08.03.2021
 * @license MIT 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

var animateSpipa = 1;
//ShrSVar

//Jquery onready document setup functions
$(document).ready(function () {

    //Transfer user to hosted working version
    if (document.location.protocol == "file:") {
        alert("Na file:/// to nepujde, spust alespon na http://, nejlepe na https://. Proto te ted presmeruji na stranku, kde by vse snad melo jit :D");
        window.location.href = "https://oskarbukovsky.github.io/bukovsky-ukoly-ivt.github.io/Ivt/Ukol-html-final/netos.html";
        //Backup http url: "http://bukovsky-ukoly-ivt.eu/netos.html";
    }

    //Update time on taskbar
    setInterval(function () {
        var dt = new Date();
        document.getElementById("datetime").innerHTML = (("0" + dt.getHours()).slice(-2)) + ":" +
            (("0" + dt.getMinutes()).slice(-2)) + ":" + (("0" + dt.getSeconds()).slice(-2)) + "<br>" + (("0" + dt.getDate()).slice(-2)) + "." + (("0" +
                (dt.getMonth() + 1)).slice(-2)) + "." + (dt.getFullYear());
    }, 999);

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
        animateSpipa = 0;
    };

    //Specify table>tr>td
    var i = 1
    $('td').each(function (index) {
        $(this).attr("id", ("desktop-" + index));
        this.setAttribute("ondrop", "drop(event)");
        this.setAttribute("ondragover", "allowDrop(event, this)");
        if (document.getElementById("desktop-" + index).children.length > 0) {
            this.classList.add("populated");
        }
    });

    /*Search structure function
    $("search-open").keydown(function(){
        $("search-box-content").css("background-color", "yellow");
      });*/

    //Taskbar init
    taskbarDrag();

    //Set desktop size
    var dragbar = getPosition(document.getElementById("dragbar"));
    $('#desktop').css("height", dragbar.top);
    $('#windows-holder').css("height", dragbar.top);

    //On click to start button open/close menu
    $("#start-open").click(function () {
        $("#start-box").fadeToggle(50);
    });

    //On click outside from menu close it
    $("#start-box").click(function () {
        $("#start-box").fadeToggle(50);
    });

    //On click to search button open search box
    $("#search-open").click(function () {
        $("#search-box").fadeIn(50);
    });

    //On click outside the box close it
    $("#search-box").click(function () {
        $("#search-box").fadeOut(50);
        document.getElementById("search-open").value = "";
    });

    //Minimiza all windows and deactive taskbar icons
    $("#minimize-all").click(function () {
        $(".window").each(function () {
            fadeWindow("#" + this.id);
        });
    });

    //Variable taskbar script
    var i = 0;
    $('#dragbar').mousedown(function () {
        $('#mousestatus').html("mousedown" + i++);
        $(document).mousemove(function (e) {
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
    $(document).mouseup(function () {
        $('#clickevent').html('in another mouseUp event' + i++);
        $(document).unbind('mousemove');
    })

    //Detect iframe click and move to top
    var monitor = setInterval(intervals, 1);
    function intervals() {
        var elem = document.activeElement;
        if (elem && elem.tagName == 'IFRAME' && elem.className == 'content') {
            $('#' + elem.parentElement.parentElement.id).css("z-index", parseInt(getHighestZ(".window")) + 1);
            clearInterval(monitor);
            deactiveTasks();
            $("#" + elem.parentElement.parentElement.id.split("_")[0]).children().eq(0).addClass("active");
            monitor = setInterval(exitIframe.bind(null, elem), 1);
        }
    }
    function exitIframe(iframe) {
        var elem = document.activeElement;
        if ((elem && elem.tagName != 'IFRAME') || (elem && elem != iframe) || (elem.className != 'content')) {
            clearInterval(monitor);
            deactiveTasks();
            monitor = setInterval(intervals, 1);
        }
    }
});

//Fix desktop when resizing
$(window).resize(function () {
    var dragbar = getPosition(document.getElementById("dragbar"));
    $('#desktop').css("height", dragbar.top);
    $('#windows-holder').css("height", dragbar.top);
    $(".window-content").each(function () {
        this.style.height = this.parentElement.offsetHeight - 34 + "px";
    })
});

//Find highest window inde
function getHighestWindow(query) {
    var tempZ = 0;
    $.each($("div[id^=task-" + query + "_]"), function () {
        if (this.id.split("_").pop() > tempZ) {
            tempZ = this.id.split("_").pop();
        }
    });
    return parseInt(tempZ);
}

//Check if window is running
function checkWindow(ele0) {
    title = ele0.firstChild.nextSibling.innerHTML;
    if ($('*[id^="task-' + ele0.id + '_"]')) {
        newWindow("task-" + ele0.id + "_" + (getHighestWindow(ele0.id) + 1), title.trimStart(), ele0.getAttribute("data"));
        deactiveTasks();
    }
    if (!document.getElementById("task-" + ele0.id)) {
        var li = document.createElement('li');
        li.id = "task-" + ele0.id;
        li.classList.add("ui-sortable-handle");
        li.classList.add("running");
        li.setAttribute("ondrop", "droptaskbar(event)");
        li.setAttribute("ondragover", "allowDrop(event, this)");
        li.setAttribute("pointer", ele0.id);
        li.innerHTML = '<div class="desktop-icon active" style="background-image: url(\'https://www.google.com/s2/favicons?sz=256&domain=' + ele0.getAttribute("data").split("?")[0] + '\');background-position: 50% 50%;" onclick="fademe(this);"></div>';
        document.getElementById("original_items").appendChild(li);
    } else {
        deactiveTasks();
        document.getElementById("task-" + ele0.id).classList.add("running");
        document.getElementById("task-" + ele0.id).children[0].classList.add("active");
    }
    taskbarFix();
}

//Function to repair move and dragable taskbar
function taskbarFix() {
    $("#original_items li").each(function () {
        var item = $(this);
        var item_clone = item.clone();
        item.data("clone", item_clone);
        var position = item.position();
        item_clone.css("left", position.left);
        item_clone.css("top", position.top);
        $("#cloned_items").append(item_clone);
    });
}

//Fade window function
function fadeWindow(ele0) {
    $(ele0).fadeToggle(150);
    $(ele0.split('_')[0]).children().removeClass("active");
}

//FUnction to generate number in range
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

//Function to maximize window
function minmaxWindow(ele0) {
    if (($(ele0).css("height") != $("#windows-holder").height() + "px") && ($(ele0).css("width") != $("#windows-holder").width() + "px")) {
        $(ele0).css("top", "0px");
        $(ele0).css("left", "0px");
        $(ele0).css("width", "100vw");
        $(ele0).css("height", "calc(100vh - 44px)");
        $(ele0).children().eq(1).css("height", "calc(100vh - 78px)");
        $(ele0).children().eq(1).children().eq(0).css("height", "calc(100vh - 78px)");
        $(ele0).children().eq(1).children().eq(1).css("height", "calc(100vh - 78px)");
        $(ele0).children().eq(0).children()[1].innerHTML = "&#128471&#xFE0E";
    } else {
        $(ele0).css("width", randomNumber(352, 512));
        var height = randomNumber(256, 512);
        $(ele0).css("height", height - 44 + "px");
        $(ele0).children().eq(1).css("height", height - 78 + "px");
        $(ele0).children().eq(1).children().eq(0).css("height", "calc(100% - 34px)");
        $(ele0).children().eq(1).children().eq(1).css("height", "100%");
        $(ele0).css("top", randomNumber(16, $("#windows-holder").height() / 5));
        $(ele0).css("left", randomNumber(16, $("#windows-holder").width() / 5));
        $(ele0).children().eq(0).children()[1].innerHTML = '<i class="far fa-window-maximize"></i>';
    }
}

//Window fading function
function fademe(ele0) {
    if (!$(ele0.parentElement).hasClass("running")) {
        var help = ele0.parentElement.getAttribute("pointer");
        newWindow("task-" + help + "_" + (parseInt(getHighestWindow(ele0.id)) + 1), $("#" + help).text().trimStart(), document.getElementById(help).getAttribute("data"));
        $(ele0.parentElement).toggleClass("running");
        deactiveTasks();
        $(ele0).addClass("active");
        return;
    }
    $('*[id^="task-' + ele0.parentElement.getAttribute("pointer") + '_"]').each(function () {
        if ($(ele0).hasClass("active")) {
            $(this).fadeToggle(150);
            $(ele0).removeClass("active");
        } else {
            if (!$(this).is(":visible")) {
                $(this).fadeToggle(150);
            }
            $(this).css("z-index", parseInt(getHighestZ(".window")) + 1);
            deactiveTasks();
            $(ele0).addClass("active");
        }
    });
}

//Remove active class from all li tags in taskbar
function deactiveTasks() {
    $("li.ui-sortable-handle").each(function () {
        $(this.children[0]).removeClass("active");
    });
}

//Create new window
function newWindow(identifier, title, url) {
    var div = document.createElement('div');
    div.id = identifier;
    div.classList.add("window");
    div.style.zIndex = parseInt(getHighestZ(".window")) + 1;
    div.style.width = randomNumber(352, 512) + "px";
    div.style.height = randomNumber(256, 512) + "px";
    div.style.top = randomNumber(16, $("#windows-holder").height() / 5) + "px";
    div.style.left = randomNumber(16, $("#windows-holder").width() / 5) + "px";
    div.innerHTML = "<div class='window-header'>" + title + "<div class='window-min' onclick=\"fadeWindow(\'#" + identifier + "\')\">&#9866;</div><div class='window-max' onclick=\"minmaxWindow(\'#" + identifier + "\')\"><i class='far fa-window-maximize'></i></div><div class='window-close' onclick=\"document.getElementById('windows-holder').removeChild(document.getElementById(\'" + identifier + "\'));$('#" + identifier.split("_")[0] + "').removeClass('running').children().removeClass('active');taskbarFix();\">&#10006;</div></div><div class='window-content' style='height:80vh;width:100%;'><div class='iframe-blocker' style='position: absolute;height: calc(100% - 34px);width:100%;background: rgba(0,0,0,0.001);top: 34px;'></div><iframe src='" + url + "' style='height:100%;width:100%;' class='content'></iframe></div>";
    document.getElementById("windows-holder").appendChild(div);
    dragElement(document.getElementById(identifier));
    $(div.children[1].children[0]).fadeOut(0);
    var side = ["nw", "ne", "sw", "se", "n", "e", "s", "w"];
    side.forEach(function (item, index) {
        var grip = document.createElement("div");
        grip.classList.add("ui-resizable-handle");
        grip.classList.add("ui-resizable-" + item);
        grip.classList.add(item + "grip");
        document.getElementById(identifier).appendChild(grip);
    });
    resizeWindow(document.getElementById(identifier));
    var script = document.createElement("script");
    script.innerHTML = `
    window.addEventListener('mousedown', function (e) {
        if (document.getElementById("` + identifier + `").contains(e.target)) {
            $('#` + identifier + `').css("z-index", parseInt(getHighestZ(".window")) + 1);
            deactiveTasks();
            $("#` + identifier.split("_")[0] + `").children().eq(0).addClass("active");
        }
    })`;
    document.getElementById(identifier).appendChild(script);
    $("li").each(function () {
        this.classList.remove("active");
    })
}

//Make the DIV element draggagle:

//Resize elements
function resizeWindow(elmnt) {
    $(elmnt).resizable({
        start: function (event, ui) {
            $(".iframe-blocker").fadeIn(0);
        },
        stop: function (event, ui) {
            $(".iframe-blocker").fadeOut(0);
        },
        minHeight: 256,
        minWidth: 352,
        containment: "#windows-holder",
        handles: {
            "ne": ".negrip",
            "se": ".segrip",
            "sw": ".swgrip",
            "nw": ".nwgrip",
            "n": ".ngrip",
            "e": ".egrip",
            "s": ".sgrip",
            "w": ".wgrip"
        },
        resize: function (event, ui) {
            ui.element[0].children[1].style.height = ui.size.height - 34 + "px";
        }
    });
}

window.addEventListener('mouseup', function (e) {
    document.onmouseup = null;
    document.onmousemove = null;
    $(".iframe-blocker").fadeOut(0)
})
function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elmnt.children[1].style.height = getPosition(elmnt).height - 34 + "px";
    elmnt.children[0].onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        $(".iframe-blocker").fadeIn(0);
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        var contentWidth = [...document.body.children].reduce(
            (a, el) => Math.max(a, el.getBoundingClientRect().right), 0)
            - document.body.getBoundingClientRect().x;
        if (getPosition(elmnt).top <= 0) {
            elmnt.style.top = "0px";
        }
        if (getPosition(elmnt.children[0]).bottom >= document.body.scrollHeight - getPosition(document.getElementById("navbar")).height) {
            elmnt.style.top = document.body.scrollHeight - getPosition(document.getElementById("navbar")).height - getPosition(elmnt.children[0]).height + "px";
        }
        /* If you don't want to move windows outside other sides remove this comment
        if (getPosition(elmnt).left <= 0) {
            elmnt.style.left = "0px";
        }
        if (getPosition(elmnt).right >= Math.min(document.body.scrollWidth, contentWidth)) {
            elmnt.style.left = Math.min(document.body.scrollWidth, contentWidth) - getPosition(elmnt).width + "px";
        }
        if (getPosition(elmnt).bottom >= document.body.scrollHeight - getPosition(document.getElementById("navbar")).height) {
            elmnt.style.top = document.body.scrollHeight - getPosition(document.getElementById("navbar")).height - getPosition(elmnt).height + "px";
        }*/
    }
}

//Find higher window z-index
function getHighestZ(query) {
    var tempZ = 10;
    $.each($(query), function () {
        if (this.style.zIndex > tempZ) {
            tempZ = this.style.zIndex;
        }
    });
    return tempZ;
}

//Google onSignIn function
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    document.getElementById("password").value = profile.getId() + profile.getEmail();
    document.getElementById("username").value = profile.getFamilyName();

    //TODO
    //listFiles();

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

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

//GApi print files
function listFiles() {
    gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    }).then(function (response) {
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
        top: clientRect.top + document.body.scrollTop,
        bottom: clientRect.bottom,
        right: clientRect.right,
        width: clientRect.width,
        height: clientRect.height
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
    hiddenFrame.src = window.location.href.split("?")[0] + "?user=" + document.getElementById("username").value + "&security=" + document.getElementById("hidden-hashed").value + "&data=.";
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
    animateSpipa = 0;
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
function allowDrop(ev, elemnt) {
    if (!elemnt.children.length > 0) {
        ev.preventDefault();
    }
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
    var cln = document.getElementById(data).cloneNode(true);
    document.getElementById(data).parentElement.className += " populated";
    ev.target.appendChild(cln);
}

//Drag and drop drop function for desktop
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
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
        setTimeout(function () {
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
function taskbarDrag() {
    $(function () {

        // loop through the original items...
        $("#original_items li").each(function () {


            // clone the original items to make their
            // absolute-positioned counterparts...
            var item = $(this);
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
            $("#cloned_items").append(item_clone);
        });

        // create our sortable as usual...
        // with some event handler extras...
        $("#original_items").sortable({
            axis: "x",

            // on sorting start, hide the original items...
            // only adjust the visibility, we still need
            // their float positions..!
            start: function (e, ui) {
                // loop through the items, except the one we're
                // currently dragging, and hide it...
                ui.helper.addClass("exclude-me");
                $("#original_items li:not(.exclude-me)")
                    .css("visibility", "hidden");

                // get the clone that's under it and hide it...
                ui.helper.data("clone").hide();
            },

            stop: function (e, ui) {
                // get the item we were just dragging, and
                // its clone, and adjust accordingly...
                $("#original_items li.exclude-me").each(function () {
                    var item = $(this);
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
                $("#original_items li").css("visibility", "visible");
            },

            // here's where the magic happens...
            change: function (e, ui) {
                // get all invisible items that are also not placeholders
                // and process them when ordering changes...
                $("#original_items li:not(.exclude-me, .ui-sortable-placeholder)").each(function () {
                    var item = $(this);
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
}
/**
 * @author Alex Andrix <alex@alexandrix.com>
 * @since 2018-12-02
 */

var App = {};
App.setup = function () {
    var canvas = document.getElementById('spipa');
    this.filename = "spipa";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.canvas = canvas;
    document.getElementsByTagName('body')[0].appendChild(canvas);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.dataToImageRatio = 1;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.xC = this.width / 2;
    this.yC = this.height / 2;

    this.stepCount = 0;
    this.particles = [];
    this.lifespan = 1000;
    this.popPerBirth = 1;
    this.maxPop = 300;
    this.birthFreq = 2;

    // Build grid
    this.gridSize = 8; // Motion coords
    this.gridSteps = Math.floor(1000 / this.gridSize);
    this.grid = [];
    var i = 0;
    for (var xx = -500; xx < 500; xx += this.gridSize) {
        for (var yy = -500; yy < 500; yy += this.gridSize) {
            // Radial field, triangular function of r with max around r0
            var r = Math.sqrt(xx * xx + yy * yy),
                r0 = 100,
                field;

            if (r < r0) field = 255 / r0 * r;
            else if (r > r0) field = 255 - Math.min(255, (r - r0) / 2);

            this.grid.push({
                x: xx,
                y: yy,
                busyAge: 0,
                spotIndex: i,
                isEdge: (xx == -500 ? 'left' :
                    (xx == (-500 + this.gridSize * (this.gridSteps - 1)) ? 'right' :
                        (yy == -500 ? 'top' :
                            (yy == (-500 + this.gridSize * (this.gridSteps - 1)) ? 'bottom' :
                                false
                            )
                        )
                    )
                ),
                field: field
            });
            i++;
        }
    }
    this.gridMaxIndex = i;

    // Counters for UI
    this.drawnInLastFrame = 0;
    this.deathCount = 0;

    this.initDraw();
};
App.evolve = function () {
    var time1 = performance.now();
    if (animateSpipa == 0) {
        return;
    }

    this.stepCount++;

    // Increment all grid ages
    this.grid.forEach(function (e) {
        if (e.busyAge > 0) e.busyAge++;
    });

    if (this.stepCount % this.birthFreq == 0 && (this.particles.length + this.popPerBirth) < this.maxPop) {
        this.birth();
    }
    App.move();
    App.draw();

    var time2 = performance.now();



};
App.birth = function () {
    var x, y;
    var gridSpotIndex = Math.floor(Math.random() * this.gridMaxIndex),
        gridSpot = this.grid[gridSpotIndex],
        x = gridSpot.x,
        y = gridSpot.y;

    var particle = {
        hue: 200, // + Math.floor(50*Math.random()),
        sat: 95, //30 + Math.floor(70*Math.random()),
        lum: 20 + Math.floor(40 * Math.random()),
        x: x,
        y: y,
        xLast: x,
        yLast: y,
        xSpeed: 0,
        ySpeed: 0,
        age: 0,
        ageSinceStuck: 0,
        attractor: {
            oldIndex: gridSpotIndex,
            gridSpotIndex: gridSpotIndex, // Pop at random position on grid
        },
        name: 'seed-' + Math.ceil(10000000 * Math.random())
    };
    this.particles.push(particle);
};
App.kill = function (particleName) {
    var newArray = _.reject(this.particles, function (seed) {
        return (seed.name == particleName);
    });
    this.particles = _.cloneDeep(newArray);
};
App.move = function () {
    for (var i = 0; i < this.particles.length; i++) {
        // Get particle
        var p = this.particles[i];

        // Save last position
        p.xLast = p.x;
        p.yLast = p.y;

        // Attractor and corresponding grid spot
        var index = p.attractor.gridSpotIndex,
            gridSpot = this.grid[index];

        // Maybe move attractor and with certain constraints
        if (Math.random() < 0.5) {
            // Move attractor
            if (!gridSpot.isEdge) {
                // Change particle's attractor grid spot and local move function's grid spot
                var topIndex = index - 1,
                    bottomIndex = index + 1,
                    leftIndex = index - this.gridSteps,
                    rightIndex = index + this.gridSteps,
                    topSpot = this.grid[topIndex],
                    bottomSpot = this.grid[bottomIndex],
                    leftSpot = this.grid[leftIndex],
                    rightSpot = this.grid[rightIndex];

                // Choose neighbour with highest field value (with some desobedience...)
                var chaos = 30;
                var maxFieldSpot = _.maxBy([topSpot, bottomSpot, leftSpot, rightSpot], function (e) {
                    return e.field + chaos * Math.random()
                });

                var potentialNewGridSpot = maxFieldSpot;
                if (potentialNewGridSpot.busyAge == 0 || potentialNewGridSpot.busyAge > 15) { // Allow wall fading
                    //if (potentialNewGridSpot.busyAge == 0) {// Spots busy forever
                    // Ok it's free let's go there
                    p.ageSinceStuck = 0; // Not stuck anymore yay
                    p.attractor.oldIndex = index;
                    p.attractor.gridSpotIndex = potentialNewGridSpot.spotIndex;
                    gridSpot = potentialNewGridSpot;
                    gridSpot.busyAge = 1;
                } else p.ageSinceStuck++;

            } else p.ageSinceStuck++;

            if (p.ageSinceStuck == 10) this.kill(p.name);
        }

        // Spring attractor to center with viscosity
        var k = 8,
            visc = 0.4;
        var dx = p.x - gridSpot.x,
            dy = p.y - gridSpot.y,
            dist = Math.sqrt(dx * dx + dy * dy);

        // Spring
        var xAcc = -k * dx,
            yAcc = -k * dy;

        p.xSpeed += xAcc;
        p.ySpeed += yAcc;

        // Calm the f*ck down
        p.xSpeed *= visc;
        p.ySpeed *= visc;

        // Store stuff in particle brain
        p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);
        p.dist = dist;

        // Update position
        p.x += 0.1 * p.xSpeed;
        p.y += 0.1 * p.ySpeed;

        // Get older
        p.age++;

        // Kill if too old
        if (p.age > this.lifespan) {
            this.kill(p.name);
            this.deathCount++;
        }
    }
};
App.initDraw = function () {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
    this.ctx.closePath();
};
App.draw = function () {
    this.drawnInLastFrame = 0;
    if (!this.particles.length) return false;

    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    //this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fill();
    this.ctx.closePath();

    for (var i = 0; i < this.particles.length; i++) {
        // Draw particle
        var p = this.particles[i];

        var h, s, l, a;

        h = p.hue + this.stepCount / 30;
        s = p.sat;
        l = p.lum;
        a = 1;

        var last = this.dataXYtoCanvasXY(p.xLast, p.yLast),
            now = this.dataXYtoCanvasXY(p.x, p.y);
        var attracSpot = this.grid[p.attractor.gridSpotIndex],
            attracXY = this.dataXYtoCanvasXY(attracSpot.x, attracSpot.y);
        var oldAttracSpot = this.grid[p.attractor.oldIndex],
            oldAttracXY = this.dataXYtoCanvasXY(oldAttracSpot.x, oldAttracSpot.y);

        this.ctx.beginPath();

        this.ctx.strokeStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        this.ctx.fillStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';

        // Particle trail
        this.ctx.moveTo(last.x, last.y);
        this.ctx.lineTo(now.x, now.y);

        this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
        this.ctx.stroke();
        this.ctx.closePath();

        // Attractor positions
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
        this.ctx.moveTo(oldAttracXY.x, oldAttracXY.y);
        this.ctx.lineTo(attracXY.x, attracXY.y);
        this.ctx.arc(attracXY.x, attracXY.y, 1.5 * this.dataToImageRatio, 0, 2 * Math.PI, false);

        //a /= 20;
        this.ctx.strokeStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        this.ctx.fillStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.closePath();

        // UI counter
        this.drawnInLastFrame++;
    }

};
App.dataXYtoCanvasXY = function (x, y) {
    var zoom = 1.6;
    var xx = this.xC + x * zoom * this.dataToImageRatio,
        yy = this.yC + y * zoom * this.dataToImageRatio;

    return { x: xx, y: yy };
};

document.addEventListener('DOMContentLoaded', function () {
    App.setup();
    App.draw();

    var frame = function () {
        App.evolve();
        requestAnimationFrame(frame);
    };
    frame();
});


/**
 * Some old util I use at times
 *
 * @param {Number} Xstart X value of the segment starting point
 * @param {Number} Ystart Y value of the segment starting point
 * @param {Number} Xtarget X value of the segment target point
 * @param {Number} Ytarget Y value of the segment target point
 * @param {Boolean} realOrWeb true if Real (Y towards top), false if Web (Y towards bottom)
 * @returns {Number} Angle between 0 and 2PI
 */
/*
segmentAngleRad = function(Xstart, Ystart, Xtarget, Ytarget, realOrWeb) {
    var result;// Will range between 0 and 2PI
    if (Xstart == Xtarget) {
        if (Ystart == Ytarget) {
            result = 0;
        } else if (Ystart < Ytarget) {
            result = Math.PI/2;
        } else if (Ystart > Ytarget) {
            result = 3*Math.PI/2;
        } else {}
    } else if (Xstart < Xtarget) {
        result = Math.atan((Ytarget - Ystart)/(Xtarget - Xstart));
    } else if (Xstart > Xtarget) {
        result = Math.PI + Math.atan((Ytarget - Ystart)/(Xtarget - Xstart));
    }
 
    result = (result + 2*Math.PI)%(2*Math.PI);
 
    if (!realOrWeb) {
        result = 2*Math.PI - result;
    }
 
    return result;
}*/
/*
The MIT License (MIT)
Copyright (c) 2017 Eduardo Henrique Vieira dos Santos
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function stringToIntList(string) {
    var s = new Array();
    for (var i = 0; i < string.length; i++) {
        s[i] = string.charCodeAt(i);
    }
    return s;
}
function intsToCharList(integers) {
    var ints = new Array();
    for (var i = 0; i < integers.length; i++) {
        ints[i] = String.fromCharCode(integers[i]);
    }
    return ints;
}
function encrip(text, key, cipher) {
    text = stringToIntList(text.value);
    key = stringToIntList(key.value);
    var table = makeTable();
    var keyChar = 0;
    var message = new Array();
    while (message.length < text.length) {
        for (var i = 0; i < text.length; i++) {
            var row = table[0].indexOf(key[keyChar]);
            var col = table[0].indexOf(text[i]);
            message[message.length] = table[row][col];
            if (keyChar < key.length - 1) {
                keyChar++;
            } else {
                keyChar = 0;
            }
        }
    }
    message = intsToCharList(message).join("");
    cipher.value = message;
}
function decrip(text, key, cipher) {
    cipher = stringToIntList(cipher.value);
    key = stringToIntList(key.value);
    var table = makeTable();
    var keyChar = 0;
    var message = new Array();
    while (message.length < cipher.length) {
        for (var i = 0; i < cipher.length; i++) {
            var row = table[0].indexOf(key[keyChar]);
            var col = table[row].indexOf(cipher[i]);
            message[message.length] = table[0][col];
            if (keyChar < key.length - 1) {
                keyChar++;
            } else {
                keyChar = 0;
            }
        }
    }
    message = intsToCharList(message).join("");
    text.value = message;

}
function makeTable() {
    var table = new Array();
    var minASCII = parseInt(document.getElementById('minASCII').value);
    var maxASCII = parseInt(document.getElementById('maxASCII').value);
    var i = 0;
    while (i + minASCII < maxASCII) {
        var line = new Array();
        for (var j = 0; j < maxASCII - minASCII; j++) {
            if (j + i + minASCII >= maxASCII) {
                line[line.length] = (j + i) - (maxASCII - minASCII) + minASCII;
            } else {
                line[line.length] = j + i + minASCII;
            }
        }
        table[table.length] = line;
        i++;
    }
    return table;
}
function printTable() {
    var t = makeTable();
    document.getElementById("ascii").innerHTML = "";
    for (var i = 0; i < t.length; i++) {
        document.getElementById("ascii").innerHTML = document.getElementById("ascii").innerHTML +
            "<tr><td>" + intsToCharList(t[i]).join("</td><td>") + "</td></tr>";
    }
}
/* RSA public key encryption/decryption
 * The following functions are (c) 2000 by John M Hanna and are
 * released under the terms of the Gnu Public License.
 * You must freely redistribute them with their source -- see the
 * GPL for details.
 *  -- Latest version found at http://sourceforge.net/projects/shop-js
 *
 * Modifications and GnuPG multi precision integer (mpi) conversion added
 * 2004 by Herbert Hanewinkel, www.haneWIN.de
 */

// --- Arbitrary Precision Math ---
// badd(a,b), bsub(a,b), bsqr(a), bmul(a,b)
// bdiv(a,b), bmod(a,b), bexpmod(g,e,m), bmodexp(g,e,m)

// bs is the shift, bm is the mask
// set single precision bits to 28
var bs = 28;
var bx2 = 1 << bs,
    bm = bx2 - 1,
    bx = bx2 >> 1,
    bd = bs >> 1,
    bdm = (1 << bd) - 1;

var log2 = Math.log(2);

function zeros(n) {
    var r = new Array(n);

    while (n-- > 0) r[n] = 0;
    return r;
}

function zclip(r) {
    var n = r.length;
    if (r[n - 1]) return r;
    while (n > 1 && r[n - 1] == 0) n--;
    return r.slice(0, n);
}

// returns bit length of integer x
function nbits(x) {
    var n = 1,
        t;
    if ((t = x >>> 16) != 0) {
        x = t;
        n += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        n += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        n += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        n += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        n += 1;
    }
    return n;
}

function badd(a, b) {
    var al = a.length;
    var bl = b.length;

    if (al < bl) return badd(b, a);

    var r = new Array(al);
    var c = 0,
        n = 0;

    for (; n < bl; n++) {
        c += a[n] + b[n];
        r[n] = c & bm;
        c >>>= bs;
    }
    for (; n < al; n++) {
        c += a[n];
        r[n] = c & bm;
        c >>>= bs;
    }
    if (c) r[n] = c;
    return r;
}

function bsub(a, b) {
    var al = a.length;
    var bl = b.length;

    if (bl > al) return [];
    if (bl == al) {
        if (b[bl - 1] > a[bl - 1]) return [];
        if (bl == 1) return [a[0] - b[0]];
    }

    var r = new Array(al);
    var c = 0;

    for (var n = 0; n < bl; n++) {
        c += a[n] - b[n];
        r[n] = c & bm;
        c >>= bs;
    }
    for (; n < al; n++) {
        c += a[n];
        r[n] = c & bm;
        c >>= bs;
    }
    if (c) return [];

    return zclip(r);
}

function ip(w, n, x, y, c) {
    var xl = x & bdm;
    var xh = x >> bd;

    var yl = y & bdm;
    var yh = y >> bd;

    var m = xh * yl + yh * xl;
    var l = xl * yl + ((m & bdm) << bd) + w[n] + c;
    w[n] = l & bm;
    c = xh * yh + (m >> bd) + (l >> bs);
    return c;
}

// Multiple-precision squaring, HAC Algorithm 14.16

function bsqr(x) {
    var t = x.length;
    var n = 2 * t;
    var r = zeros(n);
    var c = 0;
    var i, j;

    for (i = 0; i < t; i++) {
        c = ip(r, 2 * i, x[i], x[i], 0);
        for (j = i + 1; j < t; j++) {
            c = ip(r, i + j, 2 * x[j], x[i], c);
        }
        r[i + t] = c;
    }

    return zclip(r);
}

// Multiple-precision multiplication, HAC Algorithm 14.12

function bmul(x, y) {
    var n = x.length;
    var t = y.length;
    var r = zeros(n + t - 1);
    var c, i, j;

    for (i = 0; i < t; i++) {
        c = 0;
        for (j = 0; j < n; j++) {
            c = ip(r, i + j, x[j], y[i], c);
        }
        r[i + n] = c;
    }

    return zclip(r);
}

function toppart(x, start, len) {
    var n = 0;
    while (start >= 0 && len-- > 0) n = n * bx2 + x[start--];
    return n;
}

// Multiple-precision division, HAC Algorithm 14.20

function bdiv(a, b) {
    var n = a.length - 1;
    var t = b.length - 1;
    var nmt = n - t;

    // trivial cases; a < b
    if (n < t || n == t && (a[n] < b[n] || n > 0 && a[n] == b[n] && a[n - 1] < b[n - 1])) {
        this.q = [0];
        this.mod = a;
        return this;
    }

    // trivial cases; q < 4
    if (n == t && toppart(a, t, 2) / toppart(b, t, 2) < 4) {
        var x = a.concat();
        var qq = 0;
        var xx;
        for (; ;) {
            xx = bsub(x, b);
            if (xx.length == 0) break;
            x = xx;
            qq++;
        }
        this.q = [qq];
        this.mod = x;
        return this;
    }

    // normalize
    var shift2 = Math.floor(Math.log(b[t]) / log2) + 1;
    var shift = bs - shift2;

    var x = a.concat();
    var y = b.concat();

    if (shift) {
        for (i = t; i > 0; i--) y[i] = ((y[i] << shift) & bm) | (y[i - 1] >> shift2);
        y[0] = (y[0] << shift) & bm;
        if (x[n] & ((bm << shift2) & bm)) {
            x[++n] = 0;
            nmt++;
        }
        for (i = n; i > 0; i--) x[i] = ((x[i] << shift) & bm) | (x[i - 1] >> shift2);
        x[0] = (x[0] << shift) & bm;
    }

    var i, j, x2;
    var q = zeros(nmt + 1);
    var y2 = zeros(nmt).concat(y);
    for (; ;) {
        x2 = bsub(x, y2);
        if (x2.length == 0) break;
        q[nmt]++;
        x = x2;
    }

    var yt = y[t],
        top = toppart(y, t, 2)
    for (i = n; i > t; i--) {
        var m = i - t - 1;
        if (i >= x.length) q[m] = 1;
        else if (x[i] == yt) q[m] = bm;
        else q[m] = Math.floor(toppart(x, i, 2) / yt);

        var topx = toppart(x, i, 3);
        while (q[m] * top > topx) q[m]--;

        //x-=q[m]*y*b^m
        y2 = y2.slice(1);
        x2 = bsub(x, bmul([q[m]], y2));
        if (x2.length == 0) {
            q[m]--;
            x2 = bsub(x, bmul([q[m]], y2));
        }
        x = x2;
    }
    // de-normalize
    if (shift) {
        for (i = 0; i < x.length - 1; i++) x[i] = (x[i] >> shift) | ((x[i + 1] << shift2) & bm);
        x[x.length - 1] >>= shift;
    }

    this.q = zclip(q);
    this.mod = zclip(x);
    return this;
}

function simplemod(i, m) // returns the mod where m < 2^bd
{
    var c = 0,
        v;
    for (var n = i.length - 1; n >= 0; n--) {
        v = i[n];
        c = ((v >> bd) + (c << bd)) % m;
        c = ((v & bdm) + (c << bd)) % m;
    }
    return c;
}

function bmod(p, m) {
    if (m.length == 1) {
        if (p.length == 1) return [p[0] % m[0]];
        if (m[0] < bdm) return [simplemod(p, m[0])];
    }

    var r = bdiv(p, m);
    return r.mod;
}

// Barrett's modular reduction, HAC Algorithm 14.42

function bmod2(x, m, mu) {
    var xl = x.length - (m.length << 1);
    if (xl > 0) return bmod2(x.slice(0, xl).concat(bmod2(x.slice(xl), m, mu)), m, mu);

    var ml1 = m.length + 1,
        ml2 = m.length - 1,
        rr;
    //var q1=x.slice(ml2)
    //var q2=bmul(q1,mu)
    var q3 = bmul(x.slice(ml2), mu).slice(ml1);
    var r1 = x.slice(0, ml1);
    var r2 = bmul(q3, m).slice(0, ml1);
    var r = bsub(r1, r2);

    if (r.length == 0) {
        r1[ml1] = 1;
        r = bsub(r1, r2);
    }
    for (var n = 0; ; n++) {
        rr = bsub(r, m);
        if (rr.length == 0) break;
        r = rr;
        if (n >= 3) return bmod2(r, m, mu);
    }
    return r;
}

// Modular exponentiation, HAC Algorithm 14.79

function bexpmod(g, e, m) {
    var a = g.concat();
    var l = e.length - 1;
    var n = nbits(e[l]) - 2;

    for (; l >= 0; l--) {
        for (; n >= 0; n -= 1) {
            a = bmod(bsqr(a), m);
            if (e[l] & (1 << n)) a = bmod(bmul(a, g), m);
        }
        n = bs - 1;
    }
    return a;
}

// Modular exponentiation using Barrett reduction

function bmodexp(g, e, m) {
    var a = g.concat();
    var l = e.length - 1;
    var n = m.length * 2;
    var mu = zeros(n + 1);
    mu[n] = 1;
    mu = bdiv(mu, m).q;

    n = nbits(e[l]) - 2;

    for (; l >= 0; l--) {
        for (; n >= 0; n -= 1) {
            a = bmod2(bsqr(a), m, mu);
            if (e[l] & (1 << n)) a = bmod2(bmul(a, g), m, mu);
        }
        n = bs - 1;
    }
    return a;
}

// -----------------------------------------------------
// Compute s**e mod m for RSA public key operation

function RSAencrypt(s, e, m) { return bexpmod(s, e, m); }

// Compute m**d mod p*q for RSA private key operations.

function RSAdecrypt(m, d, p, q, u) {
    var xp = bmodexp(bmod(m, p), bmod(d, bsub(p, [1])), p);
    var xq = bmodexp(bmod(m, q), bmod(d, bsub(q, [1])), q);

    var t = bsub(xq, xp);
    if (t.length == 0) {
        t = bsub(xp, xq);
        t = bmod(bmul(t, u), q);
        t = bsub(q, t);
    } else {
        t = bmod(bmul(t, u), q);
    }
    return badd(bmul(t, p), xp);
}

// -----------------------------------------------------------------
// conversion functions: num array <-> multi precision integer (mpi)
// mpi: 2 octets with length in bits + octets in big endian order

function mpi2b(s) {
    var bn = 1,
        r = [0],
        rn = 0,
        sb = 256;
    var c, sn = s.length;
    if (sn < 2) {
        alert('string too short, not a MPI');
        return 0;
    }

    var len = (sn - 2) * 8;
    var bits = s.charCodeAt(0) * 256 + s.charCodeAt(1);
    if (bits > len || bits < len - 8) {
        alert('not a MPI, bits=' + bits + ",len=" + len);
        return 0;
    }

    for (var n = 0; n < len; n++) {
        if ((sb <<= 1) > 255) {
            sb = 1;
            c = s.charCodeAt(--sn);
        }
        if (bn > bm) {
            bn = 1;
            r[++rn] = 0;
        }
        if (c & sb) r[rn] |= bn;
        bn <<= 1;
    }
    return r;
}

function b2mpi(b) {
    var bn = 1,
        bc = 0,
        r = [0],
        rb = 1,
        rn = 0;
    var bits = b.length * bs;
    var n, rr = '';

    for (n = 0; n < bits; n++) {
        if (b[bc] & bn) r[rn] |= rb;
        if ((rb <<= 1) > 255) {
            rb = 1;
            r[++rn] = 0;
        }
        if ((bn <<= 1) > bm) {
            bn = 1;
            bc++;
        }
    }

    while (rn && r[rn] == 0) rn--;

    bn = 256;
    for (bits = 8; bits > 0; bits--)
        if (r[rn] & (bn >>= 1)) break;
    bits += rn * 8;

    rr += String.fromCharCode(bits / 256) + String.fromCharCode(bits % 256);
    if (bits)
        for (n = rn; n >= 0; n--) rr += String.fromCharCode(r[n]);
    return rr;
}
/* The following functions are (c) 2000 by John M Hanna and are
 * released under the terms of the Gnu Public License.
 * You must freely redistribute them with their source -- see the
 * GPL for details.
 *  -- Latest version found at http://sourceforge.net/projects/shop-js
 */

var rSeed = [],
    Rs = [];
var Sr, Rsl, Rbits, Rbits2;
var Rx = 0,
    Ry = 0;

// javascript's random 0 .. n
function r(n) {
    return Math.floor(Math.random() * n);
}

function ror(a, n) {
    n &= 7;
    return n ? ((a >> n) | ((a << (8 - n)) & 255)) : a;
}

// seed the random number generator with entropy in s
function seed(s) {
    var n = 0,
        nn = 0;
    var x, y, t;

    while (n < s.length) {
        while (n < s.length && s.charCodeAt(n) <= 32) n++;
        if (n < s.length) rSeed[nn] = parseInt("0x" + s.substr(n, 2));
        n += 3;
        nn++;
    }

    Rsl = rSeed.length;
    Sr = r(256);
    Rbits = 0;

    if (Rs.length == 0) {
        for (x = 0; x < 256; x++) Rs[x] = x;
    }
    y = 0;
    for (x = 0; x < 256; x++) {
        y = (rSeed[x] + s[x] + y) % 256;
        t = s[x];
        s[x] = s[y];
        s[y] = t;
    }
    Rx = Ry = 0;
    alert("Random seed updated. Seed size is: " + Rsl);
}

// generate a random number 0 .. 255 uses entropy from seed
function rc() {
    var t;
    // this first bit is basically RC4

    Rx = ++Rx & 255;
    Ry = (Rs[Rx] + Ry) & 255;
    t = Rs[Rx];
    Rs[Rx] = Rs[Ry];
    Rs[Ry] = t;
    Sr ^= Rs[(Rs[Rx] + Rs[Ry]) & 255];

    // xor with javascripts rand, just in case there's good entropy there
    Sr ^= r(256);

    Sr ^= ror(rSeed[r(Rsl)], r(8));
    Sr ^= ror(rSeed[r(Rsl)], r(8));
    return Sr;
}

// random number between 0 .. n -- based on repeated calls to rc
function rand(n) {
    if (n == 2) {
        if (!Rbits) {
            Rbits = 8;
            Rbits2 = rc(256);
        }
        Rbits--;
        var r = Rbits2 & 1;
        Rbits2 >>= 1;
        return r;
    }

    var m = 1;

    r = 0;
    while (n > m && m > 0) {
        m <<= 8;
        r = (r << 8) | rc();
    }
    if (r < 0) r ^= 0x80000000;
    return r % n;
}

// ------------------------------------------------------------
// functions for generating keys
// ------------------------------------------------------------

function beq(a, b) // returns 1 if a == b
{
    if (a.length != b.length) return 0;

    for (var n = a.length - 1; n >= 0; n--) {
        if (a[n] != b[n]) return 0;
    }
    return 1;
}

function blshift(a, b) // binary left shift b bits
{
    var n, c = 0;
    var r = new Array(a.length);

    for (n = 0; n < a.length; n++) {
        c |= (a[n] << b);
        r[n] = c & bm;
        c >>= bs;
    }
    if (c) r[n] = c;
    return r;
}

function brshift(a) // unsigned binary right shift 1 bit
{
    var c = 0,
        n, cc;
    var r = new Array(a.length);

    for (n = a.length - 1; n >= 0; n--) {
        c <<= bs;
        cc = a[n];
        r[n] = (cc | c) >> 1;
        c = cc & 1;
    }
    n = r.length;
    if (r[n - 1]) return r;
    while (n > 1 && r[n - 1] == 0) n--;
    return r.slice(0, n);
}

function bgcd(uu, vv) // return greatest common divisor
{
    // algorythm from http://algo.inria.fr/banderier/Seminar/Vallee/index.html

    var d, t, v = vv.concat(),
        u = uu.concat();
    for (; ;) {
        d = bsub(v, u);
        if (beq(d, [0])) return u;
        if (d.length) {
            while ((d[0] & 1) == 0) d = brshift(d); // v=(v-u)/2^val2(v-u)
            v = d;
        } else {
            t = v;
            v = u;
            u = t; // swap u and v
        }
    }
}

function rnum(bits) {
    var n, b = 1,
        c = 0;
    var a = [];
    if (bits == 0) bits = 1;
    for (n = bits; n > 0; n--) {

        if (rand(2)) a[c] |= b;
        b <<= 1;
        if (b == bx2) {
            b = 1;
            c++;
        }
    }
    return a;
}

var Primes = [3, 5, 7, 11, 13, 17, 19,
    23, 29, 31, 37, 41, 43, 47, 53,
    59, 61, 67, 71, 73, 79, 83, 89,
    97, 101, 103, 107, 109, 113, 127, 131,
    137, 139, 149, 151, 157, 163, 167, 173,
    179, 181, 191, 193, 197, 199, 211, 223,
    227, 229, 233, 239, 241, 251, 257, 263,
    269, 271, 277, 281, 283, 293, 307, 311,
    313, 317, 331, 337, 347, 349, 353, 359,
    367, 373, 379, 383, 389, 397, 401, 409,
    419, 421, 431, 433, 439, 443, 449, 457,
    461, 463, 467, 479, 487, 491, 499, 503,
    509, 521, 523, 541, 547, 557, 563, 569,
    571, 577, 587, 593, 599, 601, 607, 613,
    617, 619, 631, 641, 643, 647, 653, 659,
    661, 673, 677, 683, 691, 701, 709, 719,
    727, 733, 739, 743, 751, 757, 761, 769,
    773, 787, 797, 809, 811, 821, 823, 827,
    829, 839, 853, 857, 859, 863, 877, 881,
    883, 887, 907, 911, 919, 929, 937, 941,
    947, 953, 967, 971, 977, 983, 991, 997,
    1009, 1013, 1019, 1021
];


var sieveSize = 4000;
var sieve0 = -1 * sieveSize;
var sieve = [];
var lastPrime = 0;

function nextPrime(p) // returns the next prime > p
{
    var n;
    if (p == Primes[lastPrime] && lastPrime < Primes.length - 1) {
        return Primes[++lastPrime];
    }
    if (p < Primes[Primes.length - 1]) {
        for (n = Primes.length - 2; n > 0; n--) {
            if (Primes[n] <= p) {
                lastPrime = n + 1;
                return Primes[n + 1];
            }
        }
    }
    // use sieve and find the next one
    var pp, m;
    // start with p
    p++;
    if ((p & 1) == 0) p++;
    for (; ;) {
        // new sieve if p is outside of this sieve's range
        if (p - sieve0 > sieveSize || p < sieve0) {
            // start new sieve
            for (n = sieveSize - 1; n >= 0; n--) sieve[n] = 0;
            sieve0 = p;
            primes = Primes.concat();
        }

        // next p if sieve hit
        if (sieve[p - sieve0] == 0) {
            // sieve miss
            // update sieve if p divisable

            // find a prime divisor
            for (n = 0; n < primes.length; n++) {
                if ((pp = primes[n]) && p % pp == 0) {
                    for (m = p - sieve0; m < sieveSize; m += pp) sieve[m] = pp;
                    p += 2;
                    primes[n] = 0;
                    break;
                }
            }
            if (n >= primes.length) {
                // possible prime
                return p;
            }
        } else {
            p += 2;
        }
    }
}

function divisable(n, max) // return a factor if n is divisable by a prime less than max, else return 0
{
    if ((n[0] & 1) == 0) return 2;
    for (c = 0; c < Primes.length; c++) {
        if (Primes[c] >= max) return 0;
        if (simplemod(n, Primes[c]) == 0) return Primes[c];
    }
    c = Primes[Primes.length - 1];
    for (; ;) {
        c = nextPrime(c);
        if (c >= max) return 0;
        if (simplemod(n, c) == 0) return c;
    }
}

function bPowOf2(pow) // return a bigint
{
    var r = [],
        n, m = Math.floor(pow / bs);
    for (n = m - 1; n >= 0; n--) r[n] = 0;
    r[m] = 1 << (pow % bs);
    return r;
}

function mpp(bits) // returns a Maurer Provable Prime, see HAC chap 4 (c) CRC press
{
    if (bits < 10) return [Primes[rand(Primes.length)]];
    if (bits <= 20) return [nextPrime(rand(1 << bits))];

    var c = 10,
        m = 20,
        B = bits * bits / c,
        r, q, I, R, n, a, b, d, R2, nMinus1;

    if (bits > m * 2) {
        for (; ;) {
            r = Math.pow(2, Math.random() - 1);
            if (bits - r * bits > m) break;
        }
    } else {
        r = 0.5
    }

    q = mpp(Math.floor(r * bits) + 1);
    I = bPowOf2(bits - 2);
    I = bdiv(I, q).q;
    Il = I.length;
    for (; ;) {
        // generate R => I < R < 2I
        R = [];
        for (n = 0; n < Il; n++) R[n] = rand(bx2);
        R[Il - 1] %= I[Il - 1];
        R = bmod(R, I);
        if (!R[0]) R[0] |= 1; // must be greater or equal to 1
        R = badd(R, I);
        n = blshift(bmul(R, q), 1); // 2Rq+1
        n[0] |= 1;
        if (!divisable(n, B)) {
            a = rnum(bits - 1);
            a[0] |= 2; // must be greater than 2
            nMinus1 = bsub(n, [1]);
            var x = bmodexp(a, nMinus1, n);
            if (beq(x, [1])) {
                R2 = blshift(R, 1);
                b = bsub(bmodexp(a, R2, n), [1]);
                d = bgcd(b, n);
                if (beq(d, [1])) return n;
            }
        }
    }
}

// -------------------------------------------------

function sub2(a, b) {
    var r = bsub(a, b);
    if (r.length == 0) {
        this.a = bsub(b, a);
        this.sign = 1;
    } else {
        this.a = r;
        this.sign = 0;
    }
    return this;
}

function signedsub(a, b) {
    if (a.sign) {
        if (b.sign) return sub2(b, a);
        else {
            this.a = badd(a, b);
            this.sign = 1;
        }
    } else {
        if (b.sign) {
            this.a = badd(a, b);
            this.sign = 0;
        } else return sub2(a, b);
    }
    return this;
}

// from  Bryan Olson <bryanolson@my-deja.com> 

function modinverse(x, n) // returns x^-1 mod n
{
    var y = n.concat(),
        t, r, bq, a = [1],
        b = [0],
        ts;

    a.sign = 0;
    b.sign = 0;

    while (y.length > 1 || y[0]) {
        t = y.concat();
        r = bdiv(x, y);
        y = r.mod;
        q = r.q;
        x = t;
        t = b.concat();
        ts = b.sign;
        bq = bmul(b, q);
        bq.sign = b.sign;
        r = signedsub(a, bq);
        b = r.a;
        b.sign = r.sign;
        a = t;
        a.sign = ts;
    }

    if (x.length != 1 || x[0] != 1) return [0]; // No inverse; GCD is x

    if (a.sign) {
        a = bsub(n, a);
    }
    return a;
}

// -------------------------------------------------
// function to generate keys

var rsa_p, rsa_q, rsa_e, rsa_d, rsa_pq, rsa_u;

function rsaKeys(bits) {
    var c, p1q1;

    bits = parseInt(bits);
    rsa_q = mpp(bits);
    rsa_p = mpp(bits);
    p1q1 = bmul(bsub(rsa_p, [1]), bsub(rsa_q, [1]));

    for (c = 5; c < Primes.length; c++) {
        rsa_e = [Primes[c]];
        rsa_d = modinverse(rsa_e, p1q1);
        if (rsa_d.length != 1 || rsa_d[0] != 0) break;
    }
    rsa_pq = bmul(rsa_p, rsa_q);
    rsa_u = modinverse(rsa_p, rsa_q);

    return;
}
/*
 * conversion functions:
 * - num array to string
 * - string to hex
 */

function s2b(s) {
    var bn = 1,
        r = [0],
        rn = 0,
        sn = 0,
        sb = 256;
    var bits = s.length * 8;

    for (var n = 0; n < bits; n++) {
        if ((sb <<= 1) > 255) {
            sb = 1;
            c = s.charCodeAt(sn++);
        }
        if (bn > bm) {
            bn = 1;
            r[++rn] = 0;
        }
        if (c & sb) r[rn] |= bn;
        bn <<= 1;
    }
    return r;
}

function b2s(b) {
    var bn = 1,
        bc = 0,
        r = [0],
        rb = 1,
        rn = 0;
    var bits = b.length * bs;
    var n, rr = '';

    for (n = 0; n < bits; n++) {
        if (b[bc] & bn) r[rn] |= rb;
        if ((rb <<= 1) > 255) {
            rb = 1;
            r[++rn] = 0;
        }
        if ((bn <<= 1) > bm) {
            bn = 1;
            bc++;
        }
    }

    while (rn >= 0 && r[rn] == 0) rn--;
    for (n = 0; n <= rn; n++) rr += String.fromCharCode(r[n]);
    return rr;
}

function s2hex(s) {
    var result = '';
    for (var i = 0; i < s.length; i++) {
        c = s.charCodeAt(i);
        result += ((c < 16) ? "0" : "") + c.toString(16);
    }
    return result;
}

function hex2s(hex) {
    var r = '';
    if (hex.indexOf("0x") == 0 || hex.indexOf("0X") == 0) hex = hex.substr(2);

    if (hex.length % 2) hex += '0';

    for (var i = 0; i < hex.length; i += 2)
        r += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
    return r;
}
/* OpenPGP radix-64/base64 string encoding/decoding
 * Copyright 2005 Herbert Hanewinkel, www.haneWIN.de
 * version 1.0, check www.haneWIN.de for the latest version

 * This software is provided as-is, without express or implied warranty.  
 * Permission to use, copy, modify, distribute or sell this software, with or
 * without fee, for any purpose and by any individual or organization, is hereby
 * granted, provided that the above copyright notice and this paragraph appear 
 * in all copies. Distribution as a part of an application or binary must
 * include the above copyright notice in the documentation and/or other materials
 * provided with the application or distribution.
 */

var b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function s2r(t) {
    var a, c, n;
    var r = '',
        l = 0,
        s = 0;
    var tl = t.length;

    for (n = 0; n < tl; n++) {
        c = t.charCodeAt(n);
        if (s == 0) {
            r += b64s.charAt((c >> 2) & 63);
            a = (c & 3) << 4;
        } else if (s == 1) {
            r += b64s.charAt((a | (c >> 4) & 15));
            a = (c & 15) << 2;
        } else if (s == 2) {
            r += b64s.charAt(a | ((c >> 6) & 3));
            l += 1;
            if ((l % 60) == 0) r += "\n";
            r += b64s.charAt(c & 63);
        }
        l += 1;
        if ((l % 60) == 0) r += "\n";

        s += 1;
        if (s == 3) s = 0;
    }
    if (s > 0) {
        r += b64s.charAt(a);
        l += 1;
        if ((l % 60) == 0) r += "\n";
        r += '=';
        l += 1;
    }
    if (s == 1) {
        if ((l % 60) == 0) r += "\n";
        r += '=';
    }

    return r;
}

function r2s(t) {
    var c, n;
    var r = '',
        s = 0,
        a = 0;
    var tl = t.length;

    for (n = 0; n < tl; n++) {
        c = b64s.indexOf(t.charAt(n));
        if (c >= 0) {
            if (s) r += String.fromCharCode(a | (c >> (6 - s)) & 255);
            s = (s + 2) & 7;
            a = (c << s) & 255;
        }
    }
    return r;
}