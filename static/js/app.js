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
        <td>${en.magnitude.toFixed(2)}</td>
        <td>${en.score.toFixed(2)}</td>
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
{"classes":{"/Computers & Electronics/Consumer Electronics":0.9800000190734863,"/Internet & Telecom/Mobile & Wireless/Mobile Phones":0.9700000286102295},"entities":[{"_name":"OnePlus 7 Pro","magnitude":1,"mention_type":"COMMON","name":"OnePlus 7 Pro","salience":0.3591538965702057,"score":0.10000000149011612,"type":"CONSUMER_GOOD"},{"_name":"country","magnitude":0.20000000298023224,"mention_type":"COMMON","name":"ประเทศ","salience":0.3175514042377472,"score":0.10000000149011612,"type":"LOCATION"},{"_name":"specification","magnitude":1.7999999523162842,"mention_type":"COMMON","name":"สเปค","salience":0.17525853216648102,"score":0.5,"type":"OTHER"},{"_name":"fans","magnitude":0.10000000149011612,"mention_type":"COMMON","name":"แฟน ๆ","salience":0.021666713058948517,"score":0.10000000149011612,"type":"PERSON"},{"_name":"memory","magnitude":0.10000000149011612,"mention_type":"COMMON","name":"หน่วยความจำ","salience":0.020038751885294914,"score":0.10000000149011612,"type":"OTHER"},{"_name":"screen","magnitude":0.8999999761581421,"mention_type":"COMMON","name":"จอภาพ","salience":0.020038751885294914,"score":0.8999999761581421,"type":"OTHER"},{"_name":"OnePlus","magnitude":0.10000000149011612,"mention_type":"PROPER","name":"OnePlus","salience":0.016023961827158928,"score":0.10000000149011612,"type":"ORGANIZATION"},{"_name":"price","magnitude":0,"mention_type":"COMMON","name":"ราคา","salience":0.015130940824747086,"score":0,"type":"OTHER"},{"_name":"version","magnitude":0.10000000149011612,"mention_type":"COMMON","name":"รุ่น","salience":0.015130940824747086,"score":0.10000000149011612,"type":"OTHER"},{"_name":"UFS 3.0","magnitude":0.20000000298023224,"mention_type":"PROPER","name":"UFS 3.0","salience":0.011884082108736038,"score":0.20000000298023224,"type":"ORGANIZATION"},{"_name":"owner","magnitude":0.10000000149011612,"mention_type":"COMMON","name":"เจ้าของ","salience":0.011239727027714252,"score":0.10000000149011612,"type":"PERSON"},{"_name":"people","magnitude":0,"mention_type":"COMMON","name":"คน","salience":0.010226122103631496,"score":0,"type":"PERSON"},{"_name":"camera","magnitude":0.30000001192092896,"mention_type":"COMMON","name":"กล้อง","salience":0.006656161043792963,"score":0.30000001192092896,"type":"CONSUMER_GOOD"}],"translate":"The ultimate flagship mobile phone, the OnePlus 7 Pro, which came to be sold in our country at the end of May. Considered popular with the OnePlus fans in our country, not less. Whether it is a powerful specification, a beautiful 90Hz screen, UFS 3.0 memory, a top-class camera, etc., which has recently changed the price of OnePlus 7 Pro to another version of 2,000 baht for many people to decide. Easier to become the owner"}
`;
let resp = JSON.parse(s);
on_success(text, resp);
