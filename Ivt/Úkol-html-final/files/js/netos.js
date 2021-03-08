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
        alert("Na file:/// to nepujde, spust alespon na http://, nejlepe na https://. Proto te ted presmeruji na stranku, kde by vve snad melo jit :D");
        window.location.href = "https://oskarbukovsky.github.io/bukovsky-ukoly-ivt.github.io/Ivt/Úkol-html-final/netos.html";
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