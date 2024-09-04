import { Ref, ref } from 'vue';

type Actions = {
  set: (value: boolean) => void;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};

export const useBoolean = (initialValue = false): [Ref<boolean>, Actions] => {
  const state = ref<boolean>(initialValue);

  const set = (value: boolean) => (state.value = value);

  const setTrue = () => (state.value = true);

  const setFalse = () => (state.value = false);

  const toggle = () => (state.value = !state.value);

  const actions: Actions = {
    set,
    toggle,
    setTrue,
    setFalse,
  };

  return [state, actions];
};
