declare type State = {
  employees: { [id: string]: Employee },
  projects: { [id: string]: Project },
  customers: { [id: string]: Customer },
  layout: AllocationsLayout,
  selectedEmployee: string,
  selectedProject: string,
  employees2Projects: IdMap,
  projects2Employees: IdMap,
  filterGroup: FilterGroupSelection,
}

declare type IdMap = {
  [key: string]: {
    [key: string]: any
  }
};

declare type AllocationsLayout = {
  employees: Bar<Employee>[],
  employeeProjects: CurveArea<ProjectEmployee & { projectId: string }>[],
  projects: Bar<Project>[],
} & ChartDimensions;

declare type CurveArea<T> = {
  key: string,
  path: string,
  fill: string,
  data: T
}

declare type Bar<T> = {
  key: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  data: T
};

declare type Margin = {
  top: number,
  right: number,
  bottom: number,
  left: number
}

declare type ChartDimensions = {
  innerWidth: number,
  innerHeight: number,
  outerWidth: number,
  outerHeight: number,
} & Margin

declare type Employee = {
  id: string,
  name: string,
  totalAllocation: number,
  projects: Array<EmployeeProject>
}

declare type EmployeeProject = {
  id: string,
  name: string,
  allocation: number,
}

declare type Project = {
  id: string,
  name: string,
  totalAllocation: number,
  totalMembers: number,
  totalAllocatedMembers: number,
  members: Array<ProjectEmployee>
}

declare type ProjectEmployee = Pick<EmployeeProject, keyof EmployeeProject>

declare type Customer = {
  id: string,
  name: string,
  totalProjects: number,
  totalEmployee: number,
  totalAllocatedEmployee: number,
  totalBillableEmployee: number,
  totalAllocation: number,
  projects: Array<CustomerProject>
}

declare type CustomerProject = {
  id: string,
  name: string,
  billable: boolean,
  orgName: string,
  type: string,
  membersCount: number
}

declare type FilterGroup = {
  key: string,
  count: number
}

declare type FilterGroupSelection = {
  title: string,
  url: string,
}

type Pair = keyof Array<number> & { data: {} };