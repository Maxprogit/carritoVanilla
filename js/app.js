console.log('conectado')


const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', e => {
    obtenerProductos()
})

cards.addEventListener('click', (e) =>{
    //console.log
    addCarrito(e)
})
const addCarrito = (e) =>{
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
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito [producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () =>{
    items.innerHTML = ''
    Object.values(carrito).forEach(item =>{
        templateCarrito.querySelector('th').textContent = item.id
        templateCarrito.querySelectorAll('td')[0].textContent = item.title
        templateCarrito.querySelectorAll('td')[1].textContent = item.cantidad
        templateCarrito.querySelector('span').textContent = item.precio * item.cantidad

        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = item.id
        templateCarrito.querySelector('.btn-danger').dataset.id = item.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)



        const boton = document.querySelector('#vaciar-carrito')
        boton.addEventListener('click', () => {
            carrito = {}
            pintarCarrito()
        })
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter = () =>{
    footer.innerHTML = ''
    if(Object.keys(carrito).length ===0){
        footer.innerHTML = 
        `
        <th colspan="5" scope="row">Carrito vacio - compra</th>
        `
        return
    }
    //Calcular Totales

    const nCantidad = Objecto.values(carrito).reduce((
        acc, { cantidad } 
    ) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((
        acc, { cantidad, precio }
    ) => acc + (cantidad * precio), 0)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio


    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(fragment)
}



const obtenerProductos = async () => {
    const res = await fetch ('./api/productos.json')
    const data = await res.json()
   //console.log(data)
   pintarCards(data)
}

const pintarCards = (data) => {
    data.forEach(item =>{
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute('src', item.url)
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}