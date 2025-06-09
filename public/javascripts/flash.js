  document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.btn-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const alert = this.closest('.alert');
        alert.style.opacity = '0';
        setTimeout(function() {
          alert.style.display = 'none';
        }, 150);
      });
    });
  });