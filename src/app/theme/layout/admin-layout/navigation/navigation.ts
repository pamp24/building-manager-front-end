import { Role } from 'src/app/theme/shared/components/_helpers/role';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
  role?: string[];
  disabled?: boolean;
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'admin',
    title: 'Admin Panel',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.PropertyManager, Role.BuildingManager],
    children: [
      // {
      //   id: 'Online-Courses',
      //   title: 'Online Courses',
      //   type: 'collapse',
      //   icon: 'read',
      //   isMainParent: true,
      //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //   children: [
      //     {
      //       id: 'dashboard',
      //       title: 'Dashboard',
      //       type: 'item',
      //       url: '/online-course/dashboard',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //     },
      //     {
      //       id: 'teacher',
      //       title: 'Teacher',
      //       type: 'collapse',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //       children: [
      //         {
      //           id: 'list',
      //           title: 'List',
      //           type: 'item',
      //           url: '/online-course/teacher/list'
      //         },
      //         {
      //           id: 'apply',
      //           title: 'Apply',
      //           type: 'item',
      //           url: '/online-course/teacher/apply'
      //         },
      //         {
      //           id: 'add',
      //           title: 'Add',
      //           type: 'item',
      //           url: '/online-course/teacher/add',
      //           classes: 'no-icon',
      //           role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //         }
      //       ]
      //     },
      //     {
      //       id: 'student',
      //       title: 'Student',
      //       type: 'collapse',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //       children: [
      //         {
      //           id: 'list',
      //           title: 'List',
      //           type: 'item',
      //           url: '/online-course/student/list'
      //         },
      //         {
      //           id: 'apply',
      //           title: 'Apply',
      //           type: 'item',
      //           url: '/online-course/student/apply'
      //         },
      //         {
      //           id: 'add',
      //           title: 'Add',
      //           type: 'item',
      //           url: '/online-course/student/add',
      //           classes: 'no-icon',
      //           role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //         }
      //       ]
      //     },
      //     {
      //       id: 'courses',
      //       title: 'Courses',
      //       type: 'collapse',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //       children: [
      //         {
      //           id: 'view',
      //           title: 'View',
      //           type: 'item',
      //           url: '/online-course/courses/view'
      //         },
      //         {
      //           id: 'add',
      //           title: 'Add',
      //           type: 'item',
      //           url: '/online-course/courses/add',
      //           role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //         }
      //       ]
      //     },
      //     {
      //       id: 'pricing',
      //       title: 'Pricing',
      //       type: 'item',
      //       url: '/online-course/pricing',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //     },
      //     {
      //       id: 'site',
      //       title: 'Site',
      //       type: 'item',
      //       url: '/online-course/site',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //     },
      //     {
      //       id: 'setting',
      //       title: 'Setting',
      //       type: 'collapse',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //       children: [
      //         {
      //           id: 'payment',
      //           title: 'Payment',
      //           type: 'item',
      //           url: '/online-course/setting/payment',
      //           role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //         },
      //         {
      //           id: 'pricing',
      //           title: 'Pricing',
      //           type: 'item',
      //           url: '/online-course/setting/price',
      //           role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //         },
      //         {
      //           id: 'notification',
      //           title: 'Notification',
      //           type: 'item',
      //           url: '/online-course/setting/notification',
      //           role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   id: 'membership',
      //   title: 'Membership',
      //   type: 'collapse',
      //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //   icon: 'user',
      //   children: [
      //     {
      //       id: 'dashboard',
      //       title: 'Dashboard',
      //       type: 'item',
      //       url: '/membership/dashboard',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //     },
      //     {
      //       id: 'list',
      //       title: 'List',
      //       type: 'item',
      //       url: '/membership/list'
      //     },
      //     {
      //       id: 'price',
      //       title: 'Pricing',
      //       type: 'item',
      //       url: '/membership/price'
      //     },
      //     {
      //       id: 'setting',
      //       title: 'Setting',
      //       type: 'item',
      //       url: '/membership/setting'
      //     }
      //   ]
      // },
      // {
      //   id: 'helpdesk',
      //   title: 'Helpdesk',
      //   type: 'collapse',
      //   icon: 'question-circle',
      //   isMainParent: true,
      //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //   children: [
      //     {
      //       id: 'dashboard',
      //       title: 'Dashboard',
      //       type: 'item',
      //       url: '/helpdesk/dashboard',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //     },
      //     {
      //       id: 'ticket',
      //       title: 'Ticket',
      //       type: 'collapse',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //       children: [
      //         {
      //           id: 'create',
      //           title: 'Create',
      //           type: 'item',
      //           url: '/helpdesk/ticket/create'
      //         },
      //         {
      //           id: 'list',
      //           title: 'List',
      //           type: 'item',
      //           url: '/helpdesk/ticket/list'
      //         },
      //         {
      //           id: 'details',
      //           title: 'Details',
      //           type: 'item',
      //           url: '/helpdesk/ticket/details'
      //         }
      //       ]
      //     },
      //     {
      //       id: 'customer',
      //       title: 'Customer',
      //       type: 'item',
      //       url: '/helpdesk/customer'
      //     }
      //   ]
      // },
      {
        id: 'dashboard',
        title: "Manager's Dashboard",
        type: 'item',
        url: '/invoice/dashboard'
      },
      {
        id: 'create',
        title: 'Create Expenses Invoice',
        type: 'item',
        url: '/invoice/create'
      },
      // {
      //   id: 'details',
      //   title: 'Details',
      //   type: 'item',
      //   url: '/invoice/details',
      // },
      {
        id: 'list',
        title: 'List Expenses Invoices',
        type: 'item',
        url: '/invoice/list'
      }
    ]
  },
  {
    id: 'Dashboard',
    title: 'Dashboard',
    type: 'group',
    classes: 'first-group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
    children: [
      {
        id: 'Data-Input',
        title: 'Data Input',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/forms-validator',
        icon: 'file-protect',
        breadcrumbs: false,
        role: [Role.User]
      },
      {
        id: 'account-profile',
        title: 'Building',
        type: 'item',
        icon: 'database',
        url: '/user/account-profile',
        role: [Role.Admin, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      },
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        icon: 'dashboard',
        url: '/dashboard/default',
        breadcrumbs: false,
        role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      },
      {
        id: 'finance',
        title: 'Finance',
        type: 'item',
        icon: 'dollar',
        url: '/dashboard/finance',
        role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      },
      // {
      //   id: 'invoice',
      //   title: 'Invoice',
      //   type: 'collapse',
      //   icon: 'file-text',
      //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //   children: [
      //     {
      //       id: 'dashboard',
      //       title: "Manager's Dashboard",
      //       type: 'item',
      //       url: '/invoice/dashboard'
      //     },
      //     {
      //       id: 'create',
      //       title: 'Create',
      //       type: 'item',
      //       url: '/invoice/create'
      //     },
      //     {
      //       id: 'details',
      //       title: 'Details',
      //       type: 'item',
      //       url: '/invoice/details'
      //     },
      //     {
      //       id: 'list',
      //       title: 'List',
      //       type: 'item',
      //       url: '/invoice/list'
      //     },
      //     {
      //       id: 'edit',
      //       title: 'Edit',
      //       type: 'item',
      //       url: '/invoice/edit',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //     }
      //   ]
      // },

      // {
      //   id: 'dashboard',
      //   title: 'Dashboard', //propertyManager
      //   type: 'item',
      //   icon: 'dashboard',
      //   url: '/dashboard/analytics',
      //   breadcrumbs: false,
      //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      // },

      {
        id: 'calendar',
        title: 'Calendar',
        type: 'item',
        classes: 'nav-item',
        url: '/calendar',
        icon: 'calendar',
        role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      },
      {
        id: 'polls',
        title: 'Ψηφοφορίες',
        type: 'item',
        classes: 'nav-item',
        url: '/polls',
        icon: 'line-chart',
        role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      }
    ]
  },
  // {
  //   id: 'component',
  //   title: 'Components',
  //   type: 'item',
  //   classes: 'nav-item',
  //   url: '/components/basic/alert',
  //   icon: 'gold',
  //   target: true,
  //   breadcrumbs: false,
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
  // },
  // {
  //   id: 'widget',
  //   title: 'Widget',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'statistics',
  //       title: 'Statistics',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/widget/statistics',
  //       icon: 'idcard'
  //     },
  //     {
  //       id: 'data',
  //       title: 'Data',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/widget/data',
  //       icon: 'database'
  //     },
  //     {
  //       id: 'chart',
  //       title: 'Chart',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/widget/chart',
  //       icon: 'line-chart'
  //     }
  //   ]
  // },

  // {
  //   id: 'app',
  //   title: 'Application',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'chat',
  //       title: 'Chat',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/chat',
  //       icon: 'message',
  //       breadcrumbs: false
  //     },
  //     {
  //       id: 'calendar',
  //       title: 'Calendar',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/calendar',
  //       icon: 'calendar'
  //     },
  //     {
  //       id: 'customer',
  //       title: 'Customer',
  //       type: 'collapse',
  //       icon: 'customer-service',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'customer-list',
  //           title: 'Customer List',
  //           type: 'item',
  //           url: '/customer/customer-list'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'Profile',
  //       title: 'Profile',
  //       type: 'collapse',
  //       icon: 'user',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'user-profile',
  //           title: 'User Profile',
  //           type: 'item',
  //           url: '/user/user-profile',
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'account-profile',
  //           title: 'Account Profile',
  //           type: 'item',
  //           url: '/user/account-profile'
  //         },
  //         {
  //           id: 'user-list',
  //           title: 'User List',
  //           type: 'item',
  //           url: '/user/user-list'
  //         },
  //         {
  //           id: 'user-card',
  //           title: 'User Card',
  //           type: 'item',
  //           url: '/user/user-card'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'E Commerce',
  //       title: 'E-commerce',
  //       type: 'collapse',
  //       icon: 'shopping-cart',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'product',
  //           title: 'Product',
  //           type: 'item',
  //           url: '/e-commerce/product'
  //         },
  //         {
  //           id: 'product-details',
  //           title: 'Product Details',
  //           type: 'item',
  //           url: '/e-commerce/product-details',
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'product-list',
  //           title: 'Product List',
  //           type: 'item',
  //           url: '/e-commerce/product-list'
  //         },
  //         {
  //           id: 'new-product',
  //           title: 'Add New Product',
  //           type: 'item',
  //           url: '/e-commerce/new-product'
  //         },
  //         {
  //           id: 'checkout',
  //           title: 'Checkout',
  //           type: 'item',
  //           url: '/e-commerce/checkout'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'layouts',
  //   title: 'Layout Demo',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'vertical',
  //       title: 'Vertical',
  //       type: 'item',
  //       url: '/layout/vertical',
  //       icon: 'layout',
  //       target: true
  //     },
  //     {
  //       id: 'horizontal',
  //       title: 'Horizontal',
  //       type: 'item',
  //       url: '/layout/horizontal',
  //       icon: 'credit-card',
  //       target: true
  //     },
  //     {
  //       id: 'compact',
  //       title: 'Compact',
  //       type: 'item',
  //       url: '/layout/compact',
  //       icon: 'layout',
  //       target: true
  //     }
  //   ]
  // },
  // {
  //   id: 'icons',
  //   title: 'Icons',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'icon',
  //       title: 'Icons',
  //       type: 'collapse',
  //       icon: 'share-alt',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'feather',
  //           title: 'Feather',
  //           type: 'item',
  //           url: 'https://feathericons.com/',
  //           target: true,
  //           external: true
  //         },
  //         {
  //           id: 'ant',
  //           title: 'Ant Icons',
  //           type: 'item',
  //           url: 'https://ant.design/components/icon',
  //           target: true,
  //           external: true
  //         },

  //         {
  //           id: 'tabler',
  //           title: 'Tabler',
  //           type: 'item',
  //           url: 'https://tablericons.com/',
  //           target: true,
  //           external: true
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'forms',
  //   title: 'Forms',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'forms-element',
  //       title: 'Forms Elements',
  //       type: 'collapse',
  //       icon: 'file-text',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'form-basic',
  //           title: 'Form Basic',
  //           type: 'item',
  //           url: '/form/form-basic'
  //         },
  //         {
  //           id: 'form-floating',
  //           title: 'Form Floating',
  //           type: 'item',
  //           url: '/form/form-floating'
  //         },
  //         {
  //           id: 'form-options',
  //           title: 'Form Options',
  //           type: 'item',
  //           url: '/form/form-options'
  //         },
  //         {
  //           id: 'input-group',
  //           title: 'Input Groups',
  //           type: 'item',
  //           url: '/form/input-group'
  //         },
  //         {
  //           id: 'checkbox',
  //           title: 'CheckBox',
  //           type: 'item',
  //           url: '/form/checkbox'
  //         },
  //         {
  //           id: 'radio',
  //           title: 'Radio',
  //           type: 'item',
  //           url: '/form/radio'
  //         },
  //         {
  //           id: 'switch',
  //           title: 'Switch',
  //           type: 'item',
  //           url: '/form/switch'
  //         },
  //         {
  //           id: 'mega-option',
  //           title: 'Mega Option',
  //           type: 'item',
  //           url: '/form/mega-option'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'forms-plugin',
  //       title: 'Forms Plugins',
  //       type: 'collapse',
  //       icon: 'cloud-upload',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'frm-picker',
  //           title: 'Date Picker',
  //           type: 'item',
  //           url: '/form-plugin/picker'
  //         },
  //         {
  //           id: 'color-picker',
  //           title: 'Color Picker',
  //           type: 'item',
  //           url: '/form-plugin/color-picker'
  //         },
  //         {
  //           id: 'frm-select',
  //           title: 'Form Select',
  //           type: 'item',
  //           url: '/form-plugin/select'
  //         },
  //         {
  //           id: 're-captcha',
  //           title: 'Google reCaptcha',
  //           type: 'item',
  //           url: '/form-plugin/re-captcha'
  //         },
  //         {
  //           id: 'input-mask',
  //           title: 'Input Masks',
  //           type: 'item',
  //           url: '/form-plugin/input-mask'
  //         },
  //         {
  //           id: 'clipboard',
  //           title: 'Clipboard',
  //           type: 'item',
  //           url: '/form-plugin/clipboard'
  //         },
  //         {
  //           id: 'typeahead',
  //           title: 'Typeahead',
  //           type: 'item',
  //           url: '/form-plugin/typeahead'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'text-editor',
  //       title: 'Text Editor',
  //       type: 'collapse',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       icon: 'edit',
  //       children: [
  //         {
  //           id: 'quill',
  //           title: 'Quill',
  //           type: 'item',
  //           url: '/editor/quill'
  //         },
  //         {
  //           id: 'classic-editor',
  //           title: 'Classic Editor',
  //           type: 'item',
  //           url: '/editor/classic-editor'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'forms-layouts',
  //       title: 'Forms Layouts',
  //       type: 'collapse',
  //       icon: 'form',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'layouts',
  //           title: 'Layouts',
  //           type: 'item',
  //           url: '/form-layouts/layouts'
  //         },
  //         {
  //           id: 'form-multiColumn',
  //           title: 'MultiColumn',
  //           type: 'item',
  //           url: '/form-layouts/multiColumn'
  //         },
  //         {
  //           id: 'actionBars',
  //           title: 'ActionBars',
  //           type: 'item',
  //           url: '/form-layouts/actionBars'
  //         },
  //         {
  //           id: 'stickyBar',
  //           title: 'Sticky Action Bars',
  //           type: 'item',
  //           url: '/form-layouts/stickyBar'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'file-upload',
  //       title: 'File Upload',
  //       type: 'collapse',
  //       icon: 'upload',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'dropzone',
  //           title: 'Dropzone',
  //           type: 'item',
  //           url: '/file-upload/dropzone'
  //         },
  //         {
  //           id: 'files-uploader',
  //           title: 'Files Uploader',
  //           type: 'item',
  //           url: '/file-upload/files-dropzone'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'form-validator',
  //       title: 'Forms Validator',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/form/form-validator',
  //       icon: 'file-protect',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
  //     },
  //     {
  //       id: 'image-cropper',
  //       title: 'images Cropper',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/images-cropper',
  //       icon: 'file-image'
  //     }
  //   ]
  // },
  // {
  //   id: 'table',
  //   title: 'Table',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'bootstrap-table',
  //       title: 'Bootstrap Table',
  //       type: 'collapse',
  //       icon: 'insert-row-above',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'basic-table',
  //           title: 'Basic Table',
  //           type: 'item',
  //           url: '/bootstrap-table/basic-table'
  //         },
  //         {
  //           id: 'size-table',
  //           title: 'Sizing Table',
  //           type: 'item',
  //           url: '/bootstrap-table/sizing-table'
  //         },
  //         {
  //           id: 'border-table',
  //           title: 'Border Table',
  //           type: 'item',
  //           url: '/bootstrap-table/border-table'
  //         },
  //         {
  //           id: 'styling-table',
  //           title: 'Styling Table',
  //           type: 'item',
  //           url: '/bootstrap-table/styling-table'
  //         }
  //       ]
  //     }
  //     // {
  //     //   id: 'data-table',
  //     //   title: 'Data Table',
  //     //   type: 'item',
  //     //   classes: 'nav-item',
  //     //   url: '/data-table',
  //     //   icon: 'table'
  //     // }
  //   ]
  // },
  // {
  //   id: 'chart',
  //   title: 'Charts',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'charts',
  //       title: 'Charts',
  //       type: 'collapse',
  //       icon: 'pie-chart',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'apex-chart',
  //           title: 'Apex Chart',
  //           type: 'item',
  //           url: '/apex-chart'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'pages',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //   children: [
  //     {
  //       id: 'authentication',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'login',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'login',
  //           title: 'Login',
  //           type: 'item',
  //           url: '/auth/login',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'register',
  //           title: 'Register',
  //           type: 'item',
  //           url: '/auth/register',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'forgot',
  //           title: 'Forgot Password',
  //           type: 'item',
  //           url: '/auth/forgot-password',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'reset',
  //           title: 'Reset Password',
  //           type: 'item',
  //           url: '/auth/reset-password',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'check-mail',
  //           title: 'Check Mail',
  //           type: 'item',
  //           url: '/auth/check-mail',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'code-verify',
  //           title: 'Code Verification',
  //           type: 'item',
  //           url: '/auth/code-verify',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     },
  //     {
  //       id: 'maintenance',
  //       title: 'Maintenance',
  //       type: 'collapse',
  //       icon: 'rocket',
  //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
  //       children: [
  //         {
  //           id: 'error-404',
  //           title: 'Error 404',
  //           type: 'item',
  //           url: '/maintenance/error-404',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'error-500',
  //           title: 'Error 500',
  //           type: 'item',
  //           url: '/maintenance/error-500',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'error-401',
  //           title: 'Error 401',
  //           type: 'item',
  //           url: '/maintenance/error-401',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'coming-soon',
  //           title: 'Coming Soon',
  //           type: 'item',
  //           url: '/maintenance/coming-soon',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'under',
  //           title: 'Under Construction',
  //           type: 'item',
  //           url: '/maintenance/under-construct',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     }
  //     // {
  //     //   id: 'contact-us',
  //     //   title: 'Contact Us',
  //     //   type: 'item',
  //     //   classes: 'nav-item',
  //     //   url: '/contact-us',
  //     //   icon: 'phone',
  //     //   target: true,
  //     //   breadcrumbs: false
  //     // },
  //     // {
  //     //   id: 'price',
  //     //   title: 'Pricing',
  //     //   type: 'item',
  //     //   classes: 'nav-item',
  //     //   url: '/price',
  //     //   icon: 'dollar'
  //     // }
  //   ]
  // },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
    children: [
      {
        id: 'helpdesk',
        title: 'Helpdesk',
        type: 'collapse',
        icon: 'question-circle',
        isMainParent: true,
        role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
        children: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/helpdesk/dashboard',
            role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
          },
          {
            id: 'ticket',
            title: 'Ticket',
            type: 'collapse',
            role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
            children: [
              {
                id: 'create',
                title: 'Create',
                type: 'item',
                url: '/helpdesk/ticket/create'
              },
              {
                id: 'list',
                title: 'List',
                type: 'item',
                url: '/helpdesk/ticket/list'
              },
              {
                id: 'details',
                title: 'Details',
                type: 'item',
                url: '/helpdesk/ticket/details'
              }
            ]
          },
          {
            id: 'customer',
            title: 'Customer',
            type: 'item',
            url: '/helpdesk/customer'
          }
        ]
      },
      {
        id: 'contact-us',
        title: 'Contact Us',
        type: 'item',
        classes: 'nav-item',
        url: '/contact-us',
        icon: 'phone',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'price',
        title: 'Pricing',
        type: 'item',
        classes: 'nav-item',
        url: '/price',
        icon: 'dollar'
      }
      // {
      //   id: 'menu-levels',
      //   title: 'Menu levels',
      //   type: 'collapse',
      //   icon: 'menu-unfold',
      //   role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //   children: [
      //     {
      //       id: 'menu-level-2-1',
      //       title: 'Menu Level 2.1',
      //       type: 'item',
      //       url: 'javascript:',
      //       external: true
      //     },
      //     {
      //       id: 'menu-level-2.2',
      //       title: 'Menu Level 2.2',
      //       type: 'collapse',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //       classes: 'edge',
      //       children: [
      //         {
      //           id: 'menu-level-3.1',
      //           title: 'Menu Level 3.1',
      //           type: 'item',
      //           url: 'javascript:',
      //           external: true
      //         },
      //         {
      //           id: 'menu-level-3.2',
      //           title: 'Menu Level 3.2',
      //           type: 'item',
      //           url: 'javascript:',
      //           external: true
      //         },
      //         {
      //           id: 'menu-level-2.2',
      //           title: 'Menu Level 2.2',
      //           type: 'collapse',
      //           role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //           classes: 'edge',
      //           children: [
      //             {
      //               id: 'menu-level-4.1',
      //               title: 'Menu Level 4.1',
      //               type: 'item',
      //               url: 'javascript:',
      //               external: true
      //             },
      //             {
      //               id: 'menu-level-4.2',
      //               title: 'Menu Level 4.2',
      //               type: 'item',
      //               url: 'javascript:',
      //               external: true
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       id: 'menu-level-2.3',
      //       title: 'Menu Level 2.3',
      //       type: 'collapse',
      //       role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident],
      //       classes: 'edge',
      //       children: [
      //         {
      //           id: 'menu-level-3.1',
      //           title: 'Menu Level 3.1',
      //           type: 'item',
      //           url: 'javascript:',
      //           external: true
      //         },
      //         {
      //           id: 'menu-level-3.2',
      //           title: 'Menu Level 3.2',
      //           type: 'item',
      //           url: 'javascript:',
      //           external: true
      //         },
      //         {
      //           id: 'menu-level-3.3',
      //           title: 'Menu Level 3.3',
      //           type: 'collapse',
      //           classes: 'edge',
      //           role: [Role.Admin, Role.User],
      //           children: [
      //             {
      //               id: 'menu-level-4.1',
      //               title: 'Menu Level 4.1',
      //               type: 'item',
      //               url: 'javascript:',
      //               external: true
      //             },
      //             {
      //               id: 'menu-level-4.2',
      //               title: 'Menu Level 4.2',
      //               type: 'item',
      //               url: 'javascript:',
      //               external: true
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   id: 'sample-page',
      //   title: 'Sample Page',
      //   type: 'item',
      //   url: '/sample-page',
      //   classes: 'nav-item',
      //   icon: 'chrome'
      // },
      // {
      //   id: 'document',
      //   title: 'Document',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'https://codedthemes.gitbook.io/mantis-angular/',
      //   icon: 'question',
      //   target: true,
      //   external: true
      // }
    ]
  }
];
