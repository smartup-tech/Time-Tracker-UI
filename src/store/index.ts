import { createPinia, Store } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export * from './auth';
export * from './approval';
export * from './notifications';
export * from './positions';
export * from './projects';
export * from './reports';
export * from './tasks';
export * from './time-freeze';
export * from './timesheet';
export * from './users';
export * from './calendar';

const store = createPinia();

const stores: Store[] = [];

store.use(piniaPluginPersistedstate);

store.use(({ store }) => {
  stores.push(store);
});

export const resetAllStores = () => stores.forEach((store) => store.$reset());

export default store;
