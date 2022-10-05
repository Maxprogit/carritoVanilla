console.log('conectado')


const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', e =>{ /*e ó () son lo mismo*/
  obtenerProductos()
  if(localStorage.getItem('carrito')){
	carrito = JSON.parse(localStorage.getItem('carrito'))
	pintarCarrito()
  }
})

cards.addEventListener('click', (e) => {
	//console.log(e)
	addCarrito(e)
})

items.addEventListener('click', (e) => {
	btnAcciones(e)
})
const btnAcciones = e => {
	if(e.target.classList.contains('btn-info'))
	{
		const producto = carrito[e.target.dataset.id]
		producto.cantidad++
		carrito[e.target.dataset.id] = {...producto}
		pintarCarrito()
	}
	if(e.target.classList.contains('btn-danger'))
	{
		const producto = carrito[e.target.dataset.id]
		producto.cantidad--
		if(producto.cantidad === 0)
		delete carrito[e.target.dataset.id]
		else{
			carrito[e.target.dataset.id] = {...producto}
		}
		
		pintarCarrito()
	}
	e.stopPropagation()
}

const addCarrito = (e) => {
	if(e.target.classList.contains('btn-dark')){
		//alert('boton')
		setCarrito(e.target.parentElement)
	}
	e.stopPropagation()
}

const setCarrito = (item) => {
	//console.log(item)
	const producto = {
		title: item.querySelector('h5').textContent,
		precio: item.querySelector('p').textContent,
		id: item.querySelector('button').dataset.id,
		cantidad: 1
	}
		//console.log(producto)

		if(carrito.hasOwnProperty(producto.id)){//VERIFICA EN EL ARREGLO SI EXISTE LA POSICION
			producto.cantidad = carrito[producto.id].cantidad + 1
		}
		carrito[producto.id] = {...producto} //...nom_OBJ se sustituyen / empujar
		pintarCarrito()
		//console.log(carrito)
}

const pintarCarrito = () => {
	items.innerHTML = ''
	Object.values(carrito).forEach(item => {

		//AGREGAR INFORMACION A LA TABLA AL CLICKEAR
		templateCarrito.querySelector('th').textContent = item.id
		templateCarrito.querySelectorAll('td')[0].textContent = item.title
		templateCarrito.querySelectorAll('td')[1].textContent = item.cantidad
		templateCarrito.querySelector('span').textContent = item.precio * item.cantidad

		//BOTONES
		templateCarrito.querySelector('.btn-info').dataset.id = item.id
		templateCarrito.querySelector('.btn-danger').dataset.id = item.id

		const clone = templateCarrito.cloneNode(true)
		fragment.appendChild(clone)
	})
	items.appendChild(fragment)

	pintarFooter()
	localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
	footer.innerHTML = ''
	if(Object.keys(carrito).length === 0){
		footer.innerHTML = 
	`
	<th colspan="5" scope="row">Carrito vacío - ¡Compra!</th>
	`		
	return
	}

	// Calcular Totales
	const nCantidad = Object.values(carrito).reduce((
		acc, { cantidad}
	) => acc + cantidad, 0)
	const nPrecio = Object.values(carrito).reduce((
		acc, { cantidad, precio}
	) => acc + (cantidad * precio), 0)
	templateFooter.querySelectorAll('td')[0].textContent = nCantidad
	templateFooter.querySelector('span').textContent = nPrecio

	const clone = templateFooter.cloneNode(true)
	fragment.appendChild(clone)
	footer.appendChild(fragment)

	const boton = document.querySelector('#vaciar-carrito')
	boton.addEventListener('click', () => {
		carrito = {}
		pintarCarrito()
	})
}

const obtenerProductos = async() => {
  const res = await fetch('./api/productos.json') /*LEER LO QUE ESTÁ DENTRO DEL ARCHIVO */
	const data = await res.json()
	//console.log(data)
	pintarCards(data) /*DATA por que es la variable que contiene los productos */
}

const pintarCards = (data) => {
	data.forEach(item => {
		templateCard.querySelector('h5').textContent = item.title 
		templateCard.querySelector('p').textContent = item.precio 
		templateCard.querySelector('img').setAttribute('src',item.url)
		templateCard.querySelector('button').dataset.id = item.id 

		const clone = templateCard.cloneNode(true)
		fragment.appendChild(clone)
	})
	cards.appendChild(fragment)
}