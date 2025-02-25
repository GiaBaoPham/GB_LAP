const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach((item) => {
  item.addEventListener("click", () => {
    const filterValue = item.getAttribute("brand");
    const url = new URL(window.location.href);

    url.searchParams.set("brand", filterValue);

    window.location.href = url;
  });
});
const allFilterBtn = document.getElementById("all-filter-btn");
allFilterBtn.addEventListener("click", () => {
  const url = new URL(window.location.href);

  url.searchParams.delete("brand");

  window.location.href = url;
});
