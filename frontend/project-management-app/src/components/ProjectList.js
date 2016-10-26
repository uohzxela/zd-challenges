import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import Project from './Project';
import ProjectCount from './ProjectCount';
import ItemTypes from '../constants/ItemTypes';

const projectListTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    if (item.type !== props.type) {
      props.actions.classifyProject({
        sourceType: item.type,
        targetType: props.type,
        dragIndex: item.index,
      });
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

const listHeaderStyle = {
  backgroundColor: 'gray',
  color: 'white',
  padding: '1em',
  display: 'flex',
};

const listContainerStyle = {
  flex: 1,
  margin: 20,
};

const listNameStyle = {
  flex: 1,
};

class ProjectList extends React.Component {
  render() {
    const { projects, name, connectDropTarget, actions, type } = this.props;
    return connectDropTarget(
      <div style={listContainerStyle}>
        <div style={listHeaderStyle}>
          <div style={listNameStyle}>
            {name}
          </div>
          <ProjectCount count={projects.length} />
        </div>
        {projects.map((project, index) => (
          <Project
            key={project.id}
            type={type}
            index={index}
            id={project.id}
            text={project.text}
            sortProject={actions.sortProject}
          />
        ))}
      </div>
    );
  }
}

ProjectList.propTypes = {
  projects: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  actions: PropTypes.any.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default DropTarget(ItemTypes.PROJECT, projectListTarget, collect)(ProjectList);
