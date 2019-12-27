import React from 'react';

const MainPage = React.lazy(() => import('./views/MainPage'));
const Logout = React.lazy(() => import('./views/Logout/Logout'));
const Cars = React.lazy(() => import('./views/Cars/Cars'));
const Car = React.lazy(() => import('./views/Car/Car'));
const Issue  = React.lazy(()=> import('./views/Admin/Issue/Issue'));
const Policy  = React.lazy(()=> import('./views/Admin/Policy/Policy'));

const routes = [
  { path: '/', exact: true, name: 'Home'  ,isAdmin:false},
  { path: '/mainpage', name: '', component: MainPage  ,isAdmin:false},
  { path: '/cars', exact: true, name: 'Cars', component: Cars ,isAdmin:false },
  { path: '/cars/:id', exact: true, name: 'Car Detail', component: Car  ,isAdmin:false},
  { path: '/logout', name: 'Logout', component: Logout ,isAdmin:false},
  { path: '/admin', exact: true, name: 'Admin', component: Issue ,isAdmin:true},
  { path: '/admin/issue', name: 'Issue', component: Issue ,isAdmin:true},
  { path: '/admin/policy', name: 'Policy', component: Policy ,isAdmin:true},
];

export default routes;
