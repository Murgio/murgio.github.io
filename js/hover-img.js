{
    const lineEq = (y2, y1, x2, x1, currentVal) => {
        // y = mx + b 
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    };

    const lerp = (a,b,n) => (1 - n) * a + n * b;
    
    const distance = (x1,x2,y1,y2) => {
        var a = x1 - x2;
        var b = y1 - y2;
        return Math.hypot(a,b);
    };
    
    const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) 	{
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x : winsize.width/4 + posx + 40, y : posy + 180 }
    }
    
    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    window.addEventListener('resize', calcWinsize);
    //                    light pink                 light yellow           violet
	const colors = [["#f4baba", "#e5abab"], ["#f4ce85", "#e5be76"], ["#9f86ca", "#9077bb"]]
    const feDisplacementMapEl = document.querySelector('feDisplacementMap');

    class Menu {
        constructor() {
            this.DOM = {
                svg: document.querySelector('svg.distort'),
                menu: document.querySelector('p.hover-imgs')
            };
            this.DOM.imgs = [...this.DOM.svg.querySelectorAll('g > image')];
            this.DOM.menuLinks = [...this.DOM.menu.querySelectorAll('.quote__link')];
            this.mousePos = {x: winsize.width/2, y: winsize.height/2};
            this.lastMousePos = {
                translation: {x: winsize.width/2, y: winsize.height/2},
                displacement: {x: 0, y: 0}
            };
            this.dmScale = 0;

            this.current = -1;
            
            this.initEvents();
            requestAnimationFrame(() => this.render());
        }
        initEvents() {
            window.addEventListener('mousemove', ev => this.mousePos = getMousePos(ev));

            this.DOM.menuLinks.forEach((item, pos) => {
                charming(item);
                const letters = [...item.querySelectorAll('span')];

                const mouseenterFn = () => {
                    this.current = pos;
                    TweenMax.to(this.DOM.imgs[this.current], 0.5, {
                        ease: Quad.easeOut, 
                        opacity: 1
                    });
                    
                    TweenMax.staggerTo(letters, 0.2, {
                        ease: Sine.easeInOut,
                        y: this.lastMousePos.translation.x < this.mousePos.x ? 6 : -6,
                        startAt: {opacity: 1, y: 0},
                        opacity: 0,
                        yoyo: true,
                        yoyoEase: Expo.easeOut,
                        repeat: 1,
                        stagger: {
                            grid: [1,letters.length-1],
                            from: this.lastMousePos.translation.x < this.mousePos.x ? 'start' : 'end',
                            amount: 0.12
                        }
					});
                    document.body.style.backgroundColor = colors[this.current][0];
                    // document.documentElement.style.setProperty('--card-shadow', colors[this.current][1]);
					document.getElementById('shadowcard').style.backgroundColor = colors[this.current][1];
					document.getElementById('shadowcard').style.boxShadow = "0 0 30px 20px " + colors[this.current][1];
                };
                const mouseleaveFn = () => {
					TweenMax.to(this.DOM.imgs[this.current], 0.2, {ease: Quad.easeOut, opacity: 0});
                    document.body.style.backgroundColor = "#faf6f1";
                    //document.documentElement.style.setProperty('--card-shadow', "#ebe7e2");
					document.getElementById('shadowcard').style.backgroundColor = "#ebe7e2";
					document.getElementById('shadowcard').style.boxShadow = "0 0 30px 20px #ebe7e2";
                };
                item.addEventListener('mouseenter', mouseenterFn);
                item.addEventListener('mouseleave', mouseleaveFn);
            });
        }
        render() {
            // Translate the image on mousemove
            this.lastMousePos.translation.x = lerp(this.lastMousePos.translation.x, this.mousePos.x, 0.4);
            this.lastMousePos.translation.y = lerp(this.lastMousePos.translation.y, this.mousePos.y, 0.4);
            // clip to window boundaries
            const amountx = this.lastMousePos.translation.x - winsize.width / 2;
            const amounty = this.lastMousePos.translation.y - winsize.height / 2;
            this.DOM.svg.style.transform = `translateX(${amountx}px) translateY(${amounty}px)`;
            
            // Scale goes from 0 to 50 for mouseDistance values between 0 to 140
            this.lastMousePos.displacement.x = lerp(this.lastMousePos.displacement.x, this.mousePos.x, 0.4);
            this.lastMousePos.displacement.y = lerp(this.lastMousePos.displacement.y, this.mousePos.y, 0.4);
            const mouseDistance = distance(this.lastMousePos.displacement.x, this.mousePos.x, this.lastMousePos.displacement.y, this.mousePos.y);
            // Might be too slow -> too many calculations
            // this.dmScale = Math.min(lineEq(50, 0, 140, 0, mouseDistance), 50);
            this.dmScale = Math.min(mouseDistance, 50);
            feDisplacementMapEl.scale.baseVal = this.dmScale;

            requestAnimationFrame(() => this.render());
        }
    }

    new Menu();
}

function showhover() {
    var im = document.getElementsByClassName('distort')[0];
    im.style.display = 'block';
}
// Leaving the intro div leads to disabling the onhover effect. Included for performance boosts.
function hidehover() {
    var im = document.getElementsByClassName('distort')[0];
    im.style.display = 'none';
}