import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ProjectsHeader from '../components/ProjectsHeader';
import ProjectsContainer from './ProjectsContainer';
import * as ProjectActions from '../actions';

class App extends React.Component {
  render() {
    return (
      <div>
        <ProjectsHeader {...this.props} />
        <ProjectsContainer {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projectsToDo: state.projects.toDo,
  projectsInProgress: state.projects.inProgress,
  projectsDone: state.projects.done,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ProjectActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
