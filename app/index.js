import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import throttle from 'lodash/throttle';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { saveState } from './utils/localStorage';
import { InitialStateStruct } from './actions/types';
import './app.global.css';
import activity from './utils/backup/activity';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00148B',
      dark: '#000B4B',
      light: '#001FD8',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#35BA62',
      dark: '#2C9C52',
      light: '#3EDB73',
      contrastText: '#FFFFFF'
    }
  },
  typography: { useNextVariants: true }
});

const store = configureStore(InitialStateStruct);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
    activity();
  }, 1000)
);

render(
  <JssProvider>
    <AppContainer>
      <MuiThemeProvider theme={theme}>
        <Root store={store} history={history} />
      </MuiThemeProvider>
    </AppContainer>
  </JssProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <JssProvider>
        <AppContainer>
          <MuiThemeProvider theme={theme}>
            <NextRoot store={store} history={history} />
          </MuiThemeProvider>
        </AppContainer>
      </JssProvider>,
      document.getElementById('root')
    );
  });
}
