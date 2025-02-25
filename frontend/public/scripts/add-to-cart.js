async function checkLogin() {
  const response = await fetch("/api/av1/check-authenticated", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!data.isAuthenticated) {
    alert("Please loggin to continue");
    return false;
  }
  return true;
}
async function addToCart(productId, quantity) {
  if (checkLogin()) {
    const response = await fetch("/api/av1/cart", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });
    const data = await response.json();
    if (data.message) {
      alert(data.message);
    }
    window.location.reload();
  }
}

async function removeFromCart(productId) {
  if (checkLogin()) {
    const response = await fetch("/api/av1/cart/remove", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });
    const data = await response.json();
    if (data.message) {
      alert(data.message);
    }
    window.location.reload();
  }
}