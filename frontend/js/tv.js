function createTV() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/api/tvs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      brand: "Samsung",
      model: "Q80T",
      price: 450000,
      stock: 5,
      specs: {
        size: "55",
        resolution: "4K",
        smartTV: true,
        hdmiPorts: 4
      }
    })
  })
  .then(res => res.json())
  .then(data => console.log(data));
}