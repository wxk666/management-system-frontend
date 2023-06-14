export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/order', name: '购买管理', component: './Order' },
  { path: '/management', name: '设备管理', component: './Management' },
  { path: '/fix', name: '维修管理', component: './Fix' },
  { path: '/scrapped', name: '报废管理', component: './Scrapped' },
  { path: '/', redirect: '/management' },
  { path: '*', layout: false, component: './404' },
];
