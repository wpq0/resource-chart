import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { employees, projects, layout, selectedEmployee, selectedProject } from './components/Allocations/reducers';

export default combineReducers({
  routing,
  employees,
  projects,
  layout,
  selectedEmployee,
  selectedProject
});