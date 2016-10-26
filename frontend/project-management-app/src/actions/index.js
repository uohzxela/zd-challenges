import * as types from '../constants/ActionTypes';

export const addProject = text => ({
  type: types.ADD_PROJECT,
  text,
});
export const sortProject = ({ dragIndex, hoverIndex, projectType }) => ({
  type: types.SORT_PROJECT,
  dragIndex,
  hoverIndex,
  projectType,
});
export const classifyProject = ({ src, dest, dragIndex }) => ({
  type: types.CLASSIFY_PROJECT,
  src,
  dest,
  dragIndex,
});
