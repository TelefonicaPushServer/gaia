
'use strict';

var logArea = null;
function debug(msg) {
  if(logArea) {
    logArea.innerHTML += msg + '<br />';
  }
  console.log("[Push Setup] " + msg);
}

var Push = {
  init: function() {
    debug("init");
    this.recoverParameters();
  },

  recoverParameters: function() {
    debug("recoverParameters");
    var param = 'network.push-notification.notification-server';
    var reqPushData = window.navigator.mozSettings.createLock().get(param);
    reqPushData.onsuccess = function push_getPushData() {
      var cmd = reqPushData.result[param];
      debug(JSON.stringify(cmd));
      if (cmd) {
        document.getElementById('currentConfig').innerHTML = cmd;
        document.getElementById('pushIP').value = cmd;
      }
    }  
  },

  setParameters: function() {
    console.log("setParameters");
    var reqPushData = window.navigator.mozSettings.createLock().set({
      'network.push-notification.notification-server': "ws://push.redirectme.net:8080"
    });
    reqPushData.onsuccess = function push_setPushData() {
      // Nothing todo
    }
    var reqPushTokenData = window.navigator.mozSettings.createLock().set({
      'network.push-notification.user-agent-token-serve': "http://push.redirectme.net:8080/token"
    });
    reqPushTokenData.onsuccess = function push_setPushTokenData() {
      // Nothing todo
    }
  }
};

window.addEventListener('load', function pushOnLoad(evt) {
  window.removeEventListener('load', pushOnLoad);
  logArea = document.getElementById('logArea');
  Push.init();
});
