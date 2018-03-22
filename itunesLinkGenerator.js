/**
 * https://himakan.net/tool/
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
      tag       : 'div',
      className :  'itunesLinkGenerator-software-div',
      children  : [
        {
          tag       : 'img',
          src       : 'artworkUrl100',
          className : 'itunesLinkGenerator-software-img',
        },
        {
          tag       : 'a',
          innerText : 'trackName',
          className : 'itunesLinkGenerator-software-name',
        },
        {
          tag       : 'p',
          innerText : 'artistName',
          className : 'itunesLinkGenerator-software-developer',
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
      var innerText   = itunesElement.innerText;

      element.className = itunesElement.className;

      if (itunesElement.tag === 'img') {
        element.src = result[itunesElement.src];

      } else if (itunesElement.tag === 'a') {
        element.href      = generateUrl(result.trackViewUrl);
        element.innerText = result[innerText];

      } else if (itunesElement.tag === 'p') {
        element.innerText = result[innerText];

      } else if (itunesElement.tag === 'div') {
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
