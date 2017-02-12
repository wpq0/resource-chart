/// <reference path="../../../globals.d.ts" />
import { actionTypes } from './actions';

export function employees(state:Array<Employee> = [], action) {
  switch(action.type) {
    case actionTypes.FetchEmployeesDone:
      return action.employees;
    case actionTypes.FetchEmployeesFailed:
    case actionTypes.FetchEmployeesCanceled:
      return state;
    default:
      return state;
  }
}

export function projects(state:Array<Project> = [], action) {
  switch(action.type) {
    case actionTypes.FetchProjectsDone:
      return action.projects;
    case actionTypes.FetchProjectsFailed:
    case actionTypes.FetchProjectsCanceled:
      return state;
    default:
      return state;
  }
}

export function layout(state = {}, action) {
  switch(action.type) {
    case actionTypes.AllocationLayout:
      return action.layout;
    default:
      return state;
  }
}

export function selectedEmployee(state = null, action) {
  switch(action.type) {
    case actionTypes.EmployeeSelected:
      const key = `emp.${action.employeeId}`;
      return key === state ? null : key;
    case actionTypes.EmployeeDeSelected:
      return null;
    default:
      return state;
  }
}

export function selectedProject(state = null, action) {
  switch(action.type) {
    case actionTypes.ProjectSelected:
      const key = `proj.${action.projectId}`;
      return key === state ? null : key;
    case actionTypes.ProjectDeSelected:
      return null;
    default:
      return state;
  }
}