var i = 0;
function circulation()
{
    i++;
    if (i%2 == 1)
    {
document.getElementById("picture").src="vladimir au.png"
    }
    else if (i%2 == 0)
    {
document.getElementById("picture").src="vladimir nech.png"
    }
    if (i >= 1000)
    {
        document.getElementById("picture").src="Vladimir dead.png"
    }

document.getElementById("poke").innerHTML="Poke count: " +i;

}

