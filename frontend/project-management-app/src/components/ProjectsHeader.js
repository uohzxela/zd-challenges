import React, { PropTypes } from 'react';
import AddProject from './AddProject';
import ProjectCount from './ProjectCount';

const headerStyle = {
  display: 'flex',
};

const totalProjectCountStyle = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  marginRight: 20,
};

export default class ProjectsHeader extends React.Component {
  render() {
    const { projectsToDo, projectsInProgress, projectsDone } = this.props;
    const totalProjectCount = projectsToDo.length + projectsInProgress.length + projectsDone.length;
    return (
      <div style={headerStyle}>
        <AddProject {...this.props} />
        <div style={totalProjectCountStyle}>
          <b> TOTAL </b>
          <ProjectCount count={totalProjectCount} />
        </div>
      </div>
    );
  }
}

ProjectsHeader.propTypes = {
  projectsToDo: PropTypes.array.isRequired,
  projectsInProgress: PropTypes.array.isRequired,
  projectsDone: PropTypes.array.isRequired,
};
