const exportfile = require('./index');

const options = {
    title: "นครินทร์ วีระศักดิ์"
};

exportfile.createFileImage(options).then((res) => {
    console.log('Export => ', res);
}).catch((err) => {
    console.log('Export => ', err);
});