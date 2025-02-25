const sortSelector = document.getElementById("sortOptions");
sortSelector.addEventListener("change", () => {
  const selectedOption = sortSelector.options[sortSelector.selectedIndex];
  const sortByValue = selectedOption.getAttribute("sortBy");
  const orderValue = selectedOption.getAttribute("order");
  const url = new URL(window.location.href);
  url.searchParams.set("sortBy", sortByValue);
  url.searchParams.set("order", orderValue);
  window.location.href = url;
});
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const sortByValue = params.get("sortBy");
  const orderValue = params.get("order");  
  
  if (sortByValue && orderValue) {
    const selectedOption = Array.from(sortSelector.options).find((option) => {
      return (
        option.getAttribute("sortBy") == sortByValue &&
        option.getAttribute("order") == orderValue
      );
    });

    if (selectedOption) {
      selectedOption.selected = true;
    }
  }
});
