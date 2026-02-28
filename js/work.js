// ====================== YOU CAN INTERACTIVE ======================
document.addEventListener("DOMContentLoaded", () => {
  const ul = document.getElementById("you-can-list");
  const items = document.querySelectorAll("#you-can-list li");

  function moveToWord(li) {
    const liOffsetCenter = li.offsetTop + li.offsetHeight / 2;
    const containerCenter = ul.parentElement.offsetHeight / 2;
    ul.style.top = `${containerCenter - liOffsetCenter}px`;
  }

  items.forEach((li) => {
    li.addEventListener("click", () => {
      moveToWord(li);
      items.forEach((item) => item.classList.remove("active"));
      li.classList.add("active");
    });
  });

  // أول تحميل → design
  setTimeout(() => {
    if (items.length > 0) {
      moveToWord(items[0]);
      items[0].classList.add("active");
    }
  }, 800);
});
