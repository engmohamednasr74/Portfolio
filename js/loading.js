gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    duration: 1.5,
    delay: 2.5,
    display: "none",
  },
);

gsap.fromTo(
  ".logo-name",
  {
    y: 50,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 1.5,
    delay: 0.5,
  },
);

gsap.fromTo(
  ".particles,.hero,.services,.projects,.certifications,.contact",
  {
    opacity: 0,
    display: "none",
  },
  {
    opacity: 1,
    duration: 1.5,
    delay: 3,
    display: "block",
  },
);

gsap.fromTo(
  ".navbar,.modal-overlay,.success-modal,.footer",
  {
    opacity: 0,
    display: "none",
  },
  {
    opacity: 1,
    duration: 1.5,
    delay: 3,
    display: "flex",
  },
);
