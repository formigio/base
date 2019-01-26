import debounce from 'lodash/debounce';

const sync = debounce(
  () => {
    const syncEvent = new Event('sync');
    window.dispatchEvent(syncEvent);
  },
  5000,
  { leading: false, trailing: true, maxWait: 10000 }
);

export default sync;
