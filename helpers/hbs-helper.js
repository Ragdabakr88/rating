const moment = require('moment');

module.exports = {

    GenerateTime:function(date, format){
        return moment(date).format(format);
    }
 
};