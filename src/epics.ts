import { fetchEmployeesEpic, fetchProjectsEpic, actionTypes, allocationLayout, projects2EmployeesMap, employees2ProjectsMap } from './components/Allocations/actions';
import { combineLatest } from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/switchMap';

import { combineEpics, ActionsObservable } from 'redux-observable';
import { Action } from 'redux';
import * as d3 from 'd3';
import * as R from 'ramda';

const toMap = function <V>(items: Array<V>, keyMap: (item: V) => string): { [key: string]: V } {
  return items.reduce((acc, item) => {
    acc[keyMap(item)] = item;
    return acc;
  }, {})
}

const getPathData = function (employeeId, projectId, y0, y1, empXYs, projXYs) {
  const e = empXYs[employeeId];
  const p = projXYs[projectId];

  if (e && p) {
    const path = d3.path();
    path.moveTo(e.x + e.width, e.y);
    path.quadraticCurveTo((p.x - e.x + e.width) / 2, e.y, p.x, p.y + y0 * p.height);
    path.lineTo(p.x, p.y + y1 * p.height);
    path.quadraticCurveTo((p.x - e.x + e.width) / 2, e.y + e.height, e.x + e.width, e.y + e.height);
    path.closePath;
    return path.toString();
  }
  else {
    return '';
  }
};

function calculateAllocationLayout(employees: Employee[], projects: Project[], chartSize: ClientRect): AllocationsLayout {
  const dimensions = {
    outerWidth: chartSize.width,
    outerHeight: chartSize.height,
    innerWidth: chartSize.width - chartSize.left - chartSize.right,
    innerHeight: chartSize.height - chartSize.top - chartSize.bottom,
    top: chartSize.top,
    right: chartSize.right,
    bottom: chartSize.bottom,
    left: chartSize.left,
  };

  const sortByOrgName = R.sortBy(x => x.orgName);
  const sortByName = R.sortBy(x => x.name);

  // calculate employee bars
  employees = sortByOrgName(employees);
  const empScaleY = d3.scaleBand()
    .domain(employees.map(emp => emp.id))
    .range([0, dimensions.innerHeight])
    .padding(0);

  const empBars: Bar<Employee>[] = employees.map(emp => ({
    key: `emp.${emp.id}`,
    x: 0,
    y: empScaleY(emp.id) || 0,
    width: 8,
    height: empScaleY.bandwidth(),
    fill: 'gray',
    data: emp
  }));

  // calculate project bars
  projects = sortByOrgName(projects);
  projects = projects.filter(p => p.totalAllocatedMembers > 0);

  const totalProjsAlloc = projects.reduce((sum, p) => sum + p.totalAllocatedMembers, 0);
  const projScaleY = d3.scaleLinear()
    .domain([0, totalProjsAlloc])
    .range([0, dimensions.innerHeight]);

  type projBarInter = { y0: number, y1: number, data: Project };
  const projBarsInter: projBarInter[] = projects.reduce<projBarInter[]>(function (acc, proj) {
    const last = acc.length === 0 ? 0 : acc[acc.length - 1].y1;
    const result = { y0: last, y1: proj.totalAllocatedMembers + last, data: proj };
    return acc.concat([result]);
  }, []);

  const projBarsOffsetX = dimensions.innerWidth / 2;
  const projBars: Bar<Project>[] = projBarsInter.map(p => ({
    key: `proj.${p.data.id}`,
    x: projBarsOffsetX,
    y: projScaleY(p.y0),
    width: 8,
    height: projScaleY(p.data.totalAllocatedMembers),
    data: p.data,
    fill: 'gray'
  }));

  const empXYs = toMap(empBars, e => e.data.id);
  const projXYs = toMap(projBars, p => p.data.id);

  const projMembers: any[] = [];
  type projMemInter = { y0: number, y1: number, data: ProjectEmployee };

  for (let p of projects) {
    const pmStack: projMemInter[] = sortByName(p.members).filter(m => m.allocation > 0).reduce<projMemInter[]>((acc, pm) => {
      const last = acc.length === 0 ? 0 : acc[acc.length - 1].y1;
      const result = { y0: last, y1: 1 + last, data: pm };
      return acc.concat([result]);
    }, []);
    for (let m of pmStack) {
      projMembers.push({
        key: `emp.${m.data.id}.proj.${p.id}`,
        path: getPathData(m.data.id, p.id, m.y0 / p.totalAllocatedMembers, m.y1 / p.totalAllocatedMembers, empXYs, projXYs),
        fill: 'gray',
        data: { projectId: p.id, ...m.data }
      });
    }
  }

  return {
    employees: empBars,
    projects: projBars,
    employeeProjects: projMembers,
    ...dimensions
  };
}

export function calculateChartEpic(action$: ActionsObservable<Action>) {
  const employees$ = action$.ofType(actionTypes.FetchEmployeesDone) as ActionsObservable<{ type: string, employees: Employee[] }>;
  const projects$ = action$.ofType(actionTypes.FetchProjectsDone) as ActionsObservable<{ type: string, projects: Project[] }>;
  const chartSize$ = action$.ofType(actionTypes.ChartResize) as ActionsObservable<{ type: string } & ClientRect>;

  return combineLatest(employees$, projects$, chartSize$, ({ employees }, { projects }, chartSize) => {
    const layout = calculateAllocationLayout(employees, projects, chartSize);
    return allocationLayout(layout);
  });
}

const calculateProject2EmployeesMap = function (projects: Project[]): IdMap {
  return projects.reduce(
    (map, proj) => ({
      ...map,
      [proj.id]: proj.members.filter(m => m.allocation > 0).map(e => e.id).reduce(
        (peMap, id) => ({
          ...peMap,
          [id]: true
        }),
        {})
    }),
    {}
  );
}
const calculateEmployee2ProjectsMap = function (employees: Employee[]): IdMap {
  return employees.reduce(
    (map, emp) => ({
      ...map,
      [emp.id]: emp.projects.filter(m => m.allocation > 0).map(ep => ep.id).reduce(
        (epMap, id) => ({
          ...epMap,
          [id]: true
        }),
        {})
    }),
    {}
  );
}

export function calculateEmployeeSelectionMapEpic(action$: ActionsObservable<Action>) {
  const employees$ = action$.ofType(actionTypes.FetchEmployeesDone) as ActionsObservable<{ type: string, employees: Employee[] }>;
  return employees$.map(({ employees }) => employees2ProjectsMap(calculateEmployee2ProjectsMap(employees)));
}

export function calculateProjectSelectionMapEpic(action$: ActionsObservable<Action>) {
  const projects$ = action$.ofType(actionTypes.FetchProjectsDone) as ActionsObservable<{ type: string, projects: Project[] }>;
  return projects$.map(({ projects }) => projects2EmployeesMap(calculateProject2EmployeesMap(projects)));
}

export default combineEpics(
  calculateChartEpic,
  fetchEmployeesEpic,
  fetchProjectsEpic,
  calculateEmployeeSelectionMapEpic,
  calculateProjectSelectionMapEpic
);