import React, {useContext} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom'
import {useAuthState} from "react-firebase-hooks/auth";
import {Context} from "../index";
import Login from "./Login";
import Contacts from "./Contacts";
const AppRouter = () => {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    return user ?
        (
            <Switch>
                <Route path={'/contacts'} component={Contacts} exact={true}/>
                <Redirect to={'/contacts'}/>
            </Switch>
            
        )
        :
        (
            <Switch>
                <Route path={'/'} component={Login} exact={true}/>
                <Redirect to={'/'}/>
            </Switch>
        )
};

export default AppRouter;
