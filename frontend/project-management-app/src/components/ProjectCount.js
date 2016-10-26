import React, { PropTypes } from 'react';

const projectCountStyle = {
  borderRadius: 3,
  backgroundColor: 'white',
  padding: '0.5rem 0.5rem',
  color: 'black',
  textAlign: 'center',
  alignSelf: 'flex-end',
  fontSize: 10,
};

export default class ProjectCount extends React.Component {
  render() {
    const { count } = this.props;
    return (
      <div className="inner-shadow" style={projectCountStyle}>
        <b style={{ fontSize: 12 }}>
          {count.toString()}
        </b>
        <div>
          PROJECTS
        </div>
      </div>
    );
  }
}

ProjectCount.propTypes = {
  count: PropTypes.number.isRequired,
};
