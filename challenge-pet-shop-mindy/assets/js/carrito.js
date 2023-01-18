const container = document.getElementById("container");
const message = document.getElementById("message");
const btnBuy = document.getElementById("btn-buy");
const deleteAll = document.getElementById("borrar-todo");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let tPrice=0;
showContent();
async function showContent() {
  let data;
  try {
    data = await (
      await fetch("https://apipetshop.herokuapp.com/api/articulos")
    ).json();
    console.log(data);
  } catch (error) {
    console.log("Error with API");
  }
  cart.map((e) => {
    e.product = data.response.find((product) => product._id == e.id);
  });
  console.log(cart);
  cart.forEach(createProduct);
}

btnBuy.addEventListener("click", function () {
  message.innerHTML = `
    <h2>Compra Realizada</h2>
    `;
    
});
deleteAll.addEventListener("click", function () {
  localStorage.removeItem("cart");
  clearHtml(container);
});
function createProduct(element) {
  product = element.product;
  //console.log(element);
  //console.log(product);
  container.innerHTML += `
            <tr >
              <td class="justify-content-center" ><img class="imageProduct" src="${
                product.imagen
              }" alt=""></td>
              <td class="descripcion " >${product.nombre} </td>
              <td >$ ${product.precio}</td>
              <td ><input
                type="number"
                class="formCantidad"
                id="input-${product._id}"
                value="${element.quantity}"
                min = "1"
                max = "${product.stock}"
                oninput="changeQuanity('${product._id}')"
              /></td>
              <td>$ ${product.precio * element.quantity}</td>
              <td><input type="image" id="borrar-${
                product._id
              }" class="imgeliminar" onclick="deleteItem('${
    product._id
  }')" src="../assets/img/icons8-cancelar.svg" alt=""></td>
            </tr>
    `;
  totalPrice(product.precio * element.quantity);
}
function totalPrice(price) {
  tPrice = tPrice + price;
  document.getElementById("precio-total").innerHTML = `$${tPrice}`;
}
function clearHtml(domElement) {
  domElement.innerHTML = "";
  tPrice = 0;
  totalPrice(0);
}
function changeQuanity(id) {
  newQuantity = document.getElementById("input-" + id).value;
  cart.map((e) => {
    if (e.id == id) {
      e.quantity = newQuantity;
    }
  });
  console.log(cart);
  clearHtml(container);
  cart.forEach(createProduct);
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(cart));
}
function deleteItem(id) {
  cart = cart.filter((e) => e.id != id);
  clearHtml(container);
  cart.forEach(createProduct);
  if (cart == "") {
    localStorage.deleteItem("cart");
  } else {
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}
