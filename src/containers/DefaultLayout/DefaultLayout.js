import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

// const DefaultAside = React.lazy(() => import('./DefaultAside'));
// const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }


  render() {
    // debugger;
    let role = localStorage.getItem('role');
    let modifyRoute;
    let modifyNavigation;
    if (role !== "admin") {
      console.log('this is not admin !!!! : ', role)
      modifyRoute = routes.filter(d => d.isAdmin === false)
      console.log('modifyRoute : ', modifyRoute)
      modifyNavigation = {items: navigation.items.filter(f => f.isAdmin === false)}
      console.log('modifyNavigation : ', modifyNavigation)
    }else if (role==="admin"){

      modifyRoute=routes;
      modifyNavigation= navigation;
    }

    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={modifyNavigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={modifyRoute} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {modifyRoute.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/mainpage" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              {/* <DefaultAside /> */}
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            {/* <DefaultFooter /> */}
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
