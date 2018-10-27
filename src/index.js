const fs = require('fs');
const path = require('path');
const Exportjs = require('./exportjs');

function defaultIfEmpty(message, messageDefault) {
  if (typeof message == 'undefined' && message == '') {
    return messageDefault;
  }
  return message;
}

module.exports = {
    
  createFileImage: function (options) {
      
    const entity = {
      title: defaultIfEmpty(options.title, '-')
    };

    const basePath = path.join(__dirname, 'templates');
    const eAppOptions = {
      templatePath: path.join(basePath, 'template.html'),
      filePath: path.join(
        options.imgDir || './out',
        options.imgName || 'filePort.jpg'
      )
    };
    
    console.log(entity);  
      
    return Exportjs(eAppOptions).create(entity);
  }
};


function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
