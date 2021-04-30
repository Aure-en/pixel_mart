// Nav

window.addEventListener('load', () => {
  let isDropdownOpen = false;
  const navBtn = document.querySelector('.navBtn');
  const navDropdown = document.querySelector('.navDropdown');
  navBtn.addEventListener('click', () => {
    if (isDropdownOpen) {
      navDropdown.classList.add('navDropdown--active');
      isDropdownOpen = false;
    } else {
      navDropdown.classList.remove('navDropdown--active');
      isDropdownOpen = true;
    }
  });
});

// Preview