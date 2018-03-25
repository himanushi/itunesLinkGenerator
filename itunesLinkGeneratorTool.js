/**
 * https://himakan.net/tool/
 * MIT license
 */
;let itunesLinkGeneratorTool = {};
(function(h, app, d){

  'use strict';

  // Constant
  itunesLinkGeneratorTool.MediaTypeInfo = {
    SOFTWARE: 'software',
  };

  itunesLinkGeneratorTool.Itunes = {
    SEARCH_URL: 'https://itunes.apple.com/search',
    SEARCH_LIMIT: 30,
  };

  // Components
  const PreviewItem = () =>
    h('div', { class: itunesLinkGenerator.TARGET_CLASS_NAME, 'data-media-type': 'test' }, []);

  const ResultItem = ({result}) =>
    h('div', {}, [
      h('img', { src: result.artworkUrl100 }, '画像'),
      h('p',   {}, 'タイトル'),
      h('p',   {}, '作者'),
    ]);

  const ResultList = () =>
    h('div', {}, state.resultList.map(result => h(ResultItem, {result: result})));

  const TermInputBox = ({ label, termType }) => (
    h('div', {}, [
      h('p', {}, label + ':'),
      h('input', { oninput: e => itunesLinkGeneratorTool.app.inputTerm({ value: e.target.value, termType: termType }) }),
    ])
  );

  // Applications
  const state = {
    targetMedia: '',
    resultList: [],
    search_offset: 0,
    params: {
      term:      '',
      media:     'software',
      //entity:    'software',
      //attribute: 'title',
      country:   'jp',
      lang:      'ja_jp',
      offset:    0,
      limit:     itunesLinkGeneratorTool.Itunes.SEARCH_LIMIT,
    }
  };

  const actions = {
    getState: () => state,
    inputTerm: ({ value, termType }) => state => (state.params.term = value),
    search: () => state => {
      $.getJSON(
        itunesLinkGeneratorTool.Itunes.SEARCH_URL,
        state.params,
        (data, status) => {
          $.each(data.results, (key, result) => {
            state.resultList.push(result);
          });
        }
      );
      return state.resultList;
    },
  };

  const view = (state, actions) =>
    h('div', {}, [
      h(TermInputBox, { label: 'タイトル',  termType: 'title' }),
      h('button', { onclick: () => actions.search() }, '検索'),
      h(ResultList, {}),
    ]);

  itunesLinkGeneratorTool.app = app(state, actions, view, d.getElementById('app'));

})(hyperapp.h, hyperapp.app, document);
