import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import {Provider as RollbarProvider, ErrorBoundary} from '@rollbar/react';
import App from './components/App';
import leoProfanity from 'leo-profanity';

import resources from './locales/index.js';

import store from './slices/index.js';
import { ApiContext } from './contexts';
import { actions as channelsActions, channelsSelectors } from './slices/channelsSlice.js';
import { actions as messagesActions, messagesSelectors } from './slices/messagesSlice.js';

const init = async (socket) => {

  const ru = leoProfanity.getDictionary('ru');
  leoProfanity.add(ru);

  const withAcknowledgement = (socketFunc) => (...args) => new Promise((resolve, reject) => {
    let state = 'pending'; // eslint-disable-line
    const timer = setTimeout(() => {
      state = 'rejected';
      reject();
    }, 3000);

    socketFunc(...args, (response) => {
      if (state !== 'pending') return;

      clearTimeout(timer);

      if (response.status === 'ok') {
        state = 'resolved';
        resolve(response.data);
      }

      reject();
    });
  });

  const api = {
    sendMessage: withAcknowledgement((...args) => socket.volatile.emit('newMessage', ...args)),
    createChannel: withAcknowledgement((...args) => socket.volatile.emit('newChannel', ...args)),
    renameChannel: withAcknowledgement((...args) => socket.volatile.emit('renameChannel', ...args)),
    removeChannel: withAcknowledgement((...args) => socket.volatile.emit('removeChannel', ...args)),
  };

  socket.on('newMessage', (payload,) => {
    store.dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
    store.dispatch(channelsActions.setCurrentChannelId(payload.id));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(channelsActions.removeChannel(payload.id));
    const currentChannel = store.getState().channels.currentChannelId;
    const generalChannelId = store.getState().channels.ids[0];
    if (currentChannel === payload.id) {
      store.dispatch(channelsActions.setCurrentChannelId(generalChannelId));
    }
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(channelsActions.
      renameChannel({ id: payload.id, changes: { name: payload.name } }));
  });


  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "ru",
    });

  const isProduction = process.env.NODE_ENV === 'production';
  
  const rollbarConfig = {
    enabled: isProduction,
    accessToken: '466d65549a794b0d9068c8b35610aebd',
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store} >
          <I18nextProvider i18n={i18n}>
            <ApiContext.Provider value={api}>
              <App />
            </ApiContext.Provider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;