(function () {
    let isok = true;
    $('.celan h2').click(() => {
        if (isok) {
            $('.celan').stop().animate({ 'right': 0 }, 1000);
            $('.celan h2').html('在线客服 >')
        } else {
            $('.celan').stop().animate({ 'right': -200 }, 1000);
            $('.celan h2').html('在线客服 <')
        }
        isok = !isok
    });

    $('.gotop').click(() => {
        let scrollTOP = window.scrollY;
        let ding = setInterval(() => {
            scrollTOP -= 30;
            if (scrollTOP <= 0) {
                clearInterval(ding);
            }
            window.scrollTo(0, scrollTOP);
        }, 30);
    })
})();