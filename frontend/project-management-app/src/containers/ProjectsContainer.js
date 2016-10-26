import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ProjectList from '../components/ProjectList';

const projectsContainerStyle = {
  display: 'flex'
};

class ProjectsContainer extends Component {
  render() {
    const { projectsToDo, projectsInProgress, projectsDone, actions } = this.props;
    return (
      <div style={projectsContainerStyle}>
        <ProjectList
          name="To Do"
          type="toDo"
          projects={projectsToDo}
          actions={actions}
        />
        <ProjectList
          name="In Progress"
          type="inProgress"
          projects={projectsInProgress}
          actions={actions}
        />
        <ProjectList
          name="Done"
          type="done"
          projects={projectsDone}
          actions={actions}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(ProjectsContainer);
