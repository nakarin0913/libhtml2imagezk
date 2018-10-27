const ejs = require('ejs');
const html2pdf = require('html-pdf');
const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

function render(templatePath, entity) {
    const basePath = path.dirname(templatePath);
    
    const html = ejs.render(
        fs.readFileSync(templatePath, 'utf8'),
        entity
    );
    const $ = cheerio.load(html);
    createTagBase($, basePath);
    
    return $.html();
}

function createTagBase($, basePath) {
    $('head').prepend(
        $('<base/>').attr('href', 'file:///' + rewriteBaseUrl(basePath)).attr("target", "_blank")
    );
}

function rewriteBaseUrl(baseUrl) {
    return path.join(baseUrl, '/').replace(new RegExp(/\\/g),'/');
}


function create(html, htmlOptions, filePath) {
    return new Promise((resovle, reject) => {
        try {
            html2pdf
                .create(html, htmlOptions)
                .toFile(filePath, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resovle(res);
                    }
                });
        } catch (err) {
            reject(err);
        }
    });
}


function createBase64(html, htmlOptions) {
    return new Promise((resovle, reject) => {
        try {
            html2pdf
                .create(html, htmlOptions)
                .toBuffer(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        var base64 = new Buffer(res).toString('base64');
                        resovle(base64);
                    }
                });
        } catch (err) {
            reject(err);
        }
    });
}


module.exports = function (options) {
    
    let htmlOptions = {
        type: "jpeg", // allowed file types: png, jpeg, pdf
        quality: "100", // images
        format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
        orientation: "portrait", // portrait or landscape
        //zoomFactor: 1, //default
        viewportSize: {
            //width: 874, height: 1240
            width:794, height: 1123
        }
    };
    
    return {
        create: function (entity) {
            return create(
                render(options.templatePath, entity),
                htmlOptions, 
                options.filePath
            );
        },
        createBase64: function (entity) {
            return createBase64(
                render(options.templatePath, entity),
                htmlOptions
            );
        }
    };
};