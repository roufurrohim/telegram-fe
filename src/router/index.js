import { Switch, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../pages/Chat';
import Guard from './Guard';

const Router = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Login />
            </Route>

            <Route path="/register" >
                <Register />
            </Route>

            <Guard path="/chat" component={Chat} />

        </Switch>
    )
}

export default Router