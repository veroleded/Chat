import React from "react";
import axios from "axios";
import _ from 'lodash';
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

import { actions as channelsActions, channelsSelectors } from '../../slices/channelsSlice.js';
import { actions as messagesActions, messagesSelectors } from '../../slices/messagesSlice.js';


const MainPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const channelsState = useSelector(channelsSelectors.selectAll);
  const messagesState = useSelector(messagesSelectors.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannelId);
  const [modalState, setModalState] = useState({ modalType: null, target: null });

  useEffect(() => {
    const headers = auth.getAuthHeader();
    const foo = async () => {

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
      } catch(err) {
        if (err.response?.status == 401) {
          navigate('login');
        }
      }
    };

    foo();

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
  return (
      <div className="row h-100 bg-white flex-md-row">
        {getModal()}
        {currentChannel && <ChannelsBox handleModal={handleModal} />}
        {currentChannel && <MessagesBox />}
      </div>  
  );
};

export default MainPage;