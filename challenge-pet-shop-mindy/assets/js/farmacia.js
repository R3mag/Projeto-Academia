const navSearch = document.getElementById("nav-search-content");
const container = document.getElementById("container");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

showContent();
async function showContent() {
  let data;
  try {
    data = await (
      await fetch("https://apipetshop.herokuapp.com/api/articulos")
    ).json();
  } catch (error) {
    console.log("Error with API");
  }
  let dataPharmacyProducts = data.response.filter(
    (product) => product.tipo == "Medicamento"
  );
  dataPharmacyProducts.forEach(createProduct);
  navSearch.addEventListener("input", function () {
    let sort = document.getElementById("sort").value;
    let minPrice = document.getElementById("min-price").value;
    let maxPrice = document.getElementById("max-price").value;
    let textSearch = document.getElementById("text-search").value.toLowerCase();

    if (sort == "menor") {
      dataPharmacyProducts.sort((a, b) => a.precio - b.precio);
    }
    if (sort == "mayor") {
      dataPharmacyProducts.sort((a, b) => b.precio - a.precio);
    }

    if (minPrice === "") {
      minPrice = dataPharmacyProducts.reduce((a, b) =>
        a.precio < b.precio ? a : b
      ).precio;
    }
    if (maxPrice === "") {
      maxPrice = dataPharmacyProducts.reduce((a, b) =>
        a.precio > b.precio ? a : b
      ).precio;
    }
    let sortedProducts = dataPharmacyProducts.filter(
      (product) =>
        minPrice <= product.precio &&
        product.precio <= maxPrice &&
        product.nombre.includes(textSearch)
    );
    clearHtml(container);
    sortedProducts.forEach(createProduct);
    //0 matches
    if (sortedProducts.length < 1) {
      container.innerHTML = "<h2>No hay elementos para mostrar</h2>";
    }
  });
}
function clearHtml(domElement) {
  domElement.innerHTML = "";
}
function createProduct(product) {
  let quantity = 0,
    btnStyle, textStyle, text, style;
  if (cart.filter((e) => e.id == product._id).length > 0) {
    btnStyle = "btn-buy btn-buy--clicked";
    style = "card-stats--background-red";
  } else {
    btnStyle = "btn-buy";
  }
  if (product.stock<4) {
    textStyle = "date--red"
    text= "¡Ultimas " + product.stock + " Unidades Disponibles!"
  } else {
    textStyle = "date--green"
    text= product.stock + " Unidades restantes"
  }
  container.innerHTML += `
    <div class="card mt-3">
          <div class="card-image">
          <img src="${product.imagen}" class="carta-imagen" alt="">
          </div>
          <div class="card-text">
            <span class="date ${textStyle}">${text}</span>
            <h2>${product.nombre}</h2>
            <p>${product.descripcion}</p>
          </div>
          <div class="card-stats ${style}"id="input-quantity-${product._id}">
            <div class="unidades stat">
              <div class="value">Precio</div>
              <div class="type">$ ${product.precio}</div>
            </div>
            <div class="stat" >
              <div class="value">Unidades</div>
               <input type="number" name="text" class="card__cantidad" placeholder="0" min="0" max="${product.stock}" id="input-${product._id}">
            </div>
            <div class="stat">
              <input class="${btnStyle}" type="image" src="../assets/img/compras.png" onclick="handleCart('${product._id}')" id="btn-${product._id}">
            </div>
          </div>
        </div>
    `;
}

function handleCart(id) {
  const btn = document.getElementById("btn-" + id);
  const inputQuantity = document.getElementById("input-quantity-"+id);
  const quantity = document.getElementById("input-" + id).value;
  if (cart.filter((e) => e.id == id).length > 0) {
    cart = cart.filter((product) => product.id != id);
    localStorage.setItem("cart", JSON.stringify(cart));
    btn.classList.remove("btn-buy--clicked");
    inputQuantity.classList.remove("card-stats--background-red")
    //btn.classList.add("btn-primary");
  } else {
    if (quantity > 0) {
      cart.push({ id, quantity });
      localStorage.setItem("cart", JSON.stringify(cart));
      //btn.classList.remove("btn-primary");
      btn.classList.add("btn-buy--clicked");
      inputQuantity.classList.add("card-stats--background-red")
    } else {
      alert("Ingrese un numero mayor a 0");
    }
  }
}
