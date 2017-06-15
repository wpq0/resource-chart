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

export function selectedEmployee(state = null, action) {
  switch(action.type) {
    case actionTypes.EmployeeSelected:
      return state === action.employeeId ? null : action.employeeId;
    case actionTypes.ProjectSelected:
      return null;
    default:
      return state;
  }
}

export function selectedProject(state = null, action) {
  switch(action.type) {
    case actionTypes.ProjectSelected:
      return state === action.projectId ? null : action.projectId;
    case actionTypes.EmployeeSelected:
      return null;
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

export function projects2Employees(state = {}, action) {
  switch (action.type) {
    case actionTypes.ProjectsToEmployeesMap:
      return action.map;
    default:
      return state;
  }
}

export function employees2Projects(state = {}, action) {
  switch (action.type) {
    case actionTypes.EmployeesToProjectsMap:
      return action.map;
    default:
      return state;
  }
}