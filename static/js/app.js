// bind button
$('#btn_run').click(() => {
  $('#ta_text').attr('disabled', true);
  $('#btn_run').attr('disabled', true);

  $('.table.category tbody').html('');
  $('.table.entity tbody').html('');

  let text = $('#ta_text').val();
  $.ajax({
    url: '/nlp_rock',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      text: text,
    }),
    success: (resp) => {
      console.log(resp);

      // caterories
      for(c in resp.classes){
        $('.table.category tbody').append(`
          <tr>
            <td>${c}</td>
            <td>${(resp.classes[c]*100).toFixed(2)}%</td>
          </tr>
        `);
      }

      // entities
      resp.entities.forEach((en) => {
        $('.table.entity tbody').append(`
          <tr>
            <td>${en.name}</td>
            <td>${en.type}</td>
          </tr>
        `);
      });

      $('#ta_text').attr('disabled', false);
      $('#btn_run').attr('disabled', false);
    }
  });
});
