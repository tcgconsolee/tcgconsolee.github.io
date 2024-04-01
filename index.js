const mouseelement = document.getElementById('mouse')
        const trail = []
        for(let i = 2; i > 0.5; i-=0.1) {
            trail[Math.round((2-i)*10)] = mouseelement.cloneNode();
            trail[Math.round((2-i)*10)].style.width =  i + "vw"
            trail[Math.round((2-i)*10)].style.height = i + "vw"
            trail[Math.round((2-i)*10)].style.mixBlendMode = "normal"
            mouseelement.appendChild(trail[Math.round((2-i)*10)])
        }
        const interactables = document.getElementsByClassName('interactable')
        document.addEventListener('mousemove', (e) => {
            mouseelement.style.left = ((e.clientX) - 10) + "px"; 
            mouseelement.style.top = ((e.clientY) - 10) + "px";
            for(let i = 0; i < trail.length; i++) {
                setTimeout(() => {
                    trail[i].style.left = ((e.clientX) - (10-i)) + "px";
                    trail[i].style.top = ((e.clientY) - (10-i)) + "px";
                }, i*10)
            }
        })

let currentPage = "home";
const wall = document.getElementsByClassName('wall')[0]
Array.from(document.getElementsByClassName("pages")).forEach(page => {
    page.addEventListener("click", () => {
        if(page.textContent == currentPage) return;
        wall.style.animation = "down 500ms forwards"
        setTimeout(() => {
        document.getElementsByClassName(currentPage)[0].style.display = "none";
        document.getElementsByClassName(page.textContent)[0].style.display = "block";
        currentPage = page.textContent;
        },500)
        setTimeout(() => {
        wall.style.animation = "up 500ms forwards"
        }, 1000)
    })
})
document.getElementById("disc").addEventListener("click", () => {
    window.open("https://discord.com/users/835432207735848970");
})
document.getElementById("git").addEventListener("click", () => {
    window.open("https://github.com/tcgconsolee")
})
document.getElementsByClassName("github")[0].addEventListener("click", () => {
    window.open("https://github.com/tcgconsolee")
})
document.getElementsByClassName("projects")[0].addEventListener("click", () => {
    window.open("https://consolee.tk/projects")
})
document.getElementsByClassName("games")[0].addEventListener("click", () => {
    window.open("https://consolee.tk/games")
})
