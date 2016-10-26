import React, { PropTypes } from 'react';

const formStyle = {
  flex: 1,
  marginLeft: 20
};

export default class AddProject extends React.Component {
  static propTypes = {
    actions: PropTypes.any.isRequired
  };
  render() {
    let input;
    return(
      <div style={formStyle}>
        <form onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return;
          }
          this.props.actions.addProject(input.value);
          input.value = '';
        }}>
          <button type="submit">
            Add Project
          </button>
          <input ref={node => {
            input = node
          }} />
        </form>
      </div>
    );
  }
}
