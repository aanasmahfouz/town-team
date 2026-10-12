import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSplitTextAnimations } from './split-text.js';
import { initFooterTextPressure } from './text-pressure.js';
import './menu-hover-images.js';
import { initLoadingTransition } from './curtain-reveal.js';

import LocomotiveScroll from 'locomotive-scroll';

const locomotiveScroll = new LocomotiveScroll({
  lenisOptions:{
    lerp:.05,
    smoothWheel:true
  }
});
window.__locomotiveScroll = locomotiveScroll;

gsap.registerPlugin(ScrollTrigger);

function setupLenisScrollTrigger() {
  const lenis = locomotiveScroll.lenisInstance;
  if (!lenis) {
    requestAnimationFrame(setupLenisScrollTrigger);
    return;
  }

  const globalProgressBar = document.getElementById('global-scroll-progress');

  lenis.on("scroll", (e) => {
    ScrollTrigger.update();
    if (globalProgressBar) {
      const p = typeof e.progress === 'number' ? e.progress : (lenis.scroll / (document.documentElement.scrollHeight - window.innerHeight));
      globalProgressBar.style.width = `${Math.min(Math.max((p || 0) * 100, 0), 100)}%`;
    }
  });

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();
}

setupLenisScrollTrigger();

// Fallback scroll progress listener
window.addEventListener('scroll', () => {
  const bar = document.getElementById('global-scroll-progress');
  if (!bar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max > 0) {
    bar.style.width = `${Math.min(Math.max((window.scrollY / max) * 100, 0), 100)}%`;
  }
}, { passive: true });

  // Shery.imageEffect(".contentimg", {
  //   style: 5,
  //   gooey: true,
  //   // debug:true,
  //   config:{"a":{"value":2,"range":[0,30]},"b":{"value":0.75,"range":[-1,1]},"zindex":{"value":-9996999,"range":[-9999999,9999999]},"aspect":{"value":0.7241529912187108},"ignoreShapeAspect":{"value":true},"shapePosition":{"value":{"x":0,"y":0}},"shapeScale":{"value":{"x":0.5,"y":0.5}},"shapeEdgeSoftness":{"value":0,"range":[0,0.5]},"shapeRadius":{"value":0,"range":[0,2]},"currentScroll":{"value":0},"scrollLerp":{"value":0.07},"gooey":{"value":true},"infiniteGooey":{"value":false},"growSize":{"value":4,"range":[1,15]},"durationOut":{"value":1,"range":[0.1,5]},"durationIn":{"value":1.5,"range":[0.1,5]},"displaceAmount":{"value":0.5},"masker":{"value":true},"maskVal":{"value":1.23,"range":[1,5]},"scrollType":{"value":0},"geoVertex":{"range":[1,64],"value":1},"noEffectGooey":{"value":true},"onMouse":{"value":1},"noise_speed":{"value":0.5,"range":[0,10]},"metaball":{"value":0.33,"range":[0,2]},"discard_threshold":{"value":0.5,"range":[0,1]},"antialias_threshold":{"value":0.01,"range":[0,0.1]},"noise_height":{"value":0.5,"range":[0,2]},"noise_scale":{"value":10,"range":[0,100]}}
  // });
// lenis()
// const scroll = new FeatherScroll();
// Initialize curtain reveal transition
initLoadingTransition();

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024;

if (canHover) {
  function cursor(){
    window.addEventListener("mousemove",function(e){
        gsap.to(".cursor",{
            x:e.clientX,
            y:e.clientY,
            opacity:1,
            stagger:.005,
        })
    })
  }
  cursor()
  var cursors=document.querySelector(".cursor")
  var cursorh1=document.querySelector(".cursor h1")
  document.querySelectorAll(".cursoreffect").forEach(function(e){
      e.addEventListener("mouseenter",function(elem){
          const data=`${e.getAttribute("data-text")}`
          if(data=="null" || data=="undefined"){
              if (cursors) cursors.innerHTML=""
          }
          else{
              if (cursors) cursors.innerHTML=data
          }
          gsap.to(".cursor",{
              scale:7
          })
      })
  })
  document.querySelectorAll(".cursoreffect").forEach(function(e){
      e.addEventListener("mouseleave",function(elem){
          if (cursors) cursors.innerHTML=""
          gsap.to(".cursor",{
              scale:1
          })
      })
  })
}

gsap.from(".videodiv",{
  scale:.7,
  scrollTrigger:{
    trigger:".videodiv",
    scroller: document.documentElement,
    start:"top 80%",
    end:"bottom bottom",
    scrub:2,
    // markers:true
  }
})

//   var maintl=gsap.timeline();
  const cluttertext = (element) => {
    const Tag = document.querySelector(element);
    let clutter = "";
  
    Tag.textContent.split("").forEach((e) => {
      if(e==="") clutter+=`<span>$nbsp;</span>`
      clutter += `<span class="inline-block">${e}</span>`;
    });
  
    // Updating the HTML content of the element with the animated spans
    Tag.innerHTML = clutter;
  };
  cluttertext(".products-wrapper>h1");
function products(){
  gsap.from(".products-wrapper>h1>span", {
    opacity: 0,
    x: 200,
    stagger: {
      each: 0.1,
      from: "start",
    },
    scrollTrigger: {
      scroller: document.documentElement,
      trigger: ".products-wrapper",
      start: "top 20%",
      end: "top 0%",
      scrub: 1,
      // markers: true,
    },
  });
const isMobile = window.innerWidth < 768;
const tl = gsap.timeline({
    scrollTrigger: {
      scroller: document.documentElement,
      trigger: ".products",
      start: "top 0",
      end: isMobile ? "top -350%" : "top -650%",
      scrub: 1,
      pin: true,
      // markers: true,
    //   stagger:1
    },
  });
  const imgDelay = isMobile ? 0.12 : 0.2;
  tl.to("#right1",{
      top: "-120%",
      rotate: "-20deg",
      left: "-25%",
    //   stagger: 0.2,
    },'a');
    tl.to("#left1",{
        top: "-120%",
        rotate: "20deg",
        left: "40%",
        delay: imgDelay
        // stagger: 0.2,
    },'a');
  tl.to("#right2",{
      top: "-120%",
      rotate: "-20deg",
      left: "-25%",
      delay: imgDelay * 2
    //   stagger: 0.2,
    },'a');
    tl.to("#left2",{
        top: "-120%",
        rotate: "20deg",
        left: "40%",
        delay: imgDelay * 3
        // stagger: 0.2,
    },'a');
  tl.to("#right3",{
      top: "-120%",
      rotate: "-20deg",
      left: "-25%",
      delay: imgDelay * 4
    //   stagger: 0.2,
    },'a');
    tl.to("#left3",{
        top: "-120%",
        rotate: "20deg",
        left: "40%",
        delay: imgDelay * 5
        // stagger: 0.2,
    },'a');
    tl.to(".products-wrapper>h1>span", {
      opacity: 0,
      x: -200,
      stagger: {
        each: 0.1,
        from: "start",
      },
      scrollTrigger: {
        scroller: document.documentElement,
        trigger: ".products-wrapper",
        start: "top -670%",
        end: "top 0%",
        scrub: 1,
        // markers: true,
      },
    });
    
// var productimg=document.querySelectorAll(".products-imgs")
// var productimgh1=document.querySelectorAll(".products-img>h1")
cluttertext(".product1");
cluttertext(".product2");
cluttertext(".product3");
cluttertext(".product4");
cluttertext(".product5");
cluttertext(".product6");


if (canHover) {
  const allImgs = document.querySelectorAll(".product-imgs");
  allImgs.forEach((img, index) => {
    img.addEventListener("mouseenter", () => {
      if (index === 0) {
        gsap.to("#overlay1", {
          opacity: 1,
        });
        gsap.to(".product1>span", {
          opacity: 1,
          // x:200,
          scale: 1,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } else if (index === 1) {
        gsap.to("#overlay2", {
          opacity: 1,
        });
        gsap.to(".product2>span", {
          opacity: 1,
          scale: 1,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } else if (index === 2) {
        gsap.to("#overlay3", {
          opacity: 1,
        });
        gsap.to(".product3>span", {
          opacity: 1,
          scale: 1,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } else if (index === 3) {
        gsap.to("#overlay4", {
          opacity: 1,
        });
        gsap.to(".product4>span", {
          opacity: 1,
          scale: 1,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } 
      else if(index===4){
        gsap.to("#overlay5", {
          opacity: 1,
        });
        gsap.to(".product5>span", {
          opacity: 1,
          scale: 1,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      }
      else{
        gsap.to("#overlay6", {
          opacity: 1,
        });
        gsap.to(".product6>span", {
          opacity: 1,
          scale: 1,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      }
    });
    img.addEventListener("mouseleave", () => {
      if (index === 0) {
        gsap.to("#overlay1", {
          opacity: 0,
          delay: 0.5,
        });
        gsap.to(".product1>span", {
          opacity: 0,
          scale: 0,
          // x:-200,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } else if (index === 1) {
        gsap.to("#overlay2", {
          opacity: 0,
          delay: 0.5,
        });
        gsap.to(".product2>span", {
          opacity: 0,
          scale: 0,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } else if (index === 2) {
        gsap.to("#overlay3", {
          opacity: 0,
          delay: 0.5,
        });
        gsap.to(".product3>span", {
          opacity: 0,
          scale: 0,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } else if (index === 3) {
        gsap.to("#overlay4", {
          opacity: 0,
          delay: 0.5,
        });
        gsap.to(".product4>span", {
          opacity: 0,
          scale: 0,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      } 
      else if(index===4) {
        gsap.to("#overlay5", {
          opacity: 0,
          delay: 0.5,
        });
        gsap.to(".product5>span", {
          opacity: 0,
          scale: 0,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      }
      else {
        gsap.to("#overlay6", {
          opacity: 0,
          delay: 0.5,
        });
        gsap.to(".product6>span", {
          opacity: 0,
          scale: 0,
          stagger: {
            amount: 0.3,
            from: "start",
          },
        });
      }
    });
  });
}
}
products()

//  `/public/images/${i.toString().padStart(4, "0")}.webp`
function frames(){
  const canvas = document.querySelector("#frame");
  const frameWrap = document.querySelector(".frame-scroll-wrap");
  const featuresSection = document.querySelector(".features");
  if (!canvas || !frameWrap || !featuresSection) return;
  const context = canvas.getContext("2d");
  const INTRO_SCALE = 0.72;
  const INTRO_RADIUS = 56;
  const FRAME_COUNT = 421;
  const frameState = {
    currentindex: 0,
    maxindex: FRAME_COUNT
  };

  const images = new Array(FRAME_COUNT);
  let lastDrawnIndex = -1;

  function drawFrame(img) {
    if (!img || !img.complete || !img.naturalWidth) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const newwidth = img.width * scale;
    const newheight = img.height * scale;
    const offsetX = (canvas.width - newwidth) / 2;
    const offsetY = (canvas.height - newheight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(img, offsetX, offsetY, newwidth, newheight);
  }

  function loadimage(index) {
    const frameIndex = Math.min(Math.max(0, Math.floor(index)), FRAME_COUNT - 1);
    frameState.currentindex = frameIndex;

    if (images[frameIndex] && images[frameIndex].complete && images[frameIndex].naturalWidth) {
      drawFrame(images[frameIndex]);
      lastDrawnIndex = frameIndex;
      return;
    }

    if (lastDrawnIndex >= 0 && images[lastDrawnIndex] && images[lastDrawnIndex].complete) {
      drawFrame(images[lastDrawnIndex]);
    } else {
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const prev = frameIndex - offset;
        const next = frameIndex + offset;
        if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth) {
          drawFrame(images[prev]);
          lastDrawnIndex = prev;
          break;
        }
        if (next < FRAME_COUNT && images[next]?.complete && images[next]?.naturalWidth) {
          drawFrame(images[next]);
          lastDrawnIndex = next;
          break;
        }
      }
    }
  }

  // Load Frame 1 immediately for instant visual
  const firstImg = new Image();
  firstImg.onload = () => {
    images[0] = firstImg;
    loadimage(0);
    const fw = document.querySelector('.framewrap');
    if (fw) fw.style.opacity = '1';
  };
  firstImg.src = '/lookbook-frames/1.webp';

  // Lazy-preload remaining frames when user approaches .features section
  let preloadStarted = false;
  function startPreloading() {
    if (preloadStarted) return;
    preloadStarted = true;

    let currentBatch = 1;
    const batchSize = 12;

    function loadNextBatch() {
      if (currentBatch >= FRAME_COUNT) return;
      const end = Math.min(currentBatch + batchSize, FRAME_COUNT);
      for (let i = currentBatch; i < end; i++) {
        const img = new Image();
        const idx = i;
        img.onload = () => {
          images[idx] = img;
        };
        img.src = `/lookbook-frames/${i + 1}.webp`;
      }
      currentBatch = end;
      if (currentBatch < FRAME_COUNT) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadNextBatch, { timeout: 150 });
        } else {
          setTimeout(loadNextBatch, 50);
        }
      }
    }

    loadNextBatch();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startPreloading();
      }
    });
  }, { rootMargin: '1000px 0px' });

  observer.observe(featuresSection);

  function startanimation() {
    gsap.set(frameWrap, {
      scale: INTRO_SCALE,
      borderRadius: INTRO_RADIUS,
    });

    const scrollTimelineDuration = 9;
    const progressIndicator = document.getElementById('videoProgressIndicator');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".features",
        scroller: document.documentElement,
        start: "top top",
        end: "700% top",
        scrub: 2,
        pin: true,
        onEnter: () => {
          if (progressIndicator) progressIndicator.classList.add('active');
        },
        onLeave: () => {
          if (progressIndicator) progressIndicator.classList.remove('active');
        },
        onEnterBack: () => {
          if (progressIndicator) progressIndicator.classList.add('active');
        },
        onLeaveBack: () => {
          if (progressIndicator) progressIndicator.classList.remove('active');
        },
        onUpdate: (self) => {
          if (progressBarFill) {
            progressBarFill.style.width = `${self.progress * 100}%`;
          }
          if (progressText) {
            const progress = Math.round(self.progress * 100);
            if (progress < 25) progressText.textContent = 'Exploring Collection';
            else if (progress < 50) progressText.textContent = 'Discovering Details';
            else if (progress < 75) progressText.textContent = 'Viewing Craftsmanship';
            else if (progress < 100) progressText.textContent = 'Almost There';
            else progressText.textContent = 'Experience Complete';
          }
        }
      }
    });

    tl.to(frameState, {
      currentindex: frameState.maxindex - 1,
      ease: "none",
      duration: scrollTimelineDuration,
      onUpdate: function () {
        loadimage(frameState.currentindex);
      },
    }, 0);

    tl.fromTo(frameWrap, {
      scale: INTRO_SCALE,
      borderRadius: INTRO_RADIUS,
    }, {
      keyframes: [
        { scale: 1.03, borderRadius: 12, duration: 1, ease: "power2.out" },
        { scale: 1, borderRadius: 0, duration: 0.35, ease: "power1.inOut" },
      ],
    }, 0);
  }

  startanimation();

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      loadimage(frameState.currentindex);
    }, 100);
  }, { passive: true });
}
frames();

function para_effect(){
  var clutter="";
document.querySelector(".para-effect")
.textContent.split("")
.forEach(function(e){
  if(e==="") clutter+=`<span>$nbsp;</span>`
  clutter+=`<span>${e}</span>`;
})
document.querySelector(".para-effect").innerHTML=clutter;
var tl3=gsap.timeline({
  scrollTrigger:{
      trigger:".para-effect",
      scroller: document.documentElement,
      scrub:1,
      start:"top 95%",  // يبدأ بدري لما العنصر يوصل 95% من الشاشة
      end:"top 35%",    // ينتهي لما يوصل 35% من الشاشة
      // pin:true,
      // markers:true
  }
});
gsap.set(".para-effect span",{
  opacity:.01
})
tl3.to(".para-effect span",{
  opacity:1, 
  stagger:.03,
  ease:"power4",
},'para')
// tl3.to("#leftimg",{
//   x:1000
// },'para')

}
para_effect()

function shopping(){
  gsap.to(".shopping-wrapper",{
    x:"-200vw",
    scrollTrigger:{
      trigger:".shopping",
      scroller: document.documentElement,
      scrub:2,
      start:"0% 0%",
      end:"bottom top",
      pin:true,
      markers:true
    }
  })
}
// shopping()

const textEffect = () => {
  // Splitting the text content into individual letters and wrapping each in a span with a class
  document.querySelectorAll(".text-effect").forEach(function (e) {
    [...e.children].forEach(function (h) {
      var clutter = "";
      h.textContent.split("").forEach(function (l) {
        const char = l === " " ? "\u00A0" : l;
        clutter += `<span>${char}</span>`;
      });
      h.innerHTML = clutter;
    });
  });
  //animation for mouse hover on desktop only
  if (canHover) {
    document.querySelectorAll(".text-effect").forEach(function (e) {
      e.addEventListener("mouseenter", function () {
        gsap.to(e.children[0].querySelectorAll("span"), {
          y: "-106%",
          stagger: {
            amount: 0.2,
          },
          duration: 0.4,
        });
        gsap.to(e.children[1].querySelectorAll("span"), {
          y: "-100%",
          stagger: {
            amount: 0.2,
          },
          duration: 0.4,
        });
      });
    });
    //animation for mouseleave
    document.querySelectorAll(".text-effect").forEach(function (e) {
      e.addEventListener("mouseleave", function () {
        gsap.to(e.children[0].querySelectorAll("span"), {
          y: "0%",
          stagger: {
            amount: 0.2,
          },
        });
        gsap.to(e.children[1].querySelectorAll("span"), {
          y: "0%",
          stagger: {
            amount: 0.2,
          },
        });
      });
    });
  }
};
textEffect();

const oldRightBtn = document.querySelector(".right"); if (oldRightBtn) oldRightBtn.addEventListener("click",function(){
  var navtl=gsap.timeline()
  gsap.to(".sidenav",{
      right:0,
      duration:1,
      ease:"power4",
  })
  navtl.from(".sidenav .foottext-wrap",{
      x:100,
      opacity:0,
      duration:1,
      ease:"power4",
      stagger:.3,
  })
  gsap.to("#collection-title,.right",{
    opacity:0
  })
})

const oldCrossBtn = document.querySelector(".cross"); if (oldCrossBtn) oldCrossBtn.addEventListener("click",function(){
  gsap.to(".sidenav",{
    right:"-40%",
    duration:1,
    ease:"power4",  
  })
  gsap.to("#collection-title,.right",{
    opacity:1
  })
})

// Initialize SplitText animations
initSplitTextAnimations();

// Initialize TextPressure for footer
initFooterTextPressure();

// Initialize Video Text Timeline safely
setTimeout(() => {
  if (typeof initVideoTextTimeline === 'function') {
    initVideoTextTimeline();
  }
}, 500);


// Video Visibility Optimization (pause when off-screen)
function initVideoVisibilityOptimization() {
  const videos = document.querySelectorAll('video');
  if (!('IntersectionObserver' in window) || videos.length === 0) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        if (vid.paused) vid.play().catch(() => {});
      } else {
        if (!vid.paused) vid.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(v => videoObserver.observe(v));
}
initVideoVisibilityOptimization();
