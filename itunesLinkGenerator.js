/**
 * https://himakan.net/tool/itunes-link-generator
 * MIT license
 */
;var itunesLinkGenerator = {};
(function(d) {

  'use strict';

  itunesLinkGenerator.TARGET_CLASS_NAME  = 'itunes-link-generator';
  var itunesLookUpUrl   = 'http://itunes.apple.com/lookup?id=';
  var countryCodeUrl    = '&country=';
  var affiliateTokenUrl = '&at=';
  var countryCodeParam  = 'jp';
  var itunesKinds       = {
    software: [{
      nodeName       : 'div',
      className :  'software-div',
      children  : [
        {
          nodeName  : 'img',
          src       : 'artworkUrl100',
          className : 'software-img',
        },
        {
          nodeName  : 'a',
          innerText : 'trackName',
          className : 'software-name',
        },
        {
          nodeName  : 'p',
          innerText : 'artistName',
          className : 'software-developer',
        }
      ]
    }]
  };

  itunesLinkGenerator.setViews = function() {
    var targetAppElements = d.getElementsByClassName(itunesLinkGenerator.TARGET_CLASS_NAME);

    for(var i = 0; i < targetAppElements.length; i++) {
      setView(targetAppElements[i]);
    }
  };

  function setView(targetAppElement) {
    var trackid         = targetAppElement.dataset.trackId;
    var includeParamUrl = itunesLookUpUrl + trackid + countryCodeUrl + countryCodeParam;

    getJSON(includeParamUrl, function(data) {
      if (data.resultCount) {
        var result = data.results[0];
        appendChildren(result, targetAppElement);
      }
    });
  }

  function appendChildren(result, targetAppElement) {
    var itunesElements = itunesKinds[targetAppElement.dataset.mediaType];
    return recursiveAppendChild(result, itunesElements, targetAppElement);
  }

  function recursiveAppendChild(result, itunesElements, viewElement) {
    for(var i = 0; i < itunesElements.length; i++) {
      var itunesElement = itunesElements[i];
      var element = d.createElement(itunesElement.tag);

      element.className = itunesElement.className;

      if (itunesElement.nodeName === 'img') {
        element.src = result[itunesElement.src];

      } else if (itunesElement.nodeName === 'a') {
        element.href      = generateUrl(result.trackViewUrl);
        element.innerText = result[itunesElement.innerText];

      } else if (itunesElement.nodeName === 'p') {
        element.innerText = result[itunesElement.innerText];

      } else if (itunesElement.nodeName === 'div') {
        recursiveAppendChild(result, itunesElement.children, element);
      }

      viewElement.appendChild(element);
    }

    return element;
  }

  function generateUrl(trackViewUrl) {
    var token = d.getElementById('itunesLinkGenerator').dataset.token;

    if (token) {
      return trackViewUrl + affiliateTokenUrl + token;
    } else {
      return trackViewUrl;
    }
  }

  function getJSON(path, successFunction) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {

        if (xhr.status === 200) {
          successFunction(JSON.parse(xhr.responseText));
        }

      }
    };

    xhr.open('GET', path, true);
    xhr.send();
  }

  itunesLinkGenerator.setViews();
})(document);
