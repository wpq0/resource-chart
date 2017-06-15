/// <reference path="../../../globals.d.ts" />
import * as React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import actions from './actions';

class Allocations extends React.Component<{ margin: Margin, selectedEmployee, selectedProject, employees2Projects, projects2Employees } & AllocationsLayout & typeof actions, {}> {
  chart: HTMLElement

  componentDidMount() {
    this.updateSize();
    this.props.fetchEmployees(null);
    this.props.fetchProjects(null);
    window.addEventListener("resize", this.updateSize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize.bind(this));
  }

  updateSize() {
    if (this.chart) {
      const { width, height } = this.chart.getBoundingClientRect();
      const { top, right, bottom, left } = this.props.margin;
      this.props.chartResize({ width, height, top, right, bottom, left });
    }
  }

  render() {
    // emp column as stacked rects (uniform height), horzontal inner bar for allocations
    // projs column as stacked rects, height scaled by allocations
    // emp-proj-alloc links: curve from left point (emp), expand to corresponding allocation in project 
    const { employees, projects, employeeProjects, selectedEmployee, selectedProject } = this.props;

    if (!employees || !projects || !employeeProjects) {
      return (<div className='chart' ref={div => { this.chart = div; }}></div>);
    }

    const selectedEmployeeProjects = selectedEmployee != null ? this.props.employees2Projects[selectedEmployee] || {} : {};
    const selectedProjectEmployees = selectedProject != null ? this.props.projects2Employees[selectedProject] || {} : {};
    console.log(selectedEmployee, selectedEmployeeProjects, selectedProject, selectedProjectEmployees);
    return (
      <div className='chart' ref={div => { this.chart = div; }}>
        <svg width={this.props.outerWidth} height={this.props.outerHeight}>
          <g transform={`translate(${this.props.left}, ${this.props.top})`}>
            <g className='emps'>
              {employees.map(emp => (
                <g className='emp'
                  key={emp.key}
                  opacity={selectedEmployee != null && selectedEmployee === emp.data.id 
                            ? 1 
                            : selectedProject != null && selectedProjectEmployees.hasOwnProperty(emp.data.id)
                              ? 1
                              : 0.3}
                  transform={`translate(${emp.x}, ${emp.y})`}
                  onClick={() => this.props.selectEmployee(emp.data.id, employees, employeeProjects, projects)}>
                  <rect stroke='white'
                    strokeWidth='0.5'
                    fill={emp.fill}
                    width={emp.width}
                    height={emp.height}>
                  </rect>
                  <text className='emp__name'
                    dx={-2}
                    dy={emp.height / 2 + 3}>{emp.data.name}</text>
                </g>
              ))}
            </g>
            <g className='proj-emp'>
              {employeeProjects.map(ep => (
                <path key={ep.key}
                  d={ep.path}
                  fill={ep.fill}
                  stroke='white'
                  strokeWidth='0.5'
                  opacity={selectedEmployee != null && selectedEmployee === ep.data.id
                            ? 0.75
                            : selectedProject != null && selectedProject === ep.data.projectId
                              ? 0.75
                              : 0.05 }>
                </path>))}
            </g>
            <g className='projs'>
              {projects.map(proj => (
                <g className='proj'
                  key={proj.key}
                  opacity={ selectedProject != null && selectedProject === proj.data.id
                              ? 1 
                              : selectedEmployee != null && selectedEmployeeProjects.hasOwnProperty(proj.data.id)
                                ? 1 
                                : 0.3 }
                  transform={`translate(${proj.x}, ${proj.y})`}
                  onClick={() => this.props.selectProject(proj.data.id, employees, employeeProjects, projects)} >
                  <rect stroke='white'
                    strokeWidth='0.5'
                    width={proj.width}
                    height={proj.height}
                    fill={proj.fill}>
                  </rect>
                  <text className='proj__name'
                    dx={proj.width + 2}
                    dy={proj.height / 2 + 2}>{proj.data.name}</text>
                </g>
              ))}
            </g>
          </g>
        </svg>
      </div>
    );
  }
}
const state2Props = (state:State, ownProps: Margin) => ({ 
  ...state.layout, 
  selectedEmployee: state.selectedEmployee, 
  selectedProject: state.selectedProject, 
  employees2Projects: state.employees2Projects,
  projects2Employees: state.projects2Employees,
  margin: ownProps 
});
export default connect(state2Props, actions)(Allocations);