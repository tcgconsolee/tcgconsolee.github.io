let t = ["H","O","M", "E", "A", "B", "O", "U", "T","W", "O", "R", "K", "S", "C", "O", "N", "T", "A", "C", "T", "A","A", "K", "A", "S", "H", "A", "S", "H", "O", "K"];
let time;
$(".menu-item span").each(function (i) {
    $(this).mouseenter(function () {
        if (t[i]) {
            $(this).html(t[i]);
        }
        randomize($(this));
    })
})

function randomize(e) {
    var t = e.html();
    let arr = shuffle(["&", "*", "%", "#", "!", "@", "$", "^", "/",".", ";", ":", "?", ">", "<", "{", "}", "[", "]", "|", "-", ")", "(", "_", "+", "=", ","]);
    arr.push(t);
    arr.forEach(function (r, i) {
        time = 50 * i;
        setTimeout(() => {
            e.html(r);
        }, time);
    })
}
function shuffle(array) {
    let newArr = [];
    for(let currentIndex = 0;currentIndex<5;currentIndex++) {
        let randomIndex = Math.floor(Math.random() * array.length);
        newArr[currentIndex]= array[randomIndex]
    }
    return newArr;
}
let currentPage = "home";
$(".clickable").click(function () {
    if(currentPage == $(this).attr('id')) return;
    else {
        currentPage = $(this).attr('id')
    }
    $(".menu-item").each(function() {
        $(this).animate({ bottom: "10%" }, 1000)
    })
    $(".menu").animate({height: "100vh"}, 1000)
    $(".w-e").show(1000)
    if(currentPage == "home") {
        setTimeout(() => {
            spotlight();
            $(".menu").animate({    height: "30vmin"  }, 1000)
        }, 1500);
    } else {
        setTimeout(() => {
            spotlight()
            $(".menu").animate({ height: "10vmin" }, 1000)
            $(".w-e").hide(1000)
            $(".menu-item").each(function () {
                $(this).animate({ bottom: "50%" }, 1000)
            })
        }, 1500);
    }
})
$(".more").click(function() {
    $(".blur").show()
    $(".blur").animate({ opacity: "1"}, 1000)
    $(".more-g").css("display", "grid")
    $(".more-g").animate({top: "75%"}, 1000)
}) 
$(".red, .yellow").click(function() {
    $(".blur").animate({opacity: "0"}, 1000);
    setTimeout(() => {
        $(".blur").hide();
        $(".more-g").hide()
    }, 1000);
    $(".more-g").animate({top: "175%"}, 1000)
})
function spotlight() {
    $(".home").hide()
    $(".about").hide()
    $(".works").hide()
    $(".contact").hide()
    $(".more-g").hide()
    $(".more-g").css("top", "175%")
    $(".blur").hide()
    $(".blur").css("opacity", "0")

    $(`.${currentPage}`).show()
}