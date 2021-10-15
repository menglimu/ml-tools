

export function createRandomId() {
  return (
    "id-" +
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    "-" +
    new Date().getTime() +
    "-" +
    Math.random()
      .toString()
      .substr(2, 5)
  );
}
const dataHost = 'http://10.8.191.62:7080'
export const staticRoutes = 
[
  {
    id: 'KEYCROWD',
    text: '重点人群建库',
    leaf: false,
    expanded: true,
    url: '',
    children: [
      {
        id: 'KEYCROWD_02',
        text: '重点人群信息管理',
        leaf: false,
        expanded: true,
        url: '',
        children: [
          {
            children: [],
            expanded: true,
            icon: '',
            id: 'KEYCROWD_02.01',
            leaf: false,
            
            systemType: 0,
            text: '重点人群信息管理',
            url: '/keycordinfomanage',
            pids: ['KEYCROWD_02', 'KEYCROWD_02.01']
          }
        ],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: 'KEYCROWD_03',
        text: '重点人像建模管理',
        leaf: false,
        expanded: true,
        url: '',
        children: [
          {
            children: [],
            expanded: true,
            icon: '',
            id: 'KEYCROWD_03.01',
            leaf: false,
            
            systemType: 0,
            text: '重点人群建模审批',
            url: '/imagemodel/modelingaudit',
            pids: ['KEYCROWD_03', 'KEYCROWD_03.01']
          },
          {
            children: [],
            expanded: true,
            icon: '',
            id: 'KEYCROWD_03.02',
            leaf: false,
            
            systemType: 0,
            text: '重点人像建模任务',
            url: '/imagemodel/modelingtask',
            pids: ['KEYCROWD_03', 'KEYCROWD_03.02']
          }
        ],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: 'KEYCROWD_04',
        text: '标签管理',
        leaf: false,
        expanded: true,
        url: '',
        children: [
          {
            children: [],
            expanded: true,
            icon: '',
            id: 'KEYCROWD_04.01',
            leaf: false,
            
            systemType: 0,
            text: '标签管理',
            url: '/labelmanage',
            pids: ['KEYCROWD_04', 'KEYCROWD_04.01']
          }
        ],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: 'KEYCROWD_05',
        text: '人员辖区管理',
        leaf: false,
        expanded: true,
        url: '',
        children: [
          {
            children: [],
            expanded: true,
            icon: '',
            id: 'KEYCROWD_05.01',
            leaf: false,
            
            systemType: 0,
            text: '批量关联管理',
            url: '/areamange/batchcontact',
            pids: ['KEYCROWD_05', 'KEYCROWD_05.01']
          },
          {
            children: [],
            expanded: true,
            icon: '',
            id: 'KEYCROWD_05.02',
            leaf: false,
            
            systemType: 0,
            text: '未分配人员管理',
            url: '/areamange/unassignedperson',
            pids: ['KEYCROWD_05', 'KEYCROWD_05.02']
          }
        ],

        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      }
      // {
      //   id: 'KEYCROWD_05',
      //   text: '存储预警',
      //   leaf: false,
      //   expanded: true,
      //   url: '',
      //   children: [
      //     {
      //       children: [],
      //       expanded: true,
      //       icon: '',
      //       id: 'KEYCROWD_04.01',
      //       leaf: false,
      //       
      //       systemType: 0,
      //       text: '自动备份',
      //       url: '/storagewarning/automaticbackup',
      //       pids: ['KEYCROWD_05', 'KEYCROWD_05.01']
      //     }
      //   ],
      //   icon: 'nav_maincommand',
      //   
      //   systemType: 0,
      //   pids: []
      // }
    ]
  },
  {
    id: createRandomId(),
    text: '数据采集',
    leaf: false,
    expanded: true,
    // url: '/keypersonnel',
    url: '',
    children: [
      {
        id: createRandomId(),
        text: '离线任务采集',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-development/taskdev`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: createRandomId(),
        text: '文件采集',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-development/collect`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: createRandomId(),
        text: '实时任务采集',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-development/real-time-task`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: createRandomId(),
        text: 'SQL模板管理',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-development/sql-template`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: createRandomId(),
        text: '任务标签',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-development/task-tag`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      }
    ]
  },
  {
    id: createRandomId(),
    text: '数据管理',
    leaf: false,
    expanded: true,
    // url: '/keypersonnel',
    url: '',
    children: [
      {
        id: createRandomId(),
        text: '元数据管理',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-management/mdata`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: createRandomId(),
        text: '数据源管理',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-management/datasource`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: createRandomId(),
        text: '文件管理',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-management/file-management`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      },
      {
        id: createRandomId(),
        text: '数据字典管理',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-management/data-dictionary`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      }
    ]
  },
  {
    id: createRandomId(),
    text: '数据资源',
    leaf: false,
    expanded: true,
    // url: '/keypersonnel',
    url: '',
    children: [
      {
        id: createRandomId(),
        text: '我的资源',
        leaf: false,
        expanded: true,
        url: `/iframe/${dataHost}/web/index.html#/Data-catalogue/my-interface`,
        children: [],
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: []
      }
    ]
  },

  {
    id: 'KEYPERSONNEL',
    text: '综合管理',
    leaf: false,
    expanded: true,
    // url: '/keypersonnel',
    url: '',
    children: [
      {
        id: createRandomId(),
        text: '存储预警',
        leaf: false,
        expanded: true,
        url: '',
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: [],
        children: [
          {
            id: createRandomId(),
            text: '存储预警',
            leaf: false,
            expanded: true,
            url: '/sys/warn/warn',
            children: [],
            icon: 'nav_maincommand',
            
            systemType: 0,
            pids: []
          },
          {
            id: createRandomId(),
            text: '自动备份',
            leaf: false,
            expanded: true,
            url: '/sys/warn/backup',
            children: [],
            icon: 'nav_maincommand',
            
            systemType: 0,
            pids: []
          },
          {
            id: createRandomId(),
            text: '预警记录',
            leaf: false,
            expanded: true,
            url: '/sys/warn/record',
            children: [],
            icon: 'nav_maincommand',
            
            systemType: 0,
            pids: []
          },
          {
            id: createRandomId(),
            text: '回滚记录',
            leaf: false,
            expanded: true,
            url: '/sys/warn/rollback',
            children: [],
            icon: 'nav_maincommand',
            
            systemType: 0,
            pids: []
          }
        ]
      },
      // {
      //   id: 'KEYPERSONNEL_03',
      //   text: '外部链接',
      //   leaf: false,
      //   expanded: true,
      //   url: '/iframe/http://172.23.25.39:7080/web/index.html#/Data-development/taskdev?a=12',
      //   children: [],
      //   icon: 'nav_maincommand',
      //   
      //   systemType: 0,
      //   pids: []
      // },
      {
        id: createRandomId(),
        text: '日志管理',
        leaf: false,
        expanded: true,
        url: '',
        icon: 'nav_maincommand',
        
        systemType: 0,
        pids: [],
        children: [
          {
            id: createRandomId(),
            text: '登录日志',
            leaf: false,
            expanded: true,
            url: '/sys/log/access',
            children: [],
            icon: 'nav_maincommand',
            
            systemType: 0,
            pids: []
          },
          {
            id: createRandomId(),
            text: '业务日志',
            leaf: false,
            expanded: true,
            url: '/sys/log/biz',
            children: [],
            icon: 'nav_maincommand',
            
            systemType: 0,
            pids: []
          },
          {
            id: createRandomId(),
            text: '错误日志',
            leaf: false,
            expanded: true,
            url: '/sys/log/err',
            children: [],
            icon: 'nav_maincommand',
            
            systemType: 0,
            pids: []
          }
        ]
      }
    ]
  }
]
