type StyleMap = { [key: string]: string };

const styles: StyleMap = {
  page1: 'CSS/page1.css',
  page2: 'CSS/page2.css',
  page3: 'CSS/page3.css',
};

const styleDescriptions: { [key: string]: string } = {
  page1: 'Styl Pierwszy',
  page2: 'Styl Drugi',
  page3: 'Styl Trzeci',
};

let currentStyle: string = 'page1';

function changeStyle(newStyle: string): void {
  if (!styles[newStyle]) {
    console.error(`Style ${newStyle} not found`);
    return;
  }

  const existingLink = document.querySelector('link[data-dynamic-style]');
  if (existingLink) {
    existingLink.remove();
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = styles[newStyle];
  link.setAttribute('data-dynamic-style', 'true');
  document.head.appendChild(link);

  currentStyle = newStyle;
}

function setupNavbar(): void {
    const navbarLinks = document.querySelectorAll('[data-style-link]');

    navbarLinks.forEach((link) => {
        const styleKey = link.getAttribute('data-style-link');
        if (styleKey && styles[styleKey]) {
            const anchor = link.querySelector('a');
            if (anchor) {
                anchor.textContent = styleDescriptions[styleKey] || `Styl ${styleKey}`;
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    changeStyle(styleKey);
                });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  changeStyle(currentStyle);
  setupNavbar();
});
