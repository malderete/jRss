/* A jQuery plugin to parse RSS feeds based on RSS specification 2.0
 * and inspirated by jFedd by Jean-François Hovinne
 * jquery.jRss.js plug-in 0.1
 *
 * Copyright (c) 2010  Martin Alderete ( malderete<at>gmail<dot>com )
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

$.extend(JFeed, {
    
    prototype: {
        
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
    }

}); // END Feed class



// Rss class
/*This is the MAIN class because jRss
 *is focused on RSS feeds (at the moment)
 */
JRss = function(xml) {
    this.init(xml);
};

$.extend(JRss, {
    
    prototype: {
        
        channel: null,
         
        items: null,
         
        init: function(xml) {
            
            var xml_channel = $('channel', xml).eq(0);
            //Initialize the attributes
            this.channel = new JChannel(xml_channel);
            this.items = new Array();
            
            var jrss = this;
            
            //Create the items
            jQuery('item', xml).each( function(index, value) {
                var rss_item = new JRSSItem(value);
                jrss.items.push(rss_item);
            });
        },
         
        render_as_table: function(options) {
            var settings = {
                id: "jRss",
                class: "jRss",
                class_header: "jRss_header",
                header: null,
                fields: null,
                debug: false
            };
            
            $.extend(settings, options||{});
            
//             if (!settings.header || !settings.fields) {
//                 options && options.debug && window.console && console.warn( "Need header and fields, returning nothing" );
//                 return;
//             }
            
            var table = $("<table></table>").addClass(settings.class).attr("id", settings.id);
            var tr_header = $("<tr></tr>").addClass(settings.class_header);
            table.append(tr_header);
            
            $.each(settings.header,function(index, value) {
                var td = $("<td></td>").text(value);
                tr_header.append(td);
            });
            
            var items = this.items;
            
            $.each(items, function(index, item) {
                var tr_item = $("<tr></tr>");
                $.each(settings.fields, function(index2, field) {
                    tr_item.append($("<td></td>").text(items[index][field]));
                });
                table.append(tr_item);
            });
            return table;
        },
    }

});
// END Rss class


//Channel class
/*This class hold the <channel> data
 *found in a RSS is like a header
 */
JChannel = function(xml_channel) {
    this.init(xml_channel);
};

$.extend(JChannel, {
    
    prototype: {
        
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
        
        //This array hold object's meta data
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
         
        //Class initialization
        init: function(xml_channel) {
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
        },
        
        debug: function() {
            //show all attrs on firebug console
            var self = this;
            $.each(this.optional_fields, function(index) {
                var attr = self.optional_fields[index];
                console.log(self.optional_fields[index]+ " : "+self[attr]);
            });
        }
        
    }
    
}); // END channel class



// RSS item class
/*This class represents one <item>
*/
JRSSItem = function(xml_item) {
    this.init(xml_item);
};

$.extend(JRSSItem, {
    
    prototype: {
        
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
        
         //Class initialization
        init: function(xml_item) {
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
        
    }

}); // END Feed item class


// Library startup!!!
(function($) {
    //$ is a reference to jQuery.
    $.jRss = function(options) {
        var settings = {
                        url: null,
                        data: null, 
                        success: null
        };
        
//         if (!this.length) {
//             options && options.debug && window.console && console.warn( "nothing selected, can't get something, returning nothing" );
//             return;
//         }
        
        $.extend(settings, options||{});

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
