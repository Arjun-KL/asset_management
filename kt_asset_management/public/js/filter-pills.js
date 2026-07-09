document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-pills').forEach((group) => {
    const tableId = group.dataset.table;
    const colIndex = Number.parseInt(group.dataset.col, 10);

    group.querySelectorAll('.filter-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const table = window.jQuery(`#${tableId}`).DataTable();
        const value = btn.dataset.value;
        const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        group.querySelectorAll('.filter-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        table.column(colIndex).search(value ? `^${escaped}$` : '', true, false).draw();
      });
    });
  });
});
