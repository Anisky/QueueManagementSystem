
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import  Agent  from './components/agent/Agent';
import Customers from './components/costumers/customers';
import Display from './components/display/Display';

function App() {
  return (

    <BrowserRouter>
        <div className="App">
          <Switch>
            {/* <Customers /> */}
            <Route  path = '/ticket' component={Customers}/>
            <Route  path = '/display' component={Display}/>
            <Route  path = '/agent' component={ Agent }/>
          </Switch>  
        </div>
    </BrowserRouter>
  );
}

export default App;
