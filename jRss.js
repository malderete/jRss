/* jQuery rss plugin based on RSS specification 2.0
 * jquery.jRss.js plug-in 0.1
 *
 * Copyright (c) 2010  Martin Alderete
 *
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */




// Feed class
/*
 *This class works like a 'factory' to create
 *the differents types of Feeds
*/
JFeed = function(xml) {
    this.parse(xml);
};

JFeed.prototype = {
    
    version: '2.0',
    type: 'rss',
    
    parse: function(xml) {
        
        if(jQuery('channel', xml).length == 1) {
            var feedClass = new JRss(xml);
        }
        
        if(feedClass) {
            jQuery.extend(this, feedClass);
        }
    }

}; // END Feed class



// Rss class
JRss = function(xml) {
    this._init(xml);
};

JRss.prototype = {
    
    channel: null,
    items: null,
    
    _init: function(xml) {
        
        //Initialize the attributes
        var xml_channel = $('channel', xml).eq(0);
        this.channel = new JChannel(xml_channel);
        this.items = new Array();
        
        var feed = this;
        
        jQuery('item', xml).each( function(index, value) {
            var item = new JFeedItem(value);
            feed.items.push(item);
        });
    }

};
// END Rss class


 //Channel class
JChannel = function(xml_channel) {
    this._init(xml_channel);
};

JChannel.prototype = {
    
    //mandatory
    title: "",
    link: "",
    description: "",
    //optional
    language: "",
    copyright: "",
    managingEditor: "",
    webMaster: "",
    pubDate: "",
    lastBuildDate: "",
    category: "",
    generator: "",
    docs: "",
    rating: "",
    ttl: "",
    skipHours: "",
    skipDays: "" ,
    cloud: {},
    image: { 
        url: "",
        title: "",
        link: "",
    },
    textInput: { 
        title: "",
        description: "",
        name: "",
        link: "",
    },
    
    optional_fields: [
        "language",
        "copyright",
        "managingEditor",
        "webMaster",
        "pubDate",
        "lastBuildDate",
        "category",
        "generator",
        "docs",
        "rating",
        "ttl",
        "cloud",
        "image",
        "textInput",
        "skipHours",
        "skipDays" 
    ],
    
    
    _init: function(xml_channel) {
        /*
         * Initialize the channel section
         */

        //Set the mandatories fields
        this.title = $(xml_channel).find('title:first').text();
        this.link = $(xml_channel).find('link:first').text();
        this.description = $(xml_channel).find('description:first').text();
        
        var self = this;
        
        //Set optional fields
        $.each(this.optional_fields , function(index) {
            var attr = self.optional_fields[index];
            var element = $(xml_channel).find(attr + ':first');
            
            if (typeof self[attr] == 'object') {
                $.each(self[attr], function(key) {
                    var attr_value = $(element).find(key + ':first').text();
                    self[self.optional_fields[index]][key] = attr_value;
                });
            } else {
                self[self.optional_fields[index]] = element.text();
            }
        });

        //Debug: show all attrs.
//         $.each(this.optional_fields, function(index) {
//             var attr = self.optional_fields[index];
//             console.log(self.optional_fields[index]+ " : "+self[attr]);
//         });
    }
    
}; // END channel class



// Feed item class
JFeedItem = function(xml_item) {
    this._init(xml_item);
};

JFeedItem.prototype = {
    
    title: "",
    description: "",
    link: "",
    author: "",
    category: "",
    comments: "",
    enclosure: "",
    guid: "",
    pubDate: "",
    source: "",
    
    //This array hold object's meta data
    optional_fields: [
                    "title",
                    "description",
                    "link",
                    "author",
                    "category",
                    "comments",
                    "enclosure",
                    "guid",
                    "pubDate",
                    "source"
    ],
    
    _init: function(xml_item) {
        var self = this;
        
        //Set optional fields
        $.each(this.optional_fields , function(index) {
            var attr = self.optional_fields[index];
            var element = $(xml_item).find(attr + ':first');
            
            if (typeof self[attr] == 'object') {
                $.each(self[attr], function(key) {
                    var attr_value = $(element).find(key + ':first').text();
                    self[self.optional_fields[index]][key] = attr_value;
                });
            } else {
                self[self.optional_fields[index]] = element.text();
            }
        });
    }

}; // END Feed item class



// Library startup!!!

(function($) {
    //$ is a reference name to jQuery ($.fn = JQuery.fn)
    $.jRss = function(settings) {
        var defaults = {
                        url: null,
                        data: null, 
                        success: null
        };
        
        if (!this.length) {
            options && options.debug && window.console && console.warn( "nothing selected, can't get something, returning nothing" );
            return;
        }
        
        $.extend(defaults, settings);

        if (settings.url) {
            //Let's get the data
            $.ajax({
                   type: 'GET',
                   url: settings.url,
                   data: settings.data,
                   dataType: 'xml',
                   success: function(xml) {
                       var feed = new JFeed(xml);
                       if ($.isFunction(settings.success)){
                           settings.success(feed);
                       }
                   }
            });
        }
        
        //return this
        return this;
        
};
})(jQuery);//Execute the anonymous function with the reference to jQuery ;)
