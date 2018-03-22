/**
 * https://himakan.net/tool/
 * MIT license
 */
const algb = {};
( function() {

  'use strict';

  var
    searchUrl              = 'https://itunes.apple.com/search',
    limit                  = 30,
    offset                 = 0,
    results_ele            = $( '#results' ),
    affiliate_param        = '&at=',
    attributeAppName       = 'softwareTerm',
    attributeDeveloperName = 'softwareDeveloper',
    params = {
      term:      '',
      media:     'software',
      entity:    'software',
      attribute: '',
      country:   'jp',
      lang:      'ja_jp',
      offset:    offset,
      limit:     limit
    };

  algb.result_list = [];
  algb.attribute = '';

  function searchApps() {
    $.getJSON(
      searchUrl,
      params,
      function( data, status ) {

        $.each( data.results, function( key, result ) {
          results_ele.append( build_result( result ) );
          algb.result_list.push( result );
        });

        set_params_offset( offset + limit );
      }
    )
  }

  function set_params_attribute( attribute ) {
    params.attribute = algb.attribute = attribute
  }

  function set_params_offset( value ) {
    params.offset = offset = value
  }

  function reset_result() {
    clear_result_list();
    set_params_term( '' );
    reset_params_offset();
    remove_results();
  }

  function clear_result_list() {
    algb.result_list = [];
  }

  function set_params_term( value ) {
    params.term = value
  }

  function reset_params_offset() {
    params.offset = offset = 0
  }

  function remove_results() {
    results_ele.children().remove();
  }

  function build_result( result ) {
    return $( '<div>', {
      'data-app-no': algb.result_list.length
    }).append(
      $( '<img>', {
        src: result.artworkUrl100
      })
    ).append(
      $( '<p>', {
        text: 'アプリ名:' + result.trackName
      })
    ).append(
      $( '<p>', {
        text: '開発者名:' + result.artistName
      })
    ).append(
      $( '<p>', {
        text: '価格:' + result.formattedPrice
      })
    ).append(
      $( '<p>', {
        text: '説明:' + result.description.slice(0, 100) + '...'
      })
    ).click( function( event ) {
      set_generator( event.currentTarget );
    })
  }

  function set_generator( div_ele ) {
    var
      generator = $( '#generator' ),
      preview = $( '#preview' ),
      result = algb.result_list[ div_ele.dataset.appNo ], // data-app-no
      sample = html_generator( result );

    generator.children().remove();
    generator
      .append(
        $( '<textarea>', {
          id: 'generator_text',
          text: sample.prop('outerHTML').replace(/&amp;/g,'&')
        })
      );

    preview.children().remove();
    preview.append( sample );

    itunesLinkGenerator.setViews();

    $( '#copy' ).css( 'display', 'inline' ).text( 'コピー' );
  }

  function html_generator( result ) {
    return $( '<div>', {
      class: itunesLinkGenerator.TARGET_CLASS_NAME,
      'data-track-id': result.trackId,
      'data-media-type': 'software'
    })
  }

  function src_generator( url ) {
    var
      token = get_affiliate_token();

    $.cookie( 'affiliate_token', token );
    if ( '' === token ) {
      return url
    } else {
      return url + affiliate_param + token
    }
  }

  function get_affiliate_token() {
    var
      token = $( '#affiliate_token' ).val();
    $.cookie( 'affiliate_token', token );
    return token
  }

  $( '#app_name' ).keypress( function( e ) {
    if ( e.which === 13 ) {
      search( attributeAppName, e.target.value );
      return false;
    }
  });

  $( '#developer_name' ).keypress( function( e ) {
    if ( e.which === 13 ) {
      search( attributeDeveloperName, e.target.value );
      return false;
    }
  });

  function search( attribute, team ) {
    reset_result();
    set_params_attribute( attribute );
    set_params_term( team );
    $( '#more' ).css( 'display', 'inline' );
    searchApps();
  }

  $( '#more' ).click( function() {
    set_params_attribute( algb.attribute );
    searchApps();
  });

  $( '#copy' ).click( function() {
    $( '#generator_text' ).select();
    document.execCommand( 'copy' );
    $( '#copy' ).text( 'コピーしました！' );
  });

  $( '#affiliate_token' ).val( $.cookie( 'affiliate_token' ) );
})();
