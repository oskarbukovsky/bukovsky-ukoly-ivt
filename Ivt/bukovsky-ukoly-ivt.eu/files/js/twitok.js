//Basic variables setup
var videoid = [
    "EKgGSf-xTMg",
    "vyMZMXGdtMg",
    "50ROAdFgXYk",
    "16efRG5H_Vc",
    "TXBHIaWIsiY",
    "dKFUgnMjkzE",
    "TiC8pig6PGE",
    "Re1lEVCur1o",
    "SLP9mbCuhJc",
    "UYwNN0SSL44",
    "8jwnb_D_c90",
    "KaqC5FnvAEc",
    "FyUfZeoMeB8",
    "aIrkI43NIIU",
    "_MBgz9h7GGM",
    "jF_v3Vkr6oA",
    "Pgc9CQIe-Rw",
    "8Xm0zLDyoVQ"
];
var options = {
    loadingHtml: 'Loading... (When too long use http:// instead file:///)',
    padding: 64,
    nextSelector: 'a.jscroll-next:last',
};
var random = 0;
var select = 0;
var adid = [
    "https://mailbakery.s3.amazonaws.com/wp-content/uploads/2016/02/26175914/Boden-backpack-email-template.gif",
    "https://s3images.coroflot.com/user_files/individual_files/185620_6wcm_8mdznsg4kebl2s7pmxnw.gif",
    "https://static.wixstatic.com/media/5f69f7_097285147a7847778d88fa2d089512e9~mv2.gif",
    "https://i.pinimg.com/originals/ea/d5/fb/ead5fb90b3ee304ba41d77d46e2e09e3.gif",
    "https://99designs-blog.imgix.net/blog/wp-content/uploads/2019/08/drought_hack.gif?auto=format&q=60&fit=max&w=930",
    "https://infiniteingenuity.files.wordpress.com/2015/03/animation.gif",
    "http://lygraphiccreation.com/wp-content/uploads/2021/01/Remax-verticle-ad.gif",
    "https://images.squarespace-cdn.com/content/v1/5522bd34e4b0fb7c985d19fc/1582561528332-9WGCMEFAI4EY3NUG7GQK/ke17ZwdGBToddI8pDm48kCmmcPwKhitccElk4vU07LN7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmkGR7qflJKimCj-9rwyR42Xif25iN_8dnk8w4J8AunEMOYmutIdOB5mrtDvixbh_u/AdMeter2019_w02.gif?format=2500w",
    "https://i.pinimg.com/originals/ad/e2/54/ade254af5c16425eff5f2f15f060ed15.gif"
];
var adloop = getRandomInt(adid.length);
var url;
var nameList = [
    'Time', 'Past', 'Future', 'Dev',
    'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
    'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
    'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
    'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
    'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
    'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
    'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
    'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
    'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
    'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
    'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
    'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
    'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
    'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
    'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
    'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
    'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
    'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
    'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
];

var finalName = ""

//OnLoad alternative
$(document).ready(function () {
    detectColorScheme();
    randomad();
    if (document.location.protocol != "https:") {
        alert("Načítání dokumentů kvůli CORS na file:/// nepůjde, a některým prohlížečum občas vadí přístup ke kameře na http://, takže nejlépe https:// všude. Proto tě teď přesměruju na stránku, kde by vše snad mělo jít :D")
        window.location.href = "https://oskarbukovsky.github.io/bukovsky-ukoly-ivt.github.io/Ivt/%C3%9Akol-Twi%C5%A4ok/";
    }
});

//Random Ad every 30s 
var intervalId = window.setInterval(function () {
    randomad()
}, 30000);

//Webcam setup
Webcam.set({
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#my_camera');

function take_snapshot() {
    // take snapshot and get image data
    Webcam.snap(function (data_uri) {
        // display results in page
        document.getElementById('results').innerHTML =
            '<img src="' + data_uri + '"/>';
    });
}

//"AI" for face detection
const config = { smoothness: 0.30, enableBalancer: false, multiFace: true };
const customSource = CY.createSource.fromVideoElement(document.getElementById("my_video"));
loader = CY.loader()
    .addModule(CY.modules().FACE_EMOTION.name, config)
    .addModule(CY.modules().FACE_DETECTOR.name, config)
    .source(customSource)
    .powerSave(0)
    .load()
    .then(({ start, stop }) => start());

window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
    if (evt.detail.output.emotion.Happy > (evt.detail.output.emotion.Angry * 0.75 + evt.detail.output.emotion.Neutral * 0.65)) {
        document.getElementById('add-error').innerHTML = "Super fotka :D";
    } else {
        document.getElementById('add-error').innerHTML = "Usmívej se :)";
    };
});

window.addEventListener(CY.modules().FACE_DETECTOR.eventName, (evt) => {
    if (evt.detail.totalFaces == 0) {
        document.getElementById('add-error').innerHTML = "Nevidím obličej :(";
    } else {
        document.getElementById('add-error').innerHTML = "Usmívej se :)";
    }
});

//Random number gen.
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//determines if the user has a set theme
function detectColorScheme() {
    theme = "light";    //default to light

    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            var theme = "dark";
        }
    }
    if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        var theme = "dark";
    }
    if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        var theme = "light";
    }

    //dark theme preferred, set document with a `data-theme` attribute
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
    if (theme == "light") {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

//When click on button, change color scheme
$("#change-theme").click(function () {
    if (document.documentElement.getAttribute("data-theme") == "dark") {
        localStorage.setItem('theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

//Ad clicking loop
$(".twitok-right").click(function () {
    randomad()
});

//Advertisement function
function randomad() {
    url = 'url(' + adid[adloop] + ')'
    $(".twitok-right").css("background-image", url);
    adloop++;
    if (adloop > adid.length - 1) {
        adloop = 0;
    }
}

//Random post author gen
function randName() {
    finalName = nameList[Math.floor(Math.random() * nameList.length)];
    finalName += nameList[Math.floor(Math.random() * nameList.length)];
    if (Math.random() > 0.5) {
        finalName += nameList[Math.floor(Math.random() * nameList.length)];
    }
    if (Math.random() > 0.25) {
        return finalName;
    } else if (Math.random() > 0.5) {
        finalName += getRandomInt(99);
    } else if (Math.random() > 0.75) {
        finalName += "_" + getRandomInt(99);
    } else {
        finalName += "-" + getRandomInt(99);
    }
    return finalName;
};

//Url gen function
function newRandomVideo(select) {
    // Make sure to not display the same video twice in a row
    var temp = random;
    while (temp == random) temp = Math.floor(Math.random() * videoid.length);
    random = temp;
    //Return video url
    return "https://www.youtube.com/embed/" + videoid[random] + "?rel=0&modestbranding=1&autohide=1&mute=1&showinfo=0&controls=0&autoplay=0&autopause=1&loop=1&iv_load_policy=3&enablejsapi=1&version=3&playerapiid=" + select + "?playlist=" + videoid[random];
}

//When user scrolled to the end add content
$('.scroll').jscroll();
$('.scroll').jscroll(options);

//Scroll to top when click on main element
$('.title-container').click(function () {
    $('.scroll').animate({
        scrollTop: 0
    }, 'slow');
});