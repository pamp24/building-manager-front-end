import { Role } from 'src/app/theme/shared/components/_helpers/role';
import { NavigationItem } from 'src/app/theme/shared/models/navigation';

export const NavigationItems: NavigationItem[] = [
  {
    id: 'Admin',
    title: "Admin's Dashboard",
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin],
    children: [
      {
        id: 'dashboard',
        title: "Admin's Dashboard",
        type: 'item',
        classes: 'nav-item',
        url: '/admin/dashboard'
      },
      {
        id: 'finance',
        title: 'Finance',
        type: 'item',
        classes: 'nav-item',
        icon: 'dollar',
        url: '/admin/finance'
      },
      {
        id: 'support-agents',
        title: 'Support Agents',
        type: 'item',
        classes: 'nav-item',
        url: '/pm/support-agents'
      }
    ]
  },
  {
    id: 'property-management',
    title: 'Property Manager Panel',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.PropertyManager, Role.PropertyAgent, Role.AdminAgent],
    children: [
      {
        id: 'dashboard',
        title: "Company's Dashboard",
        type: 'item',
        classes: 'nav-item',
        url: '/pm/pm-dashboard'
      },
      {
        id: 'create',
        title: 'Create Expenses Invoice',
        type: 'item',
        classes: 'nav-item',
        url: '/statement/create'
      },
      {
        id: 'buildings',
        title: 'Buildings',
        type: 'item',
        classes: 'nav-item',
        url: '/pm/buildings'
      },
      {
        id: 'support-agents',
        title: 'Support Agents',
        type: 'item',
        classes: 'nav-item',
        url: '/pm/support-agents',
        role: [Role.PropertyManager]
      }
    ]
  },
  {
    id: 'Building Manager',
    title: 'Building Manager Panel',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.BuildingManager],
    children: [
      {
        id: 'dashboard',
        title: "Manager's Dashboard",
        type: 'item',
        classes: 'nav-item',
        url: '/statement/dashboard'
      },
      {
        id: 'create',
        title: 'Create Expenses Invoice',
        type: 'item',
        classes: 'nav-item',
        url: '/statement/create'
      },
      {
        id: 'list',
        title: 'List Expenses Invoices',
        type: 'item',
        classes: 'nav-item',
        url: '/statement/list'
      }
    ]
  },
  {
    id: 'Dashboard',
    title: 'Dashboard',
    type: 'group',
    classes: 'first-group',
    icon: 'icon-navigation',
    role: [Role.BuildingManager, Role.User, Role.Owner, Role.Resident],
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        icon: 'dashboard',
        url: '/dashboard/default',
        breadcrumbs: false,
        role: [
          Role.Admin,
          Role.User,
          Role.PropertyManager,
          Role.BuildingManager,
          Role.Owner,
          Role.Resident,
          Role.PropertyAgent,
          Role.AdminAgent
        ]
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
    id: 'Professionals',
    title: 'Professionals',
    type: 'group',
    icon: 'icon-navigation',
    role: [
      Role.Admin,
      Role.User,
      Role.PropertyManager,
      Role.BuildingManager,
      Role.Owner,
      Role.Resident,
      Role.PropertyAgent,
      Role.AdminAgent
    ],
    children: [
      {
        id: 'professional-buisnesses-management',
        title: 'Professional Businesses Management',
        type: 'item',
        classes: 'item',
        icon: 'audit',
        url: '/professionals/approval',
        role: [Role.Admin]
      },
      {
        id: 'professionals',  
        title: 'Επαγγελματίες',
        type: 'item',
        icon: 'tool',
        url: '/professionals'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    role: [
      Role.Admin,
      Role.User,
      Role.PropertyManager,
      Role.BuildingManager,
      Role.Owner,
      Role.Resident,
      Role.PropertyAgent,
      Role.AdminAgent
    ],
    children: [
      {
        id: 'helpdesk',
        title: 'Helpdesk',
        type: 'collapse',
        icon: 'question-circle',
        isMainParent: true,
        role: [
          Role.Admin,
          Role.User,
          Role.PropertyManager,
          Role.BuildingManager,
          Role.Owner,
          Role.Resident,
          Role.PropertyAgent,
          Role.AdminAgent
        ],
        children: [
          {
            id: 'dashboard',
            title: 'Ticket Dashboard',
            type: 'item',
            url: '/helpdesk/dashboard',
            role: [Role.Admin, Role.PropertyManager, Role.BuildingManager, Role.PropertyAgent, Role.AdminAgent]
          },
          {
            id: 'create ticket',
            title: 'Create Ticket',
            type: 'item',
            url: '/helpdesk/ticket/create',
            role: [
              Role.Admin,
              Role.User,
              Role.PropertyManager,
              Role.BuildingManager,
              Role.Owner,
              Role.Resident,
              Role.PropertyAgent,
              Role.AdminAgent
            ]
          },
          {
            id: 'list',
            title: 'List Tickets',
            type: 'item',
            url: '/helpdesk/ticket/list',
            role: [
              Role.Admin,
              Role.User,
              Role.PropertyManager,
              Role.BuildingManager,
              Role.Owner,
              Role.Resident,
              Role.PropertyAgent,
              Role.AdminAgent
            ]
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
