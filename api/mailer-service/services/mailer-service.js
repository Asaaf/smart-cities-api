'use strict';

const nodemailer = require('nodemailer');

async function send(receiverEmail, imageUrl) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "smartcitiesteam4@gmail.com", // generated ethereal user
        pass: "hitvmarptvwlarei", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smartcities" <smartcitiesteam4@gmail.com>', // sender address
      to: receiverEmail, // list of receivers
      subject: "Gracias por visitar Victoria ✔", // Subject line
      text: `Hola, ¿cómo estás?
      
      Es un gusto para nosotros que hayas visitado Victoria, conociendo de esta forma nuestra cultura y región.
      
      En agradecimiento, te obsequiamos esta foto como recuerdo de tu visita: ${imageUrl} 
      
      Adicionalmente te animamos a que visites nuestro brochure, allí conocerás más de nosotros: https://online.pubhtml5.com/qqho/pfbe/#p=1
      
      Hasta pronto.`, // plain text body
      html: `<p>Hola, ¿cómo estás?</p>
      
      <p>Es un gusto para nosotros que hayas visitado Victoria, conociendo de esta forma nuestra cultura y región.</p>
      
      <p>En agradecimiento, te obsequiamos esta foto como recuerdo de tu visita: <a href="${imageUrl}">${imageUrl}</a></p>
      
      <p>Adicionalmente te animamos a que visites nuestro brochure, allí conocerás más de nosotros: <a href="https://online.pubhtml5.com/qqho/pfbe/#p=1">https://online.pubhtml5.com/qqho/pfbe/#p=1</a></p>
      
      <p>Hasta pronto.</p>`, // html body
    });

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  send
};
