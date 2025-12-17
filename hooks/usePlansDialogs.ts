'use client';

import { useReducer, useCallback } from 'react';

type Plan = {
  id: string;
  title: string;
  segments: Array<{ id: string; name: string }>;
};

type DialogsState = {
  groupDialog: {
    isOpen: boolean;
    name: string;
  };
  planDialog: {
    isOpen: boolean;
    title: string;
    selectedGroup: string;
  };
  editDialog: {
    isOpen: boolean;
    plan: Plan | null;
  };
  levelsDialog: {
    isOpen: boolean;
  };
  configDialog: {
    isOpen: boolean;
  };
};

type DialogAction =
  | { type: 'OPEN_GROUP_DIALOG' }
  | { type: 'CLOSE_GROUP_DIALOG' }
  | { type: 'SET_GROUP_NAME'; name: string }
  | { type: 'RESET_GROUP_DIALOG' }
  | { type: 'OPEN_PLAN_DIALOG' }
  | { type: 'CLOSE_PLAN_DIALOG' }
  | { type: 'SET_PLAN_TITLE'; title: string }
  | { type: 'SET_SELECTED_GROUP'; group: string }
  | { type: 'RESET_PLAN_DIALOG' }
  | { type: 'OPEN_EDIT_DIALOG'; plan: Plan }
  | { type: 'CLOSE_EDIT_DIALOG' }
  | { type: 'OPEN_LEVELS_DIALOG' }
  | { type: 'CLOSE_LEVELS_DIALOG' }
  | { type: 'OPEN_CONFIG_DIALOG' }
  | { type: 'CLOSE_CONFIG_DIALOG' };

const initialState: DialogsState = {
  groupDialog: {
    isOpen: false,
    name: '',
  },
  planDialog: {
    isOpen: false,
    title: '',
    selectedGroup: 'root',
  },
  editDialog: {
    isOpen: false,
    plan: null,
  },
  levelsDialog: {
    isOpen: false,
  },
  configDialog: {
    isOpen: false,
  },
};

function dialogsReducer(
  state: DialogsState,
  action: DialogAction
): DialogsState {
  switch (action.type) {
    case 'OPEN_GROUP_DIALOG':
      return {
        ...state,
        groupDialog: { ...state.groupDialog, isOpen: true },
      };
    case 'CLOSE_GROUP_DIALOG':
      return {
        ...state,
        groupDialog: { ...state.groupDialog, isOpen: false },
      };
    case 'SET_GROUP_NAME':
      return {
        ...state,
        groupDialog: { ...state.groupDialog, name: action.name },
      };
    case 'RESET_GROUP_DIALOG':
      return {
        ...state,
        groupDialog: { isOpen: false, name: '' },
      };
    case 'OPEN_PLAN_DIALOG':
      return {
        ...state,
        planDialog: { ...state.planDialog, isOpen: true },
      };
    case 'CLOSE_PLAN_DIALOG':
      return {
        ...state,
        planDialog: { ...state.planDialog, isOpen: false },
      };
    case 'SET_PLAN_TITLE':
      return {
        ...state,
        planDialog: { ...state.planDialog, title: action.title },
      };
    case 'SET_SELECTED_GROUP':
      return {
        ...state,
        planDialog: { ...state.planDialog, selectedGroup: action.group },
      };
    case 'RESET_PLAN_DIALOG':
      return {
        ...state,
        planDialog: { isOpen: false, title: '', selectedGroup: 'root' },
      };
    case 'OPEN_EDIT_DIALOG':
      return {
        ...state,
        editDialog: { isOpen: true, plan: action.plan },
      };
    case 'CLOSE_EDIT_DIALOG':
      return {
        ...state,
        editDialog: { isOpen: false, plan: null },
      };
    case 'OPEN_LEVELS_DIALOG':
      return {
        ...state,
        levelsDialog: { isOpen: true },
      };
    case 'CLOSE_LEVELS_DIALOG':
      return {
        ...state,
        levelsDialog: { isOpen: false },
      };
    case 'OPEN_CONFIG_DIALOG':
      return {
        ...state,
        configDialog: { isOpen: true },
      };
    case 'CLOSE_CONFIG_DIALOG':
      return {
        ...state,
        configDialog: { isOpen: false },
      };
    default:
      return state;
  }
}

export function usePlansDialogs() {
  const [state, dispatch] = useReducer(dialogsReducer, initialState);

  const groupDialog = {
    isOpen: state.groupDialog.isOpen,
    name: state.groupDialog.name,
    open: useCallback(() => dispatch({ type: 'OPEN_GROUP_DIALOG' }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE_GROUP_DIALOG' }), []),
    setName: useCallback(
      (name: string) => dispatch({ type: 'SET_GROUP_NAME', name }),
      []
    ),
    reset: useCallback(() => dispatch({ type: 'RESET_GROUP_DIALOG' }), []),
    setOpen: useCallback((open: boolean) => {
      dispatch({ type: open ? 'OPEN_GROUP_DIALOG' : 'CLOSE_GROUP_DIALOG' });
    }, []),
  };

  const planDialog = {
    isOpen: state.planDialog.isOpen,
    title: state.planDialog.title,
    selectedGroup: state.planDialog.selectedGroup,
    open: useCallback(() => dispatch({ type: 'OPEN_PLAN_DIALOG' }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE_PLAN_DIALOG' }), []),
    setTitle: useCallback(
      (title: string) => dispatch({ type: 'SET_PLAN_TITLE', title }),
      []
    ),
    setSelectedGroup: useCallback(
      (group: string) => dispatch({ type: 'SET_SELECTED_GROUP', group }),
      []
    ),
    reset: useCallback(() => dispatch({ type: 'RESET_PLAN_DIALOG' }), []),
    setOpen: useCallback((open: boolean) => {
      dispatch({ type: open ? 'OPEN_PLAN_DIALOG' : 'CLOSE_PLAN_DIALOG' });
    }, []),
  };

  const editDialog = {
    isOpen: state.editDialog.isOpen,
    plan: state.editDialog.plan,
    open: useCallback(
      (plan: Plan) => dispatch({ type: 'OPEN_EDIT_DIALOG', plan }),
      []
    ),
    close: useCallback(() => dispatch({ type: 'CLOSE_EDIT_DIALOG' }), []),
    setOpen: useCallback((open: boolean) => {
      dispatch({ type: open ? 'CLOSE_EDIT_DIALOG' : 'CLOSE_EDIT_DIALOG' });
    }, []),
  };

  const levelsDialog = {
    isOpen: state.levelsDialog.isOpen,
    open: useCallback(() => dispatch({ type: 'OPEN_LEVELS_DIALOG' }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE_LEVELS_DIALOG' }), []),
    setOpen: useCallback((open: boolean) => {
      dispatch({ type: open ? 'OPEN_LEVELS_DIALOG' : 'CLOSE_LEVELS_DIALOG' });
    }, []),
  };

  const configDialog = {
    isOpen: state.configDialog.isOpen,
    open: useCallback(() => dispatch({ type: 'OPEN_CONFIG_DIALOG' }), []),
    close: useCallback(() => dispatch({ type: 'CLOSE_CONFIG_DIALOG' }), []),
    setOpen: useCallback((open: boolean) => {
      dispatch({ type: open ? 'OPEN_CONFIG_DIALOG' : 'CLOSE_CONFIG_DIALOG' });
    }, []),
  };

  return {
    groupDialog,
    planDialog,
    editDialog,
    levelsDialog,
    configDialog,
  };
}
