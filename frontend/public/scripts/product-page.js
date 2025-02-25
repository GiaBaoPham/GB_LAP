window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const brand = params.get("brand");

  const breadcrumb = document.getElementById("breadcrumb");

  if (brand) {
    const brandLink = document.createElement("strong");
    brandLink.textContent = brand;
    const slash = document.createElement("span");
    slash.textContent = "/";
    breadcrumb.appendChild(slash);
    const p = document.createElement("p");
    p.appendChild(brandLink);
    p.classList.add("phone");
    breadcrumb.appendChild(p);
  }
});
