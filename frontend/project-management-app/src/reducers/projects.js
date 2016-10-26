import update from 'react/lib/update';
import {
  ADD_PROJECT,
  SORT_PROJECT,
  CLASSIFY_PROJECT,
} from '../constants/ActionTypes';

const initialState = {
  toDo: [{
    id: 0,
    text: 'project1',
  }, {
    id: 1,
    text: 'project2',
  }, {
    id: 2,
    text: 'project3',
  }, {
    id: 3,
    text: 'project4',
  }],
  inProgress: [],
  done: [],
  idCounter: 3,
};

export default function projects(state = initialState, action) {
  switch (action.type) {
    case ADD_PROJECT:
      return update(state, {
        toDo: {
          $push: [{
            id: state.idCounter + 1,
            text: action.text,
          }],
        },
        idCounter: {
          $set: state.idCounter + 1,
        },
      });
    // Move project within project list
    case SORT_PROJECT:
      let dragProject = state[action.projectType][action.dragIndex];
      return update(state, {
        [action.projectType]: {
          $splice: [
            [action.dragIndex, 1],
            [action.hoverIndex, 0, dragProject],
          ],
        },
      });
    // Move project between different project lists
    case CLASSIFY_PROJECT:
      dragProject = state[action.sourceType][action.dragIndex];
      return update(state, {
        [action.sourceType]: {
          $splice: [
            [action.dragIndex, 1],
          ],
        },
        [action.targetType]: {
          $unshift: [dragProject],
        },
      });
    default:
      return state;
  }
}
