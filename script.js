document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('menu').classList.add('menu--open');
  });
  
  document.getElementById('closeMenu').addEventListener('click', () => {
    document.getElementById('menu').classList.remove('menu--open');
  });