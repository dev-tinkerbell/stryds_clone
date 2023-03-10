class Viewport {
  constructor() {
    this.pc = "PC";
    this.mobile = "MOBILE";
    this.currentDevice = null;
    this.previouseViewport = null;
  }

  setDevice() {
    let width = window.innerWidth;
    this.previouseViewport = this.currentDevice;

    if (width > 480) {
      this.currentDevice = this.pc;
    } else {
      this.currentDevice = this.mobile;
    }

    this.excuteScript();
  }

  excuteScript() {
    if (this.currentDevice === this.previouseViewport) return;

    if (this.currentDevice === this.pc) {
      return new InteractionOnPc().render();
    }
    new InteractionOnMobile().render();

    // window.location.reload();
  }
}

class Interaction {
  constructor(toggleActions = "play pause resume reset") {
    this.toggleActions = toggleActions;
  }
}

class InteractionLottie extends Interaction {
  constructor(toggleActions) {
    super(toggleActions);
    this.lottieListElements = {
      PC: "#lottie-animation-pc",
      MOBILE: "#lottie-animation-mobile",
    };
  }

  playLottie(target) {
    LottieScrollTrigger({
      target,
      path: "https://global-uploads.webflow.com/639e76b6a0716a69a2134f59/63bd80d5bfbced1b1d641e5a_healthy-competition__animation.json",
    });

    function LottieScrollTrigger(lottieObject) {
      let playhead = { frame: 0 };
      let target = gsap.utils.toArray(lottieObject.target)[0];
      let customScrollTrigger = {
        trigger: target,
        start: "top center",
        end: "center center",
        scrub: 2,
        // markers: true,
      };
      let context = gsap.context && gsap.context();
      let animation = lottie.loadAnimation({
        container: target,
        renderer: lottieObject.renderer || "svg",
        loop: false,
        autoplay: false,
        path: lottieObject.path,
        rendererSettings: lottieObject.rendererSettings || {
          preserveAspectRatio: "xMidYMid slice",
        },
      });

      for (let p in lottieObject) {
        // let users override the ScrollTrigger defaults
        customScrollTrigger[p] = lottieObject[p];
      }

      animation.addEventListener("DOMLoaded", function () {
        let createTween = function () {
          animation.frameTween = gsap.to(playhead, {
            frame: animation.totalFrames - 1,
            ease: "none",
            onUpdate: () => animation.goToAndStop(playhead.frame, true),
            scrollTrigger: customScrollTrigger,
          });
          return () => animation.destroy && animation.destroy();
        };

        context && context.add ? context.add(createTween) : createTween();
      });

      return animation;
    }
  }
}

class InteractionOnPc extends Interaction {
  render() {
    this.setInitAnimation();
    this.setHeadeingParagraphAnimation();
    this.setHeroScrollCardsAnimation();
    this.setMockupCardsAnimation();
  }

  setInitAnimation() {
    gsap.fromTo(
      ".hero-background__heading",
      {
        scale: 0.9,
      },
      {
        scale: 1,
        duration: 1.5,
      }
    );
  }

  setHeadeingParagraphAnimation() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".is--pc .hero-scroll__wrapper-container",
          start: "top top",
          end: "bottom -40%",
          toggleActions: this.toggleActions,
          scrub: 1.5,
          // markers: true,
        },
      })
      .to(".hero-background__heading", {
        scale: 0.7,
        autoAlpha: 0,
        duration: 2,
      })
      .fromTo(
        ".hero-scroll__paragraph.is--one",
        {
          scale: 0.8,
          autoAlpha: 0,
        },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1,
        }
      )
      .set(".hero-scroll__paragraph.is--one", {
        autoAlpha: 0,
      })
      .fromTo(
        ".hero-scroll__paragraph.is--two",
        {
          scale: 0.8,
          autoAlpha: 0,
        },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 2,
        }
      );
  }

  setHeroScrollCardsAnimation() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".is--pc .hero-scroll__wrapper-container",
          start: "50% top",
          end: "200% center",
          toggleActions: this.toggleActions,
          scrub: 1.5,
          // markers: true,
        },
      })
      .fromTo(
        ".hero-scroll__wrapper",
        {
          scale: 0.5,
          rotate: "45deg",
        },
        {
          autoAlpha: 1,
          scale: 4.5,
          rotate: "225deg",
          ease: "none",
        }
      );

    gsap.to(".dim", {
      scrollTrigger: {
        trigger: ".is--pc .hero-scroll__wrapper-container",
        start: "50% top",
        end: "bottom center",
        toggleActions: this.toggleActions,
        scrub: 1.5,
        // markers: true,
      },
      autoAlpha: 0,
    });
  }

  setMockupCardsAnimation() {
    gsap.to(".mockup-cards__wrapper", {
      scrollTrigger: {
        trigger: ".mockup-cards-opening__section",
        start: "top bottom",
        end: "bottom center",
        toggleActions: this.toggleActions,
        scrub: 1.5,
        // markers: true,
      },
      scale: 1.2,
    });

    gsap.to(".mockup-cards__wrapper img[data-position]", {
      scrollTrigger: {
        trigger: ".mockup-cards-opening__section",
        start: "top bottom",
        end: "bottom 10%",
        scrub: 1.5,
        // markers: true,
      },
      x: (i, el) => el.getAttribute("data-position"),
      ease: "none",
    });
  }
}

class InteractionOnMobile extends Interaction {
  render() {
    this.setInitAnimation();
    this.setMockupCardsAnimation();
    this.setHeadingAnimation();
    this.setHeroScrollCardsAnimation();
    this.setParagraphAnimation();
  }

  setInitAnimation() {
    gsap.fromTo(
      ".mobile-hero-mockup__wrapper",
      {
        autoAlpha: 0,
        scale: 0.5,
      },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.5,
      }
    );

    gsap.to(".mobile-hero-mockup__wrapper img[data-position]", {
      x: (i, el) => `${el.getAttribute("data-position")}px`,
      duration: 1.5,
    });

    gsap.to(".hero-background__heading.is--mobile", {
      y: "-30px",
      duration: 1,
    });
  }

  setMockupCardsAnimation() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".is--mobile .hero-scroll__wrapper-container",
          start: "top top",
          end: "30% center",
          toggleActions: this.toggleActions,
          scrub: 2,
          // markers: true,
        },
      })
      .fromTo(
        ".mobile-hero-mockup__wrapper img[data-position]",
        {
          x: (i, el) => `${el.getAttribute("data-position")}px`,
        },
        {
          x: "0px",
        }
      );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".is--mobile .hero-scroll__wrapper-container",
          start: "top top",
          end: "60% center",
          toggleActions: this.toggleActions,
          scrub: 2,
          // markers: true,
        },
      })
      .fromTo(
        ".mobile-hero-mockup__wrapper",
        {
          autoAlpha: 1,
          scale: 1,
        },
        {
          autoAlpha: 0,
          scale: 0.5,
        }
      );
  }

  setHeadingAnimation() {
    gsap.to(".hero-background__heading.is--mobile", {
      scrollTrigger: {
        trigger: ".mobile-hero__section",
        start: "top top",
        end: "20% center",
        toggleActions: this.toggleActions,
        scrub: 1.5,
        // markers: true,
      },
      autoAlpha: 0,
    });
  }

  setHeroScrollCardsAnimation() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".mobile-hero__section",
          start: "32% center",
          end: "bottom bottom",
          toggleActions: this.toggleActions,
          scrub: 2,
          // markers: true,
        },
      })
      .fromTo(
        ".is--mobile .hero-scroll__wrapper",
        {
          scale: 0.5,
          rotate: "45deg",
        },
        {
          autoAlpha: 1,
          scale: 4.5,
          rotate: "225deg",
          ease: "none",
        }
      );

    gsap.to(".is--mobile .dim", {
      scrollTrigger: {
        trigger: ".mobile-hero__section",
        start: "32% center",
        end: "35% center",
        toggleActions: this.toggleActions,
        scrub: 2,
        // markers: true,
      },
      autoAlpha: 0,
    });
  }

  setParagraphAnimation() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".mobile-hero__section",
          start: "38% center",
          end: "bottom bottom",
          toggleActions: this.toggleActions,
          scrub: 2,
          // markers: true,
        },
      })
      .fromTo(
        ".is--mobile .hero-scroll__paragraph.is--1",
        {
          scale: 0.8,
          autoAlpha: 0,
        },
        {
          scale: 1,
          autoAlpha: 1,
        }
      )
      .set(".is--mobile .hero-scroll__paragraph.is--1", {
        autoAlpha: 0,
      })
      .fromTo(
        ".is--mobile .hero-scroll__paragraph.is--2",
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );
  }
}

gsap.registerPlugin(ScrollTrigger);

const viewport = new Viewport();
viewport.setDevice();

const interactionLottie = new InteractionLottie();
interactionLottie.playLottie(interactionLottie.lottieListElements.MOBILE);
interactionLottie.playLottie(interactionLottie.lottieListElements.PC);

window.addEventListener("resize", () => {
  viewport.setDevice();
});
