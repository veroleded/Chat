import { Dropdown, ButtonGroup} from "react-bootstrap";
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions, channelsSelectors } from '../../slices/channelsSlice.js';
import { actions as messagesActions, messagesSelectors } from '../../slices/messagesSlice.js';
import socket from "../../initSocket.js";


const ChannelsBox = ({ handleModal }) => {
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelectors.selectAll);
  const messagesState = useSelector(messagesSelectors.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannelId);
  const generalChannelId = useSelector((state) => state.channels.ids[0]);
  const { t } = useTranslation(); 
  
  socket.on('newChannel', (payload) => {
    dispatch(channelsActions.addChannel(payload));
    dispatch(channelsActions.setCurrentChannelId(payload.id));
  })

  socket.on('removeChannel', (payload) => {
    dispatch(channelsActions.removeChannel(payload.id));
    if (currentChannel === payload.id) {
      dispatch(channelsActions.setCurrentChannelId(generalChannelId));
    }
  });

  socket.on('renameChannel', (payload) => {
    dispatch(channelsActions.renameChannel(payload))
  })

  const handleChannelClick = (id) => () => {
    dispatch(channelsActions.setCurrentChannelId(id));
  };

  const Channels = channels.map((channel) => (
    <li className="nav-item w-100" key={channel.id}>
      <Dropdown as={ButtonGroup} className="d-flex show dropdown btn-group">
        <button
          type="button"
          className="w-100
          rounded-0 text-start text-truncate btn"
          onClick={handleChannelClick(channel.id)}
        >
          <span className="me-1">#</span>
          {channel.id === currentChannel ? <u>{channel.name}</u> : channel.name}
        </button>
        {channel.removable
          ? <>
            <Dropdown.Toggle variant id="dropdownChannel"  className="overflow-auto"/>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={handleModal({ modalType: 'rename', target: channel.id })}
              >
                {t('mainPage.rename')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleModal({ modalType: 'remove', target: channel.id })}
              >
                {t('mainPage.remove')}
              </Dropdown.Item>
            </Dropdown.Menu>
            </>
            : null          
        }
      </Dropdown>
    </li>
  ));
  
  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column  d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('mainPage.channels')}</b>
        <button 
          type="p-0 text-primary btn btn-group-vertical"
          onClick={handleModal({ modalType: 'add', target: null })}
          className="p-0 text-dark btn btn-group-vertical"
        >
        <svg xmlns="../../assets/plus-square.svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        </button>
      </div>

      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {Channels}
      </ul>
    </div>

  );
};

export default ChannelsBox;