document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetch(`api/av1/cart`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((data) => data.json())
        .catch((err) => console.log(err));

  if (data.itemsInCart.length === 0) {
    alert(
      "Your cart is empty. Please add products before proceeding to order."
    );
    window.location.href = "/"; 
  }
});
