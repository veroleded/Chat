import React from "react";
import axios from "axios";
import _ from 'lodash';
import { Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import useAuth from "../../hooks";
import routes from "../../routes";
import ChannelsBox from "./ChannelsBox.jsx";
import MessagesBox from "./messageBox.jsx";
import ModalAdd from "./modals/modalAd";
import ModalRemove from "./modals/modalRemove";
import ModalRename from "./modals/modalRename";
import { toast } from "react-toastify";
import { actions as channelsActions, channelsSelectors } from '../../slices/channelsSlice.js';
import { actions as messagesActions, messagesSelectors } from '../../slices/messagesSlice.js';
import { useTranslation } from "react-i18next";


const MainPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const [modalState, setModalState] = useState({ modalType: null, target: null });
  const channelsState = useSelector(channelsSelectors.selectAll);
  const messagesState = useSelector(messagesSelectors.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannelId);


  useEffect(() => {
    const headers = auth.getAuthHeader();
    const fatchData = async () => {

      try { 
        const response = await axios.get(routes.dataPath(), { headers });
        const { channels, messages, currentChannelId } = response.data;

        const normalizeChannelsData = channels
          .reduce((acc, channel) => ({ ...acc, [channel.id]: channel }), {});
        const normalizeMessagesData = messages
          .reduce((acc, message) => ({ ...acc, [message.id]: message }), {});
        dispatch(channelsActions.addChannels(normalizeChannelsData));
        dispatch(messagesActions.addMessages(normalizeMessagesData));
        dispatch(channelsActions.setCurrentChannelId(currentChannelId));
        setFetching(false);
      } catch (err) {
        if (!err.isAxiosError) {
          toast.error(t('errors.unknown'));
          return;
        }
        if (err.response?.status === 401) {
          navigate('login');
        } else {
          toast.error(t('errors.network'));
        }
      }
    };

    fatchData();

  }, []);

  const handleModal = (newModalState) => () => {
    setModalState(newModalState);
  };

  const handleCloseModal = () => {
    setModalState({modalType: null, target: null})
  };
  
  const getModal = () => {
    switch(modalState.modalType) {
      case 'add': 
        return <ModalAdd handleClose={handleCloseModal}/>
      
      case 'remove':
        return <ModalRemove handleClose={handleCloseModal} id={modalState.target} />
      
      case 'rename': 
        return <ModalRename handleClose={handleCloseModal} id={modalState.target} />
      default:
        return null;
    }
  }
  return  fetching
    ? (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" variant="dark">
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      </div>
    )
    : (
      <>
        {getModal()}
        <div className="row h-100 bg-white flex-md-row">
          <ChannelsBox handleModal={handleModal} />
          <MessagesBox />
        </div>  
      </>
    );
};

export default MainPage;