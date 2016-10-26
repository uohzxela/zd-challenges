import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { compose } from 'redux';
import ItemTypes from '../constants/ItemTypes';

const projectSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      type: props.type,
    };
  },
};

// This function is written with reference to
// https://github.com/gaearon/react-dnd/blob/master/examples/04%20Sortable/Simple/Card.js
const projectTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const sourceType = monitor.getItem().type;
    const targetType = props.type;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Don't sort different project types
    if (sourceType !== targetType) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.sortProject({
      dragIndex,
      hoverIndex,
      projectType: sourceType,
    });

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

function dropTargetCollect(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

function dragSourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const projectStyle = {
  border: '1px solid lightgray',
  backgroundColor: 'white',
  padding: '1rem 1rem',
  color: 'black',
  cursor: 'move',
  wordBreak: 'break-all',
  wordWrap: 'break-word',
};

class Project extends React.Component {
  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;
    return connectDragSource(connectDropTarget(
      <div style={{ ...projectStyle, opacity }}>
        {text}
      </div>
    ));
  }
}

Project.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  sortProject: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  id: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default compose(
  DropTarget(ItemTypes.PROJECT, projectTarget, dropTargetCollect),
  DragSource(ItemTypes.PROJECT, projectSource, dragSourceCollect)
)(Project);
