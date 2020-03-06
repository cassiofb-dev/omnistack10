import React, {useEffect, useState} from 'react';

import './services/api';
import './Sidebar.css'
import './global.css';
import './Main.css'
import './App.css';

import api from './services/api';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App() {

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function load_devs() {

      const response = await api.get('/devs');

      setDevs(response.data);
    }

    load_devs();
  }, [])

  async function handle_form(data){
    const response = await api.post('/devs', data);

    setDevs([...devs, response.data]);
  }

  return (

    <div id="app">

      <aside>

        <strong>Cadastrar</strong>

        <DevForm onSubmit={handle_form} />

      </aside>

      <main>

        <ul>

          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev}/>
          ))}

        </ul>

      </main>

    </div>
  );
}

export default App;
