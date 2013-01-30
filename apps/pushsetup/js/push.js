'use strict';

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

  apps: {},

  init: function() {
    document.getElementById("apps-button").addEventListener('click', this.slideY);
    document.getElementById("close-edit").addEventListener('click', this.slideY);

    document.getElementById("settings-button").addEventListener('click', this.showSettings.bind(this));
    document.getElementById("cancel-settings").addEventListener('click', this.slideX);
    document.getElementById('save-settings').addEventListener('click', this.setParameters.bind(this));

    this.remoteHost = document.getElementById('remoteHost');
    this.remotePort = document.getElementById('remotePort');
    this.ssl = document.getElementById('ssl');
    this.localPort = document.getElementById('localPort');

    this.remoteHostEdit = document.getElementById('remoteHostIn');
    this.remotePortEdit = document.getElementById('remotePortIn');
    this.sslEdit = document.getElementById('sslIn');
    this.localPortEdit = document.getElementById('localPortIn');

    this.initAppsData();
    this.recoverParameters();
  },

  slideX: function slideX() {
    var mainWrapper = document.getElementById('main-wrapper');
    var mainWrapperClass= 'wrapper';
    if (!mainWrapper.classList.contains('to-left')) {
      mainWrapper.className = mainWrapperClass;
      mainWrapper.classList.add('to-left');
    } else {
      mainWrapper.className = mainWrapperClass;
      mainWrapper.classList.add('to-right');
    }
  },

  slideY: function slideY() {
    var mainWrapper = document.getElementById('main-wrapper');
    var mainWrapperClass= 'wrapper';
    if (!mainWrapper.classList.contains('to-up')) {
      mainWrapper.className = mainWrapperClass;
      mainWrapper.classList.add('to-up');
    } else {
      mainWrapper.className = mainWrapperClass;
      mainWrapper.classList.add('to-down');
    }
  },

  recoverParameters: function() {
    var settings = navigator.mozPush.getSetup();
    this.remoteHost.innerHTML = settings.host;
    this.remotePort.innerHTML = settings.port;
    this.ssl.innerHTML = settings.ssl ? "Enabled" : "Disabled";
    this.localPort.innerHTML = settings.udpPort;
  },

  showSettings: function() {
    this.remoteHostEdit.placeholder = this.remoteHost.innerHTML;
    this.remotePortEdit.placeholder = this.remotePort.innerHTML;
    this.sslEdit.checked = (this.ssl.innerHTML == "Enabled");
    this.localPortEdit.placeholder = this.localPort.innerHTML;

    this.slideX();
  },

  setParameters: function() {
    var settings = {host: this.remoteHostEdit.value,
                    port: this.remotePortEdit.value,
                    ssl: this.sslEdit.checked,
                    udpPort: this.localPortEdit.value};

    navigator.mozPush.setup(settings);

    this.recoverParameters();
    this.slideX();
  },

  initAppsData: function initAppsData() {
    navigator.mozApps.mgmt.getAll().onsuccess = function onsuccess(event) {
      var result = event.target.result;
      result.forEach(function eachApp(app) {
        var manifest = app.manifest;
        this.apps[app.manifestURL] = { name: manifest.name,
                                       icon: this.iconURLMinSize(app, manifest)};
      }.bind(this));

      this.generateAppsView();
    }.bind(this);
  },

  generateAppsView: function generateAppsView() {
    var req = navigator.mozPush.getRegisteredApps();

    req.onsuccess = function(e) {
      debug("Push response: " + JSON.stringify(req.result));

      var listView = document.getElementById("list-view");
      req.result.forEach(function(app) {
        var data = this.apps[app.manifestURL];

        var appContainer = document.createElement('li');
        appContainer.id = app.manifestURL;

        var aside = document.createElement('aside');
        aside.className = 'icon appIcon';
        aside.style.backgroundImage = 'url(' + data.icon + ')';
        aside.style.backgroundSize = 'contain';

        var inputContainer = document.createElement('aside');
        inputContainer.className = 'pack-end';

        var input = document.createElement('button');
        input.className = "icon icon-dialog unregisterButton";
        input.innerHTML = 'Unregister';
        input.onclick = function() {
          // navigator.mozPush.revokeRemotePermission();
          alert("Not implemented");
        };
        inputContainer.appendChild(input);

        var name = document.createElement('p');
        name.innerHTML += data.name;

        appContainer.appendChild(inputContainer);
        appContainer.appendChild(aside);
        appContainer.appendChild(name);
        listView.appendChild(appContainer);

      }, this);
    }.bind(this);
  },

  iconURLMinSize: function iconURLMinSize(app, manifest) {
    var icons = manifest.icons;
    if (!icons) {
      return this.getDefaultIcon(app);
    }

    var preferredSize = Number.MAX_VALUE;
    for (var size in icons) {
      size = parseInt(size, 10);
      if (size < preferredSize)
        preferredSize = size;
    }

    var url = icons[preferredSize];
    if (!url) {
      return this.getDefaultIcon(app);
    }
    // If the icon path is not an absolute URL, prepend the app's origin.
    if (url.indexOf('data:') == 0 ||
        url.indexOf('app://') == 0 ||
        url.indexOf('http://') == 0 ||
        url.indexOf('https://') == 0)
      return url;

    if (url.charAt(0) != '/') {
      return this.getDefaultIcon(app);
    }

    if (app.origin.slice(-1) == '/')
      return app.origin.slice(0, -1) + url;

    return app.origin + url;
  },

  getDefaultIcon: function() {
    return window.location.protocol + '//' + window.location.host + '/style/img/default.png';
  }
};

window.addEventListener('load', function pushOnLoad(evt) {
  window.removeEventListener('load', pushOnLoad);
  Push.init();
});
