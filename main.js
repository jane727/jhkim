'use strict';

const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});


// Navbar toggle button for small screen
const toggle = document.querySelector('.navbar__toggle-btn');
const navbarMenu = document.querySelector('.navbar__menu');

toggle.addEventListener('click', () => {
	toggle.classList.toggle('active');
	toggle.classList.toggle('not-active');
	navbarMenu.classList.toggle('active');
});

// Handle scrolling when tapping on the navbar menu
navbarMenu.addEventListener('click', (event) => {
	const target = event.target;
	const id = target.dataset.id;
	if (id == null) {
		return;
  }
  scrollIntoView(id);
})

// focus on ghost, ghost move to cursor
const homeBox = document.querySelector('.home__box:last-child');
const ghost = document.querySelector('.home__ghost');

if (screen.width >= 1024) {
  addEventListener('load', () => {
    const ghostRect = ghost.getBoundingClientRect();
    const ghostHalfWidth = ghostRect.width + 200;
    const ghostHalfHeight = ghostRect.height + 200;

    homeBox.addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      ghost.style.transform = `translate(${x - ghostHalfWidth}px,${y - ghostHalfHeight}px)`;
    });

    homeBox.addEventListener('mouseout', () => {
      ghost.style.transform = "translate(-50%, -50%)";
    })
  });
}

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
const home = document.querySelector('#home .home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
	if (window.scrollY > homeHeight / 2) {
		arrowUp.classList.add('visible');
	} else {
		arrowUp.classList.remove('visible');
	}
});

// Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');

workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  // Remove selection from the previous item and select the new one
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
  target.classList.add('selected');

  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach((project) => {
      console.log(project.dataset.type);
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });
    projectContainer.classList.remove('anim-out');
  }, 200)
});

// 1. 모든 섹션 요소 가져오기
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화시킨다.

const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#project',
  '#contact'
];

const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(
  id => document.querySelector(`[data-id="${id}"]`)
);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
	const scrollTo = document.querySelector(selector);
	scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
	selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.7,
};
const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
})