import debounce from 'lodash/debounce';

const activity = debounce(
  () => {
    const activityEvent = new Event('activity');
    window.dispatchEvent(activityEvent);
  },
  1000,
  { leading: false, trailing: true, maxWait: 4000 }
);

export default activity;
