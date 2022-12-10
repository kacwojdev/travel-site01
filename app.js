let controller;
let slideScene;
let pageScene;
let detailScene;

function animationSlides() {
    // init controller
    controller = new ScrollMagic.Controller();
    //select some things
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    // loop over each slide
    sliders.forEach((slide, index, slides)=>{
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');
        //GSAP
        const slideTl = gsap.timeline({defaults: {duration: 1, ease: 'power3.inOut'}});
        slideTl.fromTo(revealImg, {x: '0%'}, {x: '100%'});
        slideTl.fromTo(img, {scale: 2}, {scale: 1}, "-=1");
        slideTl.fromTo(revealText, {x: '0%'}, {x: '100%'}, "-=0.75");
        slideTl.fromTo(nav, {y: '-100%'}, {y: '0%'}, '-=1')
        // create scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        })
        .setTween(slideTl)
        // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: 'slide'})
        .addTo(controller)
        // new animation
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, {y: '0%'}, {y: '50%'});
        pageTl.fromTo(slide, {opacity: 1, scale: 1}, {opacity: 0, scale: 0});
        pageTl.fromTo(nextSlide, {y: '50%'}, {y: '0%'}, '-=0.5');
        //create new scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0,
        })
        .setPin(slide, {pushFollowers: false})
        .setTween(pageTl)
        // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: 'page', indent: 200})
        .addTo(controller)
    })
}

const mouse = document.querySelector('.cursor');
const mouseText = mouse.querySelector('span');
const burger = document.querySelector('.burger');
function cursor(event) {
    mouse.style.top = event.pageY + 'px';
    mouse.style.left = event.pageX + 'px';
}

function activeCursor(event) {
    const item = event.target;
    if(item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add('nav-active');
    } else {
        mouse.classList.remove('nav-active');
    }
    if (item.classList.contains('explore')) {
        mouse.classList.add('explore-active');
        gsap.to('.title-swipe', 1, {y: '0%'})
        mouseText.innerText = 'Tap'
    } else {
        mouse.classList.remove('explore-active');
        gsap.to('.title-swipe', 1, {y: '100%'})
        mouseText.innerText = ''
    }
}

function navToggle(event) {
    const burgerMenuWidth = window.innerHeight > window.innerWidth ? window.innerHeight*1.2 : window.innerWidth*1.2;
    console.log(window.innerHeight > window.innerWidth)
    if (!event.target.classList.contains('active')) {
        event.target.classList.add('active');
        gsap.to('.line1', 0.5, { rotate: '45',y: 5, background: 'black'});
        gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: 'black'});
        gsap.to('#logo', 0.5, { color: 'black' });
        gsap.to('.nav-bar', 0.5, {clipPath: `circle(${burgerMenuWidth}px at 100% -10%)`});
        document.body.classList.add('hide');
    } else {
        event.target.classList.remove('active');
        gsap.to('.line1', 0.5, { rotate: '0',y: 0, background: 'white'});
        gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: 'white'});
        gsap.to('#logo', 0.5, { color: 'white' });
        gsap.to('.nav-bar', 0.5, {clipPath: 'circle(50px at 100% -10%)'});
        document.body.classList.remove('hide');
    }
    
}

// barba page transitions
const logo = document.querySelector('#logo');
barba.init({
    views: [
        {
            namespace: 'home',
            beforeEnter() {
                animationSlides()
                logo.href = './index.html'
            },
            beforeLeave() {
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: 'fashion',
            beforeEnter() {
                logo.href = '../index.html'
                detailAnimation()
                gsap.fromTo('.nav-header', 1, {y: '100%'}, {y: '0%', ease: "power2.inOut"})
            },
        }
    ],
    transitions: [
        {
            leave({ current, next }) {
                let done = this.async();
                // an animation
                const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
                tl.fromTo(
                    current.container, 
                    1, 
                    {opacity: 1}, 
                    {opacity: 0, onComplete: done}
                );
                tl.fromTo('.swipe', 0.75, {x: '-100%'}, {x: '0%', onComplete: done}, "--=0.5");
            },
            enter({ current, next }) {
                let done = this.async();
                // scroll to top
                window.scrollTo(0,0);
                // an animation
                const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
                tl.fromTo('.swipe', 0.75, {x: '0'}, {x: '-100%', stagger: 0.25, onComplete: done});
                tl.fromTo(
                    next.container, 
                    1, 
                    {opacity: 0}, 
                    {opacity: 1}
                );
            }
        }
    ]
});

function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');
    slides.forEach((slide, index, slides) => {
        const slideTl = gsap.timeline({defaults: {duration: 1}});
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector('img');
        slideTl.fromTo(slide, {opacity: 1}, {opacity: 0});
        slideTl.fromTo(nextSlide, {opacity: 0}, {opacity: 1}, '-=1')
        slideTl.fromTo(nextImg, {x: '50%'}, {x: '0%'}, '-=1');
        //scene
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0,
        })
        .setPin(slide, {pushFollowers: false})
        .setTween(slideTl)
        // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: 'detailScene', indent: 200})
        .addTo(controller);
    })
}

// event listeners
burger.addEventListener('click', navToggle)
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);

animationSlides();