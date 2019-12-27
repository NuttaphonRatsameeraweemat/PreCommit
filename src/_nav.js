export default {
  items: [
    {
      name: 'Home',
      url: '/mainpage',
      icon: 'icon-location-pin',
      isAdmin: false
    },
    {
      name: 'Cars',
      url: '/cars',
      icon: 'fa fa-car',
      isAdmin: false
    },
    {
      name: 'Admin',
      url: '/base',
      icon: 'fa fa-users',
      children: [
        {
          name: 'Issue',
          url: '/admin/issue',
          icon: 'fa fa-wrench',
        }, {
          name: 'Policy',
          url: '/admin/policy',
          icon: 'fa fa-wrench',
        },
      ],
      isAdmin: true
    },
    {
      name: 'Logout',
      url: '/logout',
      icon: 'icon-logout',
      class: 'mt-auto',
      isAdmin: false
    },
  ],
};
