import React, { PropTypes } from 'react';

const formStyle = {
  flex: 1,
  marginLeft: 20,
};

const buttonStyle = {
  padding: 10,
};

const inputStyle = {
  padding: 7,
};

export default class AddProject extends React.Component {
  render() {
    let input;
    return (
      <div style={formStyle}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.value.trim()) {
              return;
            }
            this.props.actions.addProject(input.value);
            input.value = '';
          }}
        >
          <button
            style={buttonStyle}
            type="submit"
          >
            Add Project
          </button>
          <input
            style={inputStyle}
            ref={(node) => {
              input = node;
            }}
          />
        </form>
      </div>
    );
  }
}

AddProject.propTypes = {
  actions: PropTypes.object.isRequired,
};
