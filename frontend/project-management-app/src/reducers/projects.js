import {
    ADD_PROJECT,
    SORT_PROJECT,
    CLASSIFY_PROJECT
} from '../constants/ActionTypes';
import update from 'react/lib/update';

const initialState = {
    toDo: [
            {id: 0, text: 'project1'}, 
            {id: 1, text: 'project2'}, 
            {id: 2, text: 'project3'},
            {id: 3, text: 'project4'}
          ],
    inProgress: [],
    done: [],
    idCounter: 3
}

export default function projects(state = initialState, action) {
    switch (action.type) {
        case ADD_PROJECT:
            return update(state, {
                toDo: {
                    $push: [{
                        id: state.idCounter + 1,
                        text: action.text
                    }]
                },
                idCounter: {
                    $set: state.idCounter + 1
                }
            })
        case SORT_PROJECT:
            let dragProject = state[action.projectType][action.dragIndex];
            return update(state, {
                [action.projectType]: {
                    $splice: [
                        [action.dragIndex, 1],
                        [action.hoverIndex, 0, dragProject]
                    ]
                }
            });
        case CLASSIFY_PROJECT:
            dragProject = state[action.src][action.dragIndex];
            return update(state, {
                [action.src]: {
                    $splice: [
                        [action.dragIndex, 1]
                    ]
                },
                [action.dest]: {
                    $unshift: [dragProject]
                }
            });
        default:
            return state
    }
}