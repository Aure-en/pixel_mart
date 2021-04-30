// Nav

window.addEventListener('load', () => {
  let isDropdownOpen;
  const navBtn = document.querySelector('.navBtn');
  const navDropdown = document.querySelector('.navDropdown');

  const initialNav = () => {
    if (window.innerWidth < 768) {
      navDropdown.classList.remove('navDropdown--active');
      navBtn.classList.remove('hidden');
      isDropdownOpen = false;
    } else {
      navDropdown.classList.add('navDropdown--active');
      navBtn.classList.add('hidden');
      isDropdownOpen = true;
    }
  };

  initialNav();

  navBtn.addEventListener('click', () => {
    if (isDropdownOpen) {
      navDropdown.classList.remove('navDropdown--active');
      isDropdownOpen = false;
    } else {
      navDropdown.classList.add('navDropdown--active');
      isDropdownOpen = true;
    }
  });

  window.addEventListener('resize', initialNav);
});

// Preview