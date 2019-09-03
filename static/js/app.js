function on_success(text, resp){
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

  // remove duplicate entity name
  let entities2 = [];
  let unique_keys = [];
  resp.entities.forEach((en) => {
    if(unique_keys.includes(en.name)){ return; }
    unique_keys.push(en.name);
    entities2.push(en);
  });

  // entities
  entities2.forEach((en) => {
    $('.table.entity tbody').append(`
      <tr bgcolor='${_type_colors[en.type]}'>
        <td>${en.name}</td>
        <td>${en.type}</td>
      </tr>
    `);
  });

  // hilight paragraph
  $('p.lead').html(text);
  hilight_entities($('p.lead')[0], entities2);

  $('#ta_text').attr('disabled', false);
  $('#btn_run').attr('disabled', false);
}

// bind button
$('#btn_run').click(() => {
  $('#ta_text').attr('disabled', true);
  $('#btn_run').attr('disabled', true);

  $('p.lead').html('');
  $('.table.category tbody').html('');
  $('.table.entity tbody').html('');

  let text = $('#ta_text').val();

  $.ajax({
    url: '/nlp_rock',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({ text: text }),
    success: function(resp){
      on_success(text, resp);
    },
  });
});

// set default text
let text = "สุดยอดมือถือเรือธงสเปคจัดเต็มอย่าง OnePlus 7 Pro ที่เข้ามาวางจำหน่ายในบ้านเราเมื่อช่วงปลายเดือนพฤษภาคมที่ผ่านมา นับว่าได้รับความนิยมจากเหล่าแฟนๆ OnePlus ในบ้านเราอยู่ไม่น้อย ไม่ว่าจะเป็นสเปคสุดแรง, หน้าจอ 90Hz สุดงาม, หน่วยความจำแบบ UFS 3.0, กล้องระดับท็อป ฯลฯ ซึ่งล่าสุดได้มีการปรับราคาของ OnePlus 7 Pro ลงอีกรุ่นละ 2,000 บาท ให้หลายๆ คนได้ตัดสินใจถอยมาเป็นเจ้าของกันง่ายขึ้นอีก";
$('#ta_text').val(text);

// render default result
let s = `
{"classes":{"/Computers & Electronics/Consumer Electronics":0.9800000190734863,"/Internet & Telecom/Mobile & Wireless/Mobile Phones":0.9700000286102295},"entities":[{"_name":"OnePlus 7 Pro","name":"OnePlus 7 Pro","type":"CONSUMER_GOOD"},{"_name":"country","name":"ประเทศ","type":"LOCATION"},{"_name":"specification","name":"สเปค","type":"OTHER"},{"_name":"fans","name":"แฟน ๆ","type":"PERSON"},{"_name":"memory","name":"หน่วยความจำ","type":"OTHER"},{"_name":"screen","name":"จอภาพ","type":"OTHER"},{"_name":"OnePlus","name":"OnePlus","type":"ORGANIZATION"},{"_name":"price","name":"ราคา","type":"OTHER"},{"_name":"version","name":"รุ่น","type":"OTHER"},{"_name":"UFS 3.0","name":"UFS 3.0","type":"ORGANIZATION"},{"_name":"owner","name":"เจ้าของ","type":"PERSON"},{"_name":"people","name":"คน","type":"PERSON"},{"_name":"camera","name":"กล้อง","type":"CONSUMER_GOOD"},{"_name":"2,000 baht","name":"2,000 บาท","type":"PRICE"},{"_name":"90","name":"90","type":"NUMBER"},{"_name":"7","name":"7","type":"NUMBER"},{"_name":"3.0","name":"3.0","type":"NUMBER"},{"_name":"2,000","name":"2,000","type":"NUMBER"},{"_name":"7","name":"7","type":"NUMBER"}]}
`;
let resp = JSON.parse(s);
on_success(text, resp);
