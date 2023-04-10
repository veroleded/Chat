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
    const token = localStorage.getItem('userId');

    if (!token && !auth.loggedIn) {
      navigate('login');

    } else  {
    const foo = async () => {
      const headers = { Authorization: `Bearer ${token}` };

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
          console.error(err);
        }
      };

      foo();
    }

  }, []);

  const handleAddChannel = () => {
    setModalState({ modalType: 'add', target: null })
  };

  const handleCloseModal = () => {
    setModalState({modalType: null, target: null})
  };
  
  const getModal = () => {
    switch(modalState.modalType) {
      case 'add': 
        return <ModalAdd handleClose={handleCloseModal}/>

      default:
        return null;
    }
  }
  return (
      <div className="row h-100 bg-white flex-md-row">
        {getModal()}
        {currentChannel && <ChannelsBox addChannel={handleAddChannel}/>}
        {currentChannel && <MessagesBox channels={channelsState} currentChannel={currentChannel}/>}
      </div>  
  );
};

export default MainPage;