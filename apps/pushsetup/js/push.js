
'use strict';

/*var remoteHost = null;
var remotePort = null;
var ssl = null;
var localPort = null;

var remoteHostEdit = null;
var remotePortEdit = null;
var sslEdit = null;
var localPortEdit = null;*/

function debug(msg) {
  console.log("[Push Setup] " + msg);
}

function showMessage(msg) {
  logArea.innerHTML = msg;
}

var Push = {

  remoteHost: null,
  remotePort: null,
  ssl: null,
  localPort: null,

  remoteHostEdit: null,
  remotePortEdit: null,
  sslEdit: null,
  localPortEdit: null,

  init: function() {
    document.getElementById("settings-button").addEventListener('click', this.editSettings.bind(this));
    document.getElementById("cancel-settings").addEventListener('click', this.slide);
    document.getElementById('save-settings').addEventListener('click', this.setParameters.bind(this));

    this.remoteHost = document.getElementById('remoteHost');
    this.remotePort = document.getElementById('remotePort');
    this.ssl = document.getElementById('ssl');
    this.localPort = document.getElementById('localPort');

    this.remoteHostEdit = document.getElementById('remoteHostIn');
    this.remotePortEdit = document.getElementById('remotePortIn');
    this.sslEdit = document.getElementById('sslIn');
    this.localPortEdit = document.getElementById('localPortIn');

    this.recoverParameters();
  },

  recoverParameters: function() {
    var settings = navigator.mozPush.getSetup();
    this.remoteHost.innerHTML = settings.host;
    this.remotePort.innerHTML = settings.port;
    this.ssl.innerHTML = settings.ssl ? "Enabled" : "Disabled";
    this.localPort.innerHTML = settings.udpPort;
  },

  editSettings: function() {
    this.remoteHostEdit.placeholder = this.remoteHost.innerHTML;
    this.remotePortEdit.placeholder = this.remotePort.innerHTML;
    this.sslEdit.checked = (this.ssl.innerHTML == "Enabled");
    this.localPortEdit.placeholder = this.localPort.innerHTML;

    this.slide();
  },

  setParameters: function() {
    var settings = {host: this.remoteHostEdit.value,
                    port: this.remotePortEdit.value,
                    ssl: this.sslEdit.checked,
                    udpPort: this.localPortEdit.value};

    navigator.mozPush.setup(settings);

    this.recoverParameters();
    this.slide();
  },

  slide: function slide() {
    var mainWrapper = document.getElementById('main-wrapper');
    if (!mainWrapper.classList.contains('to-left')) {
      mainWrapper.classList.remove('to-right');
      mainWrapper.classList.add('to-left');
    } else {
      mainWrapper.classList.remove('to-left');
      mainWrapper.classList.add('to-right');
    }
    mainWrapper.addEventListener('animationend', function slideTransition() {
      mainWrapper.removeEventListener('animationend', slideTransition);
      mainWrapper.classList.toggle('to-left-fixed');
    });
  },
};

window.addEventListener('load', function pushOnLoad(evt) {
  window.removeEventListener('load', pushOnLoad);
  Push.init();
});
