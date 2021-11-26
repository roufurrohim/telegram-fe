import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Router from './router/index' 

function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
            <Router />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;