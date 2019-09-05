/* https://github.com/googleapis/google-cloud-python/blob/master/language/google/cloud/language_v1/gapic/enums.py */
let _type_colors = {
  UNKNOWN:        '#cb91ec',
  PERSON:         '#e2cc8c',
  LOCATION:       '#be9058',
  ORGANIZATION:   '#eff066',
  EVENT:          '#8ede83',
  WORK_OF_ART:    '#bed4e4',
  CONSUMER_GOOD:  '#b5e076',
  OTHER:          '#FAE8F0',
  PHONE_NUMBER:   '#f69dc5',
  ADDRESS:        '#a986e6',
  DATE:           '#ddc75d',
  NUMBER:         '#f9a951',
  PRICE:          '#e0ab8a',
};

function hilight_entities(dom, entities){
  let html = $(dom).html();

  // mark hilight by btoa
  entities.forEach((en, i) => {
    html = html.replace(RegExp(en.name, 'g'), `___${btoa(i)}___`);
  });

  // update text
  entities.forEach((en, i) => {
    html = html.replace(RegExp(`___${btoa(i)}___`, 'g'),
            `<span style='background-color: ${_type_colors[en.type]};'>${en.name}</span>`);
  });

  // render
  $(dom).html(html);
}
