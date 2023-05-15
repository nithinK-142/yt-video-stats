$(document).ready(function() {
  var requestCount = 0;
  
  $(".fa-search").click(function() {
    if (requestCount >= 15) {
      alert("Sorry, you have exceeded the maximum number of requests allowed per IP address.");
      return;
    }
    
    requestCount++;
    
    var videoUrl = $("#video-url").val();
    var videoId = null;
    var matches = videoUrl.match(/^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)((?:&(\S*))?)?(?:\?(t=\d+))?$/);

    if(matches){
      // console.log("URL : " +matches[0]);
      // console.log("Optional : " +matches[2]);
      videoId = matches[1];
    }

    var apiKey = "";
    var apiUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=" + videoId + "&key=" + apiKey;
    var dislikesUrl = "https://returnyoutubedislikeapi.com/votes?videoId=" + videoId;

    function getDislikes() {
      return $.getJSON(dislikesUrl).then(function(disData) {
        return disData.dislikes;
      });
    }

    if (videoId) {
      $.getJSON(apiUrl, function(ytData) {
        var stats = ytData.items[0].statistics;
        var snippet = ytData.items[0].snippet;
        
        var channelTitle = snippet.channelTitle;
        var videoTitle = snippet.title;
        var thumbnailUrl = snippet.thumbnails.medium.url;
        var thumbnailWidth = snippet.thumbnails.medium.width*1.5; 
        var thumbnailHeight = snippet.thumbnails.medium.height*1.5;
       
        var publishedDate = new Date(snippet.publishedAt).toLocaleDateString();

        var viewCount = parseInt(stats.viewCount).toLocaleString("en-IN");
        var likeCount = parseInt(stats.likeCount).toLocaleString("en-IN");
        var commentCount = parseInt(stats.commentCount).toLocaleString("en-IN");
        
        var image = "<img src='" + thumbnailUrl + "' width='" + thumbnailWidth + "' height='" + thumbnailHeight + "'/>"; // modified code
        $(".image-container").html(image);

        output = "<div><b>Title: </b><h3>" + videoTitle +"</h3></div>";
        output += "<div><b>Channel: </b><h3>" + channelTitle +"</h3></div>";
        output += "<div><b>Published Date: </b><h3>" + publishedDate +"</h3></div>";
        output += "<div><b>Views: </b><h3>" + viewCount +"</h3></div>";
        output += "<div><b>Comments: </b><h3>" + commentCount +"</h3></div>";
        output += "<div><b>Likes: </b><h3>" + likeCount +"</h3></div>";
        
        getDislikes(videoId).then(function(dislikes) {
          output += "<div><b>Dislikes </b><h3>" + dislikes.toLocaleString("en-IN") +"</h3><div>";
          $(".stats-container").html(output);
        })
      });
    } else
      alert("Please enter a valid YouTube video URL!!!");
  });
  
  $(".fa-times").click(function() {
    $("#video-url").val("");
    $(".image-container").html("");
    $(".stats-container").html("");
  });
  
});
