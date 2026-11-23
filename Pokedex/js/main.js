const listaPokemon = document.querySelector('#pokemonList')
const buttons = document.querySelectorAll('.btn')

const URL_API = 'https://pokeapi.co/api/v2/pokemon/'
const TOTAL_POKEMON = 251

let cargaActual = 0

buttons.forEach((btn) =>{
    btn.addEventListener('click', (e)=>{
        console.log(e.currentTarget.id)
        loadPokemon(e.currentTarget.id)
    })
})




async function loadPokemon(filtro = 'ver-todos'){
    try{
        cargaActual++
        const carga = cargaActual
        listaPokemon.classList.remove('pokemon-not-found')

        listaPokemon.innerHTML = ""
        let pokemonFound = 0

        for(let i = 1; i <= TOTAL_POKEMON; i++){
            const response = await fetch(URL_API + i)
            
            if(!response.ok){
                throw new Error('Error al recoger los pokemones')
            }
            
            const data = await response.json()

            if(carga !== cargaActual) return

            const coincide = filtro === 'ver-todos' || data.types.some(type => {
                return type.type.name === filtro
            })

            if(coincide){
                showPokemon(data)
                pokemonFound++
            }
        }

        if(pokemonFound === 0){
            listaPokemon.classList.add('pokemon-not-found')
            listaPokemon.innerHTML = "<p class='center'>No se han encontrado Pokémon en la Pokédex</p>"
        }

    }catch(err){
        console.error("No se pudieron cargar los Pokémon:", err);
    }
    
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
                    ${poke.weight}KG
                </p>
                <p class="stat">
                    ${poke.height}M
                </p>
            </div>
        </div>

    
    `

    listaPokemon.append(div)
}

loadPokemon()