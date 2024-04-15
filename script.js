'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//add event listener for each button in btnsOpenModal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

/* this serves the same function as the forEach above, but looks messier
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);
*/

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  //get coordinates to where to scroll to
  const s1coords = section1.getBoundingClientRect();
  console.log(e.target.getBoundingClientRect());
  console.log(window.pageXOffset, pageYOffset); //current postion of scroll from left side and top side for x and y
  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); //height and width of page

  //scrolling
  //this scrolling works but is very quick
  /*
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  ); //need to add the current scroll position
*/

  //add smooth scrolling by passing in object so we can specify the behavior, but is the "oldschool method" by manually calculating the scroll positions
  /*
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
*/
  //new way that only works with more modern browsers
  section1.scrollIntoView({ behavior: 'smooth' }); //only need to pass in object with behavior, don't need to calculate the current positions
});

/////////////////////////////
//Page Navigation
//add event handler to each element, but is intensive/inefficient if many buttons with event listener (ex: 10,000 buttons?)
//more efficient --> use event delagation to your advantage --> use the fact that event handlers bubble up, and handle at common parent

//forEach method for adding event handler to each button
/*
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    console.log('LINK');
    //automatically goes to the correct header section becasue of anchors #headername
    e.preventDefault();
    const id = this.getAttribute('href'); //#section--1, #section--2, #section--3
    console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    }); //put the section that we want to scroll to into the href in the html
  });
});
*/

//event delegation method
//1. add event listener to common parent element
//2. determine the element that originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);
  e.preventDefault();
  //Matching strategy
  //check if target has the nav__link class from e.target
  if (e.target.classList.contains('nav__link')) {
    console.log('LINK');
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

//Tabbed component
console.log('tabbed component');

//again, not a good practice cause it is inefficient and can slow the page down
//tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));

//use event delegation instead by assigning an event handler to the parent element
tabsContainer.addEventListener('click', function (e) {
  //clicking on the number in the button clicks the span element
  //need to also find which button when the span element is clicked
  //need to find the parent element that is always a tab button, even if span is clicked
  //using the closest will return the closest element
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //add guard clause to remove error when the tabs container (not a tab) is clicked
  if (!clicked) return;

  //change style of active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //select sibling elements by going to parent then selecting the children
    //find a parent that matches the keyword with closest method --> better than going up manually a couple times
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(e => {
      if (e !== link) e.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//can't just pass in handleHover (e,0.5) because addEventListener needs a function input
//you can still use function(e), and then pass in the handleHover function to be executed --> function calls a function
/*
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
*/

//can also do handleHover.bind and use this keyword in the original funciton --> need to add this to the original function
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation
//menu bar becoming attached to the top of the page after scrolling down past a certain position
//scroll event is inefficient and should be avoided if possible
/*
const initialCoords = section1.getBoundingClientRect();
console.log('initial coords');
console.log(initialCoords);
window.addEventListener('scroll', function (e) {
  //make it sticky once the first section is reached
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

//Better way of implementing stickyness
//intersection Observer API

//create new intersection observer
/*
const observerOptions = {
  root: null, //element that the target is intersecting --> null has entire viewport
  threshold: [0, 0.2], //percentage of intersection for which observer function will be called back --> what percent of the target will it take to be in the view port to trigger the function callback
};
//can also pass in arrays --> can get multiple function call backs for each element of the array
const observerCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};
//whenever the first section is intersecting the viewport at X%, the function will get called (no matter if scrolling up or down)
//function will get called with two arguments
const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe(section1);

*/

//want to have stickyness when header is completely out of view
const header = document.querySelector('.header');

//calculate height
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, //when 0% of header is visible, call the observer function
  rootMargin: `${navHeight}px`, //visual margin
});

headerObserver.observe(header);

//Reveal sections as we scroll to them
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return; //guard clause --> if section is not intersecting --> exit the function

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //remove the observer as each section is revealed --> don't need more events after initial observation --> improves performance
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
//need to use the target to distinguish which section is being called
//we apply the observer to all of the sections, but don't want all of the sections to be revealed at once

//Lazy loading images
//performance is key for website --> images can take a long time to load
//have a low res image loaded in the beginning, then replace with the larger image once you scroll to it in the data attribute

const imgTargets = document.querySelectorAll('img[data-src]'); //don't want all images --> some will not be lazy loaded --> lazy ones have the data property in the CSS
console.log('xxxxxxxxxxxxxxx');
console.log(imgTargets);
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //entry.target.classList.remove('lazy-img')
  //JS will load the new image behind the scenes, and will trigger a LOAD event
  //can't just remove the lazy-img class because it will cause longer loading times on the web browser for slow networks
  //remove the blur after the load is finished
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // put in root margin to load images before they get scrolled to
});

imgTargets.forEach(img => imgObserver.observe(img));

//Implementing sliders
//Have three slide elements --> previous slide and next slide hides on the left and right areas of the middle slide
//move each of the slides over
//before implementation --> all slides are sitting on top of each other
const slides = document.querySelectorAll('.slide');
//create starting conditions by having slides side by side
slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
let currentSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');
//slide at 0%, 100%, 200%, 300%...
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

//create dots below slides
const createDots = function () {
  slides.forEach(function (s, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

//Activate different color of dot for active dot
const activateDot = function (slide) {
  //first deactivate all dots
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  //add class to current dot
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
//go to the next slide by changing the value in the transform

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
//have webpage start at the first slide
goToSlide(0);

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

//add slider event listener to be able to use left and right arrows on keyboard
document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowLeft') previousSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
activateDot(currentSlide);
//////////////////////////////
/////////////////////////////
///////////////////////////
//////////////////////////
//LECTURE

//Selecting elements

//for the following methods, don't need to use specific selector
//grab entire html
console.log(document.documentElement);
//grab header
console.log(document.head);
//grab body
console.log(document.body);

//const header = document.querySelector('.header'); //returns the first element that matches this element
//const allSections = document.querySelectorAll('.section'); //grab all that meets this critera and store in a node list
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); //return HTML collection, considered live (different from node list)
console.log(allButtons);
console.log(document.getElementsByClassName('btn')); //returns htmlcollection

//Creating and inserting elements
//.insertAdjacentHTML --> see bankist application for use case. very useful

const message = document.createElement('div'); // returns DOM element that can be stored in a variable. not yet in DOM, but we can use it now. object that represent DOM element
message.classList.add('cookie-message');
/*
message.textContent =
  'We use cookies for improved functionality and analytics.';
  */
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it!</button>';
//insert in the header
//header.prepend(message); //adds element as the first child of header
//header.append(message); //add element as the last child of header --> live element and cannot be in multiple places at once. first it was prepended, then it was appended
//append in this case moved the child element after it was added by prepend

//header.append(message.cloneNode(true)); //passing in true means all childs are copied. this will create two pop ups (one fromt the prepend, and this new one since it is a clone)

header.before(message); //first the cookie message, and then the header
//header.after(message); //first the header, and then the cookie message. these two are considered as siblings

//Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //recent change
    //before, needed to remove the child element by selecting the parent element first then removing the child
    //message.parentElement.removeChild(message);
  });

//Styles, attributes and classes
//style
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height); //only works for inline styles (something that we set manually)
console.log(message.style.backgroundColor);
console.log(getComputedStyle(message)); //a way to get non-inline styles, get info on things we did not define manually
console.log(getComputedStyle(message).color);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//change css colors
document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes
//src, alt, class all attributes of img
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.getAttribute('src'));

//can set properties
logo.alt = 'Beautiful minimalist logo';
console.log(logo.alt);
//will only read standard properties
console.log(logo.designer); //designer property added, but cannot be read since not standard property
//below will allow you to find a non-standard property
console.log(logo.getAttribute('designer'));
//add an attribute
logo.setAttribute('company', 'Bankist');

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes
//has to start with 'data' in the html file --> data-xxxx
//add data property to html file, and can now be called with .dataset
console.log(logo.dataset.versionNumber); //need to use camelcase when calling with JS, use dash in HTML

//Classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

//don't use the below method --> will override all of the other existing classes, and only allows to change one class
//logo.className = 'Alex';

//Events
const h1 = document.querySelector('h1');
/*
h1.addEventListener('mouseenter', function (e) {
  alert('addEventListener: reading the heading');
});

//onevent property directly on element
h1.onmouseenter = function (e) {
  alert('onmouseenter: reading the heading');
};

//remove event handler in case you don't need it anymore
const alertH1 = function (e) {
  alert('alertH1 function: reading the heading');
  h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);
*/

//Event bubbler/capturing
//rgb(255,255,255)
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

//attach event handler to Features button, and all of its parent elements
//within nav__link

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget); //e.target where the event happened, not the event that the event handler was attached
  //e.currentTarget is where the event is attached
  //stop propagation
  //e.stopPropagation()
});

//parent of nav__link
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

//parent of nav__link and nav__links
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

//DOM Traversing
/*
const h1again = document.querySelector('h1');
//going downwards: child elements
console.log(h1again.querySelectorAll('.highlight')); //will go down as deep as necesssary down the DOM tree
console.log(h1again.childNodes); //all direct children of h1, node list
console.log(h1again.children); //HTML collection --> live collection, only for direct children
h1again.firstElementChild.style.color = 'white';
h1again.lastElementChild.style.color = 'orangered';

//upwards: parent elements
console.log(h1again.parentNode); //all direct parents of h1, node list
console.log(h1again.parentElement);

h1again.closest('.header').style.background = 'var(--gradient-secondary)'; //selects closest parent of h1 element, find the parent element that is closest to the child you're looking at
h1again.closest('h1').style.background = 'var(--gradient-primary)'; //in this case, the closes parent that matches the provided element (h1), then it returns that exact element. closest h1 is the element itself

//sideways: sibling elements
//can only access direct siblings (previous and next one)
console.log(h1again.previousElementSibling); //h1 is the first child so null
console.log(h1again.nextElementSibling); //next one is h4
console.log(h1again.previousSibling);
console.log(h1again.nextSibling);
//all siblings --> move up to the parent element and then select all children
console.log(h1again.parentElement.children); //includes h1 itself. HTML collection, not array, but can spread to make into an array
[...h1again.parentElement.children].forEach(function (e) {
  if (e != h1) e.style.transform = 'scale(0.5)';
});
*/

//lifecycle dom events
//from when a user enters the webpage to when they leave
document.addEventListener('DOMContentLoaded', function (e) {
  //just HTML and JS need to be loaded (no images)
  console.log('HTML parsed and DOM tree built');
});
//only want JS code to be executed until after HTML is parsed
//this is handled in the HTML file via the src "script.js" tag at the end of the HTML file
//therefore, don't need to listen for the HTML loaded event
//if using vanilla JS from jquery, need to use document.ready function => equivalent to DOM content loaded event

//load event
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

//before unload event
//created immediately before a user is about to leave the page
//can use to ask if user actually wants to leave the page
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});

//Efficient script loading: defer and async
//can have the script tag (src for normal, async src for asyc, and defer async) in the head or the body
//having the tag in the head for normal is not ideal --> this is why it is normally tagged and the body end
//for async, script is loaded while the html is being parsed through
//for defer, script is still loaded async, but script is executed at the end. HTML is allowed to fully load without interruption
//having async and defer in the body end doesn't make much sense, would only put it in the head

//defer is normally the best use for if you need to load the script in a specific order
//older browsers may not support async and defer
