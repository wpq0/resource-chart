declare type State = {
  employees :{ [id:string]: Employee },
  projects: { [id:string]: Project },
  customers: { [id:string]: Customer },
  layout: AllocationsLayout,
  filterGroup: FilterGroupSelection
}

declare type AllocationsLayout = {
  employees: Bar<Employee>[],
  employeeProjects: CurveArea<ProjectEmployee & { projectId:string }>[],
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
  top:number, 
  right:number, 
  bottom:number, 
  left:number
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
  fullName: string,
  orgName: string,
  level: string,
  expertise: string,
  position: string,
  office: string,
  managerName: string,
  totalAllocation: number,
  projects: Array<EmployeeProject>
}

declare type EmployeeProject = {
  id: string,
  name: string,
  role: string,
  allocation: number,
  billable: boolean
}

declare type Project = {
  id: string,
  name: string,
  managerName: string,
  type: string,
  billable: boolean,
  customerId: string,
  customerName: string,
  orgName: string,
  totalAllocation: number,
  totalMembers: number,
  totalAllocatedMembers: number,
  totalBillabledMembers: number,
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
  url:string,
}

type Pair = keyof Array<number> & { data:{} };