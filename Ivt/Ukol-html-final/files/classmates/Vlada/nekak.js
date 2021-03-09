var sad = 0;
function leva() {
    const levy = document.getElementById("levy");
    levy.style.transform = "scale(0)";
    document.getElementById("kliknihot").style.display="none";
    document.getElementById("buttonlevy").style.display="none";
    sad=sad+1
}
function prava() {
    const pravy = document.getElementById("pravy");
    pravy.style.transform = "scale(0)";
    document.getElementById("kliknihot").style.display="none";
    document.getElementById("buttonpravy").style.display="none";
    sad=sad+1
    if (sad==2)
    {
        location.href="javascript:delay('why.html')";
    }
}
function delay(URL) {
    setTimeout(function () { window.location = URL }, 800);
}