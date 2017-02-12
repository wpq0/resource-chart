/// <reference path="../../../globals.d.ts" />
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/withLatestFrom';

import { Action } from 'redux';
import { combineEpics, ActionsObservable } from 'redux-observable';

export const actionTypes = {
  FetchEmployees: 'FETCH_EMPLOYEES',
  FetchEmployeesDone: 'FETCH_EMPLOYEES_DONE',
  FetchEmployeesFailed: 'FETCH_EMPLOYEES_FAILED',
  FetchEmployeesCanceled: 'FETCH_EMPLOYEES_CANCELED',
  FetchProjects: 'FETCH_PROJECTS',
  FetchProjectsDone: 'FETCH_PROJECTS_DONE',
  FetchProjectsFailed: 'FETCH_PROJECTS_FAILED',
  FetchProjectsCanceled: 'FETCH_PROJECTS_CANCELED',
  AllocationLayout: 'ALLOCATION_LAYOUT',
  ChartResize: 'CHART_RESIZE',
  EmployeeSelected: 'SELECT_EMPLOYEE',
  EmployeeDeSelected: 'DESELECT_EMPLOYEE',
  ProjectSelected: 'SELECT_PROJECT',
  ProjectDeSelected: 'DESELECT_PROJECT',
};

export const chartResize = (size:ClientRect) =>
  ({ type:actionTypes.ChartResize, ...size });

export const selectEmployee = (employeeId) =>
  ({ type:actionTypes.EmployeeSelected, employeeId });

export const deselectEmployee = (employeeId) =>
  ({ type:actionTypes.EmployeeDeSelected });

export const selectProject = (projectId) =>
  ({ type:actionTypes.ProjectSelected, projectId });

export const deselectProject = (projectId) =>
  ({ type:actionTypes.ProjectDeSelected });

export const fetchEmployeesDone = (data: Employee[]) =>
  ({ type:actionTypes.FetchEmployeesDone, employees: data })

export const fetchEmployees = (condition) => 
  ({ type: actionTypes.FetchEmployees });

export const fetchEmployeesFailed = (error) => 
  ({ type: actionTypes.FetchEmployeesFailed, error })

export const fetchEmployeesEpic = (action$: ActionsObservable<Action>) =>
  action$
    .ofType(actionTypes.FetchEmployees)
    .switchMap(()=>
      ajax
        .getJSON<Employee[]>('/data/employeeAllocations.json')
        .map(data=>fetchEmployeesDone(data))
        .catch(error => Observable.of(fetchEmployeesFailed(error)))
        .takeUntil(action$.ofType(actionTypes.FetchEmployeesCanceled))
    );

export const fetchProjectsDone = (data: Project[]) =>
  ({ type:actionTypes.FetchProjectsDone, projects: data })

export const fetchProjects = (condition) => 
  ({ type: actionTypes.FetchProjects });

export const fetchProjectsFailed = (error) => 
  ({ type: actionTypes.FetchProjectsFailed, error });

export const fetchProjectsEpic = (action$: ActionsObservable<Action>) =>
  action$
    .ofType(actionTypes.FetchProjects)
    .switchMap(()=>
      ajax
        .getJSON<Project[]>('/data/projectAllocations.json')
        .map(data=>fetchProjectsDone(data))
        .catch(error => Observable.of(fetchProjectsFailed(error)))
        .takeUntil(action$.ofType(actionTypes.FetchProjectsCanceled))
    );

export const allocationLayout = (layout) => ({
  type:actionTypes.AllocationLayout, layout
});

export default {
  fetchProjects,
  fetchEmployees,
  chartResize,
  selectEmployee,
  deselectEmployee,
  selectProject,
  deselectProject
};