import React, { PropTypes } from 'react';

const projectCountStyle = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  color: 'black',
  textAlign: 'center',
  alignSelf: 'flex-end',
  width: 100
};

export default class ProjectCount extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired
  };
  render() {
    const { count } = this.props;
    return(
      <div style={projectCountStyle}>
        {count.toString()} {"PROJECTS"}
      </div>
    );
  }
}
