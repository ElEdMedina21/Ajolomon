import { useState } from 'react'
import './App.css'
import pokemonData from './data/pokemon.json'
import { useNavigate } from 'react-router-dom';

function App() {
  const [pokemonArr, setPokemon] = useState([null, null, null]);
  const [isFull, setFull] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = (pkmn) => {
    const emptyIndex = pokemonArr.indexOf(null);
    if(emptyIndex !== -1){
      updatePkmn(pkmn, emptyIndex)
    }
  }

  const updatePkmn = (pkmnValue, replaceIndex)=>{
    const newPokemon = [...pokemonArr];
    newPokemon[replaceIndex] = pkmnValue;
    setPokemon(newPokemon)
    console.log(newPokemon)
  }

  const clearArray = ()=>{
    setPokemon([null,null,null])
  }

  const handleContinue = () => {
    if(!pokemonArr.includes(null)){
      navigate('/fight', {state:{pokemonTeam:pokemonArr}})
    } else{
      alert('Termina de elegir tu equipo')
    }
  }

  return (
    <>
      <section className='pokemon-selector'>
        <header className='py-5 my-5 flex justify-center items-center'>
          <h1 className='text-4xl text-center'>Elige a tu equipo</h1>
        </header>
        <div className='flex selector-hud justify-evenly'>
            <section className='flex flex-col justify-center'>
              {pokemonArr.map((pokemon, index)=>(
                <article key={index} className='w-fit flex flex-col my-3'>
                  <img className={pokemon === null ? 'pokeball-empty' : 'pokeball-full'}/>
                  <p className='text-center'>{pokemon === null ? 'Vacio' : pokemon['nombre']}</p>
                </article>
              ))}
            </section>
            <section className='grid grid-rows-2 grid-cols-3 gap-x-4 gap-y-6'>
              {pokemonData.pokemon.map((pokemon, index)=>(
                <article key={index} 
                className={`pokemon-card aspect-square hover:bg-gray-200 flex flex-col justify-center 
                items-center border-2 rounded-md border-zinc-500`}
                onClick={()=>handleUpdate(pokemon)}>
                  <img className='pokemon-img' src={pokemon.img} alt={pokemon.nombre}/>
                  <p className=''>{pokemon.nombre}</p>
                </article>
              ))}
            </section>
            <section className='flex flex-col justify-center'>
              <button className='continue border-2 border-black rounded-md p-3 my-2'
              onClick={()=>handleContinue()}>Continuar</button>
              <button className='border-2 border-black rounded-md p-3 my-2'
              onClick={()=>clearArray()}>Reiniciar</button>
            </section>
        </div>
      </section>
    </>
  )
}

export default App
