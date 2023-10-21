const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 16
let offset = 0;

function getTypeClass(type) {
    const typeToClass = {
        normal: 'normal',
        grass: 'grass',
        fire: 'fire',
        fighting: 'fighting',
        flying: 'flying',
        poison: 'poison',
        ground: 'ground',
        rock: 'rock',
        bug: 'bug',
        ghost: 'ghost',
        steel: 'steel',
        water: 'water',
        electric: 'electric',
        psychic: 'psychic',
        ice: 'ice',
        dragon: 'dragon',
        dark: 'dark',
        fairy: 'fairy',
        shadow: 'shadow'
        
    };
    return typeToClass[type] || ''; // Retorna uma string vazia se o tipo não for encontrado
}


function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-number="${pokemon.number}">
            <span class="number">Nº${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <div>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)
pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon');
    
    if (clickedPokemon) {
        const pokemonNumber = clickedPokemon.getAttribute('data-pokemon-number');
        
        // Use pokeApi.getPokemonDetail para obter os detalhes do Pokémon clicado
        pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/` })
            .then((pokemon) => {
                const selectedPokemonDetails = document.getElementById('selectedPokemonDetails');
                const typeClass = getTypeClass(pokemon.type); // Obtém a classe de estilo com base no tipo

                // Função para converter altura de decímetros para metros
                function convertHeightToMeters(heightInDecimeters) {
                    return (heightInDecimeters / 10) + " meters";
                }

                // Função para converter peso de hectogramas para quilogramas
                function convertWeightToKilograms(weightInHectograms) {
                    return (weightInHectograms / 10) + " kilograms";
                }

                // Atualiza a div "selectedPokemonDetails" com a classe de estilo do tipo e valores convertidos
                selectedPokemonDetails.innerHTML = `
                    <p class="pokemon-number">Nº${pokemon.number}</p>
                    <h3>${pokemon.name}</h3>
                    <div class="center row typeHeight">${pokemon.types.map((type) => `<div class="types-container"><div class="type ${getTypeClass(type)}">${type}</div></div>`).join('')}</div>
                    <div class="row center">
                        <div class="column center margin-5 width-100">
                            <h4>Height</h4>
                            <div class="pokemon-height heightWeight">${convertHeightToMeters(pokemon.height)}</div>
                            
                        </div>
                        <div class="column center margin-5 width-100">
                            <h4>Weight</h4>
                            <div class="pokemon-weight heightWeight">${convertWeightToKilograms(pokemon.weight)}</div>
                
                        </div>
                        
                    </div>

                    <div class="column">  
                        <h4>Abilities</h4>
                        <div>
                            <div class="pokemon-abilities row">
                                ${pokemon.abilities.map((ability) => `<div class="ability">${ability}</div>`).join('')}
                            </div>

                        </div>
                        
                    </div>

                    <h4>Stats:</h4>
                    <ul class="stat-list">
                        ${pokemon.stats.map((stat) => `
                            <li>
                                <div class="stat-icon-container">
                                    <img src="${getStatIconName(stat.name)}" alt="${stat.name}" class="stat-icon">
                                </div>
                                <span class="stat-name">${stat.name}:</span> ${stat.value}
                            </li>
                        `).join('')}
                    </ul>

                    
                    <img  class="selected-pokemon-image" src="${pokemon.photo}" alt="${pokemon.name}">
                    
                `;
                // Oculta o <h2> quando um Pokémon é selecionado
                const selectPokemonHeader = document.querySelector('.selected-pokemon h2');
                selectPokemonHeader.style.display = 'none';
            })
            .catch((error) => {
                console.error('Erro ao carregar os detalhes do Pokémon:', error);
            });
    } else {
        // Se nenhum Pokémon estiver selecionado, exibe o <h2> "Select Pokémon"
        const selectPokemonHeader = document.querySelector('.selected-pokemon h2');
        selectPokemonHeader.style.display = 'block';
        
        // Limpa os detalhes do Pokémon
        const selectedPokemonDetails = document.getElementById('selectedPokemonDetails');
        selectedPokemonDetails.innerHTML = '';
    }
});



loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function getStatIconName(statName) {
    const statIcons = {
        "hp": "assets/src/hp.png",
        "attack": " assets/src/attack.png ",
        "defense": " assets/src/defense.png ",
        "special-attack": " assets/src/special-attack.png ",
        "special-defense": " assets/src/special-defense.png ",
        "speed": " assets/src/speed.png "
    };
    return statIcons[statName] || "";
}