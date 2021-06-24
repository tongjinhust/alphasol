import * as React from 'react';
import "./App.scss";
import { Route, Switch, Router } from 'react-router-dom';
import PageIndex from "./pages/Index";
import PageProjectList from "./pages/project/ProjectList";
import PageProjectDetail from "./pages/project/ProjectDetail";
import PageActivityList from "./pages/activity/ActivityList";
import { history } from '@common/history';
import PageActivityDetail from 'pages/activity/ActivityDetail';

class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={PageIndex} />
                    <Route path="/project" exact component={PageProjectList} />
                    <Route path="/project/:projectId" exact component={PageProjectDetail} />
                    <Route path="/activity" exact component={PageActivityList} />
                    <Route path="/activity/:activityId" exact component={PageActivityDetail} />
                </Switch>
            </Router>
        );
    }
}

export default App;