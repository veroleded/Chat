import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions, channelsSelectors } from '../../slices/channelsSlice.js';

const ChannelsBox = ({ handleModal }) => {
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannelId);
  const { t } = useTranslation();

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
          {channel.id === currentChannel ? <b>{channel.name}</b> : channel.name}
        </button>
        {channel.removable ? (
          <>
            <Dropdown.Toggle variant id="dropdownChannel" className="overflow-auto">
              <span className="visually-hidden">{t('channels.menu')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleModal({ modalType: 'rename', target: channel.id })}>
                {t('mainPage.rename')}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleModal({ modalType: 'remove', target: channel.id })}>
                {t('mainPage.remove')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </>
        ) : null}
      </Dropdown>
    </li>
  ));

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column  d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('mainPage.channels')}</b>
        <Button
          type="button"
          variant="group-vertical"
          className="p-0 text-dark"
          onClick={handleModal({ modalType: 'add', target: null })}
        >
          <PlusSquare size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {Channels}
      </ul>
    </div>
  );
};

export default ChannelsBox;
