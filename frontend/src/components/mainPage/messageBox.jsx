import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik  } from 'formik';
import { Form } from 'react-bootstrap';
import { actions as channelsActions, channelsSelectors } from '../../slices/channelsSlice.js';
import { actions as messagesActions, messagesSelectors } from '../../slices/messagesSlice.js';
import { useEffect, useRef } from 'react';
import socket from '../../initSocket.js';
import { useState } from 'react';
import { useApi } from '../../hooks/index.jsx';
import useAuth from '../../hooks/index.jsx';
import * as yup from 'yup';



const MessagesBox = () => {
  const { user } = useAuth();
  const socketApi = useApi();
  const username = user.username ?? null
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [messageState, setMessageState] = useState('g');
  const currentChannel = useSelector((state) => state.channels.currentChannelId);
  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  const curChannelName = channels.find(({ id }) => id === currentChannel).name;
  const inputEl = useRef(null);
  const lastMessageRef = useRef(null);

  // socket.on('newMessage', (payload,) => {
  //   dispatch(messagesActions.addMessage(payload));
  // })

  const validationSchema = yup.object().shape({
    body: yup
      .string()
      .trim()
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: (values, {resetForm}) => {
      const messageData = {
        body: values.body,
        channelId: currentChannel,
        username,
      };
      
      socketApi.sendMessage(messageData);
      resetForm();
      // socket.emit('newMessage', messageData, (response) => {
      //   if (response.status === 'ok') {
      //     resetForm();
      //   } else {
      //     setMessageState('notSent');
      //   }
      // });
    }
  });

  useEffect(() => {
    inputEl.current.focus();
  }, [currentChannel, messages]);

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView();
  }, [messages])

  return (
    <div className="col p-0 h-100 card">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className='fw-bold'>
            <span className="me-1">#</span>
            {curChannelName}
          </p>
          <span className="text-muted">
            {t('mainPage.message', {count: messages.filter((message) => message.channelId === currentChannel).length})}
          </span>
        </div>
        <div className="chat-messages overflow-auto px-5 ">
          {messages.map((message, index) => {
            if (message.channelId === currentChannel) {
              const ref = index === messages.length - 1 ? lastMessageRef : null; 
              return (
                <div className="text-break mb-2" ref={ref} key={message.id}>
                  <b>{message.username}</b>: {message.body}
                </div>
                );
              }
            })}
        </div>
        <div className="mt-auto px-5 py-3">

        <Form onSubmit={formik.handleSubmit} className="py-1 m-2 border rounded-2">
            <Form.Group className="input-group has-validation">
              <Form.Control 
                ref={inputEl}
                name="body"
                placeholder={t('mainPage.placeholder')}
                value={formik.values.body}
                onChange={formik.handleChange}
                className="border-0 p-0 ps-2 form-control"
                onFocus={() => setMessageState(null)}
                disabled={formik.isSubmitting}
              />
              <button type="submit" className="btn btn-group-vertical" >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path
                    fillRule="evenodd" 
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
                <span className="visually-hidden">{t('mainPage.send')}</span>
              </button>
            </Form.Group>
            {messageState && <p className='feedback m-1 position-absolute small text-danger'>{t('mainPage.messageNotSent')}</p>}
          </Form>
        </div>
      </div>
    </div>

  );
};

export default MessagesBox;