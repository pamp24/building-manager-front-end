import { Role } from 'src/app/theme/shared/components/_helpers/role';
import { NavigationItem } from 'src/app/theme/shared/models/navigation';




export const NavigationItems: NavigationItem[] = [
  {
    id: 'admin',
    title: 'Admin Panel',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.PropertyManager, Role.BuildingManager],
    children: [
      {
        id: 'dashboard',
        title: "Manager's Dashboard",
        type: 'item',
        classes: 'nav-item',
        url: '/invoice/dashboard'
      },
      {
        id: 'create',
        title: 'Create Expenses Invoice',
        type: 'item',
        classes: 'nav-item',
        url: '/invoice/create'
      },
      {
        id: 'list',
        title: 'List Expenses Invoices',
        type: 'item',
        classes: 'nav-item',
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
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        icon: 'dashboard',
        url: '/dashboard/default',
        breadcrumbs: false,
        role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      },
      {
        id: 'finance',
        title: 'Finance',
        type: 'item',
        classes: 'nav-item',
        icon: 'dollar',
        url: '/dashboard/finance',
        role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      },
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
        classes: 'nav-item',
        icon: 'database',
        url: '/user/account-profile',
        role: [Role.Admin, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      },
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
    ]
  }
];
