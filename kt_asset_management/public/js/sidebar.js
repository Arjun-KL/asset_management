document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('sidebarToggle');
  if (!toggle) return;

  const icon = toggle.querySelector('i');

  const setIcon = (collapsed) => {
    icon.className = collapsed ? 'bi bi-chevron-double-right' : 'bi bi-chevron-double-left';
  };

  setIcon(document.documentElement.classList.contains('sidebar-collapsed'));

  toggle.addEventListener('click', () => {
    const collapsed = !document.documentElement.classList.contains('sidebar-collapsed');
    document.documentElement.classList.toggle('sidebar-collapsed', collapsed);
    localStorage.setItem('kt_am_sidebar_collapsed', collapsed ? '1' : '0');
    setIcon(collapsed);
  });
});
