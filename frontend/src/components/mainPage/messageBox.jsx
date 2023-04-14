import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik  } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { actions as channelsActions, channelsSelectors } from '../../slices/channelsSlice.js';
import { actions as messagesActions, messagesSelectors } from '../../slices/messagesSlice.js';
import { useEffect, useRef } from 'react';
import { useApi } from '../../hooks/index.jsx';
import useAuth from '../../hooks/index.jsx';
import * as yup from 'yup';
import leoProfanity from 'leo-profanity';



const MessagesBox = () => {
  const { user } = useAuth();
  const socketApi = useApi();
  const username = user.username ?? null
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const filteredBody = leoProfanity.clean(values.body);
      const messageData = {
        body: filteredBody,
        channelId: currentChannel,
        username,
      };
      
      try {
        await socketApi.sendMessage(messageData);
        resetForm();
        inputEl.current.focus();
      } catch(err) {

      }
    setSubmitting(false);

    }
  });

  useEffect(() => {
    inputEl.current.focus();
  }, [currentChannel, messages]);

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView();
  }, [messages]);

  const isInvalid = !formik.dirty || !formik.isValid

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

        <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
            <Form.Group className="input-group has-validation">
              <Form.Control 
                ref={inputEl}
                name="body"
                placeholder={t('mainPage.placeholder')}
                value={formik.values.body}
                onChange={formik.handleChange}
                className="border-0 p-0 ps-2 form-control"
                disabled={formik.isSubmitting}
              />
              <Button variant="group-vertical" type="submit" disabled={isInvalid}>
                <ArrowRightSquare size={20} />
                <span className="visually-hidden">{t('mainPage.send')}</span>
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>

  );
};

export default MessagesBox;