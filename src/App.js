import React, { useState } from 'react';
import './App.css'; // Importe o arquivo CSS de estilos personalizados

function App() {
  const [termoDeConsulta, setTermoDeConsulta] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const itensPorPagina = 10; // Quantidade de resultados exibidos por página

  const handleInputChange = (event) => {
    setTermoDeConsulta(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPaginaAtual(0); // Ao realizar uma nova busca, volta para a primeira página
    buscarRepositorios();
  };

  const buscarRepositorios = () => {
    const url = `https://api.github.com/search/repositories?q=${termoDeConsulta}&sort=stars&order=desc`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setRepositorios(data.items);
        } else {
          setRepositorios([]);
        }
      })
      .catch((error) => {
        console.log('Ocorreu um erro:', error);
      });
  };

  const repositoriosPaginados = repositorios.slice(
    paginaAtual * itensPorPagina,
    (paginaAtual + 1) * itensPorPagina
  );

  const renderRepositorios = () => {
    return (
      <div>
        <h2>Resultados:</h2>
        <ul className='list-results'>
          {repositoriosPaginados.map((repositorio) => (
            <li key={repositorio.id}>
              <h3>{repositorio.name}</h3>
              <p>{repositorio.description}</p>
              <p>Autor: {repositorio.owner.login}</p>
              <p>Linguagem: {repositorio.language}</p>
              <p>Número de Stars: {repositorio.stargazers_count}</p>
              <p>Número de Forks: {repositorio.forks_count}</p>
              <p>Data da última atualização: {repositorio.updated_at}</p>
            </li>
          ))}
        </ul>
        {repositorios.length > itensPorPagina && (
          <div className='pagination-container'>
            <p>Página {paginaAtual + 1} de {Math.ceil(repositorios.length / itensPorPagina)}</p>
            <div>
            <button
              className='pagination-button'
              onClick={() => setPaginaAtual(paginaAtual - 1)}
              disabled={paginaAtual === 0}
            >
              Anterior
            </button>
            <button
              className='pagination-button'
              onClick={() => setPaginaAtual(paginaAtual + 1)}
              disabled={paginaAtual === Math.ceil(repositorios.length / itensPorPagina) - 1}
            >
              Próximo
            </button>
            </div>


          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1 className="title">Busca repositórios</h1>
      <p className='text'>Digite o termo que deseja buscar e iremos retornar todos os repositórios que contenha essa palavra na descrição ou no título</p>
      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          value={termoDeConsulta}
          onChange={handleInputChange}
          placeholder="Digite o termo de busca"
        />
        <button className="search-button" type="submit">Buscar</button>
      </form>

      {repositorios.length > 0? renderRepositorios()
        : <p className="no-results">Nenhum resultado encontrado.</p>
      }
    </div>
  );
}

export default App;
