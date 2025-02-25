const route = (event) => {
  event = event || window.event;
  window.history.pushState({}, "", event.target.href);
  console.log("Hello");
};
window.route = route();
