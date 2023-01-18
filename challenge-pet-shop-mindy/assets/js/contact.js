const localStorageValue = localStorage.getItem("registro") // llamo el localstorage -> undefined la primera vez
// undefined === no existe en el localstorage
// la segunda vez -> []

// valores falsos
// undefined
// 0
// null
// NaN
// false

// true
// > 0
// strings
// number
// array

if (!localStorageValue) {
  localStorage.setItem("registro", JSON.stringify([]))
}

const btnRegistrar = document.getElementById('btnRegistrar')

btnRegistrar.addEventListener('click', registroContact)

function registroContact(){  
  let nombre = document.getElementById('inputNombre').value
  let apellido = document.getElementById('inputApellido').value
  let telefono = document.getElementById('inputTelefono').value
  let email = document.getElementById('inputEmail').value
  let nombreMascota = document.getElementById('inputMascota').value
  let tipoMascota = document.getElementById('select').value
  let comentario = document.getElementById('comentario').value

  if (nombre ==='' || apellido ==='' || telefono ==='' || email ==='' || nombreMascota ==='' || tipoMascota ===''){
    alert('ingresar todos los datos')
  } else {

    const obj = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      email: email,
      nombreMascota: nombreMascota,
      tipoMascota: tipoMascota,
      comentario: comentario,
      
    }
    

    const localStorageValue = JSON.parse(localStorage.getItem("registro")) // []
    localStorageValue.push(obj) // [ {obj} ]

   
   localStorage.setItem('registro', JSON.stringify(localStorageValue)) // se guarda al localstorage el array
   alert('ENVIADO')
  }
}
