
class NoteSchema {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }

    getHotelDetails() {
        return new Promise(function(resolve, reject) {  
            if (this.title != '') {
               resolve(this.title);  // fulfilled successfully
            }
            else {
               reject(this.content);  // error, rejected
            }
        });
    }
}

module.exports =  NoteSchema;