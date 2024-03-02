import axios from "axios";
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Card from './components/Card';

import './App.css';

function App() {
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const initialURL = 'https://pokeapi.co/api/v2/pokemon'




  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await await (await axios.get(pokemon.url)).data;
      return pokemonRecord
    }))
    // console.log(_pokemonData);
    setPokemonData(_pokemonData);
  }

  useEffect(() => {
    async function fetchData() {
      let response = await (await axios.get(initialURL)).data;
      console.log(response)
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, [])

  const next = async () => {
    setLoading(true);
    let data = await (await axios.get(nextUrl)).data;
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await (await axios.get(prevUrl)).data;
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  

  return (
    <>
      <Navbar />
      <div>
        {loading ? <h1 style={{ textAlign: 'center' }}>Loading...</h1> : (
          <>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
            <div className="grid-container">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />
              })}
            </div>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
