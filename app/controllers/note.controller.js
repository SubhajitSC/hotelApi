const rp = require('request-promise');
const chr = require('cheerio');
const querystring = require('querystring');

exports.create = (req, res) => {
    // Validate request
    if(!req.body.hotelName || !req.body.checkInDate || !req.body.duration) {
        return res.status(400).send({
            message: "Hotel Name, Check In Date, Duration can not be empty"
        });
    }

    // Convert Dates
        var convertedDate = new Date(req.body.checkInDate);
        var day = ("0" + convertedDate.getDate()).slice(-2);
        var month = ("0" + (convertedDate.getMonth() + 1)).slice(-2);
        var year = convertedDate.getFullYear();
        req.body.checkInDate = year + '-' + month + '-' + day;
        
    const options = {
        url: "https://www.google.com/search?q=" + encodeURIComponent(req.body.hotelName) + "&amp;ahotel_dates=" + req.body.checkInDate +"," + req.body.duration,
        json: true
    }

    rp(options)
    .then((data) => {
        var $ = chr.load(data)
        var results = {
          links: []
        }
        var linkSel = 'h3.r a';
        var descSel = 'div.s';
        var itemSel = 'div.g';
        $(itemSel).each(function (i, elem) {
            var linkElem = $(elem).find(linkSel)
            var descElem = $(elem).find(descSel)
            var item = {
              title: $(linkElem).first().text(),
              siteName: null,
              siteUrl: null,
              description: null
            }
            var qsObj = querystring.parse($(linkElem).attr('href'))
    
            if (qsObj['/url?q']) {
                var test_str = qsObj['/url?q'];
                var start_pos = test_str.indexOf('.') + 1;
                var end_pos = test_str.indexOf('.',start_pos);
                var text_to_get = test_str.substring(start_pos,end_pos);
                item.siteName = text_to_get;
                item.siteUrl = qsObj['/url?q'];
            }
    
            $(descElem).find('div').remove()
            item.description = $(descElem).text()
            if(item.title != "" || item.siteName != null || item.siteUrl != null)
                results.links.push(item)
          })
        //   console.log(res);
        return res.status(200).send(results.links);
    })
    .catch((err) => {
        console.log(err);
    }); 

};