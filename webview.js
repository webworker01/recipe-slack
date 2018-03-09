// import { ipcRenderer } from 'electron';
// import path from 'path';
const path = require('path');

const getTeamIcon = function getTeamIcon(count = 0) {
  let countTeamIconCheck = count;
  let bgUrl = null;

  const teamMenu = document.querySelector('#team_menu');
  if (teamMenu) {
    teamMenu.click();

    const icon = document.querySelector('.team_icon');
    if (icon) {
      bgUrl = window.getComputedStyle(icon, null).getPropertyValue('background-image');
      bgUrl = /^url\((['"]?)(.*)\1\)$/.exec(bgUrl);
      bgUrl = bgUrl ? bgUrl[2] : '';
    }

    setTimeout(() => {
      document.querySelector('.team_menu').remove();
      document.querySelector('#msg_input .ql-editor').focus();
    }, 10);
  }

  countTeamIconCheck += 1;

  if (bgUrl) {
    ipcRenderer.sendToHost('avatar', bgUrl);
  } else if (countTeamIconCheck <= 5) {
    setTimeout(() => {
      getTeamIcon(countTeamIconCheck + 1);
    }, 2000);
  }
};

const SELECTOR_CHANNELS_UNREAD = '.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)';

module.exports = (Franz) => {
  const getMessages = () => {
    const directMessages = document.querySelectorAll(`${SELECTOR_CHANNELS_UNREAD} .p-channel_sidebar__badge`).length;
    const allMessages = document.querySelectorAll(SELECTOR_CHANNELS_UNREAD).length - directMessages;

    // set Franz badge
    Franz.setBadge(directMessages, allMessages);
  };
  Franz.loop(getMessages);

  setTimeout(() => {
    getTeamIcon();
  }, 4000);

  // inject franz.css stylesheet
  Franz.injectCSS(path.join(__dirname, 'service.css'));
};