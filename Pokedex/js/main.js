const listaPokemon = document.querySelector('#pokemonList')
const buttons = document.querySelectorAll('.btn')
const btnMas = document.querySelector('#cargar-mas')

const URL_API = 'https://pokeapi.co/api/v2/'
const TOTAL_POKEMON = 1025
const POR_PAGINA = 20

let idsActuales = []
let posicion = 0
let cargaActual = 0

buttons.forEach((btn) =>{
    btn.addEventListener('click', (e)=>{
        loadPokemon(e.currentTarget.id)
    })
})

btnMas.addEventListener('click', cargarMas)

async function obtenerIds(filtro){
    if(filtro === 'ver-todos'){
        const ids = []
        for(let i = 1; i <= TOTAL_POKEMON; i++){
            ids.push(i)
        }
        return ids
    }

    const response = await fetch(URL_API + 'type/' + filtro)
    if(!response.ok){
        throw new Error('Error al recoger el tipo')
    }
    const data = await response.json()

    return data.pokemon
        .map(p => Number(p.pokemon.url.split('/').at(-2)))
        .filter(id => id <= TOTAL_POKEMON)
        .sort((a, b) => a - b)
}

async function loadPokemon(filtro = 'ver-todos'){
    cargaActual++
    const carga = cargaActual

    try{
        listaPokemon.classList.remove('pokemon-not-found')
        listaPokemon.innerHTML = ""
        btnMas.hidden = true
        btnMas.disabled = false

        const ids = await obtenerIds(filtro)
        if(carga !== cargaActual) return

        idsActuales = ids
        posicion = 0

        if(idsActuales.length === 0){
            listaPokemon.classList.add('pokemon-not-found')
            listaPokemon.innerHTML = "<p class='center'>No se han encontrado Pokémon en la Pokédex</p>"
            return
        }

        await cargarMas()
    }catch(err){
        console.error("No se pudieron cargar los Pokémon:", err)
    }
}

async function cargarMas(){
    const carga = cargaActual
    const siguientes = idsActuales.slice(posicion, posicion + POR_PAGINA)
    posicion += POR_PAGINA
    btnMas.disabled = true

    try{
        for(const id of siguientes){
            const response = await fetch(URL_API + 'pokemon/' + id)
            if(!response.ok){
                throw new Error('Error al recoger los pokemones')
            }
            const data = await response.json()

            if(carga !== cargaActual) return

            showPokemon(data)
        }
    }catch(err){
        console.error("No se pudieron cargar los Pokémon:", err)
    }

    btnMas.disabled = false
    btnMas.hidden = posicion >= idsActuales.length
}


function showPokemon(poke){

    const tipos = poke.types
    .map(type => `<p class="${type.type.name} type">${type.type.name}</p>`)
    .join("");

    const pokeId = '#'.concat(poke.id.toString().padStart(3, "0"));

    const div = document.createElement('div')
    div.classList.add('pokemon')

    div.innerHTML = `
        <p class="pokemon-id-back">
            ${pokeId}
        </p>
        <div class="pokemon-img">
            <img src="${poke.sprites.other['official-artwork'].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="name-container">
                <p class="pokemon-id">${pokeId}</p>
                <h2 class="pokemon-name">${poke.name}</h2>
            </div>
            <div class="pokemon-types">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">
                    ${poke.weight / 10}KG
                </p>
                <p class="stat">
                    ${poke.height / 10}M
                </p>
            </div>
        </div>
    `

    listaPokemon.append(div)
}

loadPokemon()