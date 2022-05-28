var express = require('express');
var router = express.Router();

const PDFDocument = require('pdfkit');
const fs = require('fs');
const { defaultConfiguration } = require('express/lib/application');
const { ClientRequest } = require('http');
const { contentDisposition } = require('express/lib/utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/form', function(req, res, next) {
  let name = req.body.name;
  let recordNum = req.body.record;
  let age = req.body.age;
  let date = req.body.date;
  let date_time = req.body.date_time;
  let fever = req.body.fever;
  let fever2 = req.body.fever2;
  let cough = req.body.cough;
  let cough2 = req.body.cough2;
  let breathing = req.body.breathing;
  let breathing2 = req.body.breathing2;
  let flu = req.body.flu;
  let flu2 = req.body.flu2;
  let covid1 = req.body.covid1;
  let covid2 = req.body.covid2;
  let client_age = req.body.client_age;
  let brand2 = req.body.brand2;
  let vaccine = req.body.vaccine;
  let brand = req.body.brand;
  let your_vaccine = req.body.your_vaccine;

  let date_pdf = date.split('-');
  let time_pdf = date_time.split(':');
  let m = "AM";

  if(time_pdf[0][0] == '1') {
    let int = parseInt(time_pdf[0]);
    if(int >= 12) {
      m = "PM";
    }
    if(int > 12) {
      int -= 12;
      time_pdf[0] = toString(int);
    }
  } 
  console.log(time_pdf[0][0]);

  let title = 14;
  let text = 12;
  let gapSize = 5;

  const doc = new PDFDocument({font: 'Times-Roman', autoFirstPage: false });

  // doc.pipe(fs.createWriteStream('progress_note.pdf'));
  doc.pipe(res);

  doc.addPage({
    margins: {top: 30, left: 30, right: 30, bottom: 30 },
  })

  doc.fontSize(title).font('Times-Bold').text('CLÍNICA DE LA ALBIZU', {
    align: 'center'
  });

  doc.moveDown();

  doc.fontSize(text).font('Times-Roman').text(`NOMBRE DEL PACIENTE: ${name}                 # RECORD: ${recordNum}                  EDAD: ${age}`);

  doc.moveDown();

  doc.fontSize(text).font('Times-Bold').text(`Nota de Progreso y Cernimiento Condición de Salud (Servicio Presencial)`, {
    align: 'center'
  });
  
  doc.moveDown();

  doc.fontSize(text).font('Times-Bold').text(`Fecha/Hora: `, {
    continued: true
  }).font('Times-Roman').text(`${date_pdf[1]}/${date_pdf[2]}/${date_pdf[0]} at ${time_pdf[0]}:${time_pdf[1]} ${m}`);

  doc.moveDown();

  doc.fontSize(text).lineGap(gapSize).text(`     1. Tiene usted y/o cliente menor de edad:`);
  doc.fontSize(text).lineGap(gapSize).text(`             a. fiebre: ${fever}`);
  doc.fontSize(text).lineGap(gapSize).text(`                   i. cliente (niño/a o adolescente): ${fever2}`);
  doc.fontSize(text).lineGap(gapSize).text(`             b. tos que empeora: ${cough}`);
  doc.fontSize(text).lineGap(gapSize).text(`                   i. cliente (niño/a o adolescente): ${cough2}`);
  doc.fontSize(text).lineGap(gapSize).text(`             c. dificultad respiratoria: ${breathing}`);
  doc.fontSize(text).lineGap(gapSize).text(`                   i. cliente (niño/a o adolescente): ${breathing2}`);
  doc.fontSize(text).lineGap(gapSize).text(`             d. síntomas similares a los de la influenza: ${flu}`);
  doc.fontSize(text).lineGap(gapSize).text(`                   i. cliente (niño/a o adolescente): ${flu2}`);
  
  doc.moveDown();
  
  doc.fontSize(text).text(`           (en caso de que el cliente sea un menor de edad explorar sobre ambos)`);

  doc.moveDown();

  doc.fontSize(text).lineGap(gapSize).text(`     2. ¿Usted o una persona cercana (por ejemplo: familiar, vecino o compañeros de trabajo) ha viajado a `);
  doc.fontSize(text).lineGap(gapSize).text(`        un área contagiada o con transmisión comunitaria del COVID-19 en los pasados 14 días?`);
  doc.fontSize(text).lineGap(gapSize).text(`          ${covid1}`);

  doc.moveDown();

  doc.fontSize(text).lineGap(gapSize).text(`     3. ¿Usted ha estado en contacto cercano con alguien que se ha confirmado tiene COVID-19?`)
  doc.fontSize(text).lineGap(gapSize).text(`          ${covid2}`);

  doc.moveDown();

  doc.fontSize(text).lineGap(gapSize).text(`     Si alguna de estas preguntas se contesta en afirmativo proceder a indicarle que la sesión se cancela y se`);

  doc.fontSize(text).lineGap(gapSize).text(`     establecerá nuevo contacto telefónico en 14 días. (Documentar la cancelación de sesión y el acuerdo de`);

  doc.fontSize(text).lineGap(gapSize).text(`     llamar en 14 días).  Orientar al cliente establecer contacto telefónico con su médico de cabecera y de no`);

  doc.fontSize(text).lineGap(gapSize).text(`     lograr contacto llamar a sala de emergencia.`)

  doc.moveDown();

  doc.fontSize(text).lineGap(gapSize).text(`     4. Si el cliente es menor de 12 años.  ¿La persona encargada del menor presentó evidencia de la vacunación`);
  doc.fontSize(text).lineGap(gapSize).text(`        COVID-19 completa? `);

  if(client_age == 'under') {
    doc.fontSize(text).lineGap(gapSize).text(`            a. ${vaccine}`);
    if(vaccine != "No") {
      doc.fontSize(text).lineGap(gapSize).text(`            b. Marca de la vacuna: ${brand}`);
    }
  } else {
    doc.fontSize(text).lineGap(gapSize).text(`        El cliente/la clienta no es menor de 12 años.`);
  }

  doc.moveDown();

  doc.fontSize(text).lineGap(gapSize).text(`      6. Si el cliente es mayor de 12 años, ¿presentó evidencia de vacunación?`);
  
  if(client_age == 'above') {
    doc.fontSize(text).lineGap(gapSize).text(`            a. ${vaccine}`);
    if(your_vaccine != "No") {
      doc.fontSize(text).lineGap(gapSize).text(`            b. Marca de la vacuna: ${brand}`);
    }
  } else {
    doc.fontSize(text).lineGap(gapSize).text(`       El cliente/la clienta no tiene más de 12 años.`);
  }

  doc.font('Times-Bold').fillColor('gray').text('                                                                          NOTAS DE PROGRESO', 20, doc.page.height - 50, {
    align: 'center',
    lineBreak: false
  });

  doc.addPage({
    margins: {top: 30, left: 30, right: 30, bottom: 30 },
  })

  doc.fontSize(text).font('Times-Roman').lineGap(gapSize).text(`      7. Encargado de menores de edad, ¿presentó evidencia de vacunación?`);

  doc.fontSize(text).lineGap(gapSize).text(`              a. ${your_vaccine}`);
  if(your_vaccine != "No") {
    doc.fontSize(text).lineGap(gapSize).text(`              b. Marca de la vacuna: ${brand2}`);
  }

  doc.font('Times-Bold').fillColor('gray').text('                                                                           NOTAS DE PROGRESO', 20, doc.page.height - 50, {
    align: 'center',
    lineBreak: false
  });

  doc.end();
});

module.exports = router;
