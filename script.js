$(document).ready(function() {
  var requestCount = 0;

  var $searchButton = $(".search-button");
  var $searchInput = $(".search-input");

  var $mainContent = $("main");

  //Selecting tags
  var $videoContainer = $(".video-container");
  var $videoName = $(".video-name");
  var $channelName = $(".video-info .channel-name");
  var $publishedDate = $(".video-info .published-date");
  var $subscribers = $(".subscribers strong");
  var $views = $(".views strong");
  var $likes = $(".thumbs-up .likes");
  var $dislikes = $(".thumbs-down .dislikes");
  var $comments = $(".comments .commentCount");

  function getVideoStats(videoId) {
    var apikey = "API_KEY";
    var apiUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=" + videoId + "&key="+apikey;

    //handing json data
    $.getJSON(apiUrl, function(videoData) {
      var stats = videoData.items[0].statistics;
      var snippet = videoData.items[0].snippet;

      var videoTitle = snippet.title;
      var channelTitle = snippet.channelTitle;

      var publishedDate = new Date(snippet.publishedAt).toLocaleDateString();

      var viewCount = formatNumbers(stats.viewCount);
      var likeCount = formatNumbers(stats.likeCount);
      var commentCount = formatNumbers(stats.commentCount);

      var videoEmbedUrl = "https://www.youtube.com/embed/" + videoId;
      var video = "<iframe src='" + videoEmbedUrl + "'></iframe>";

      //OUTPUT
      $videoContainer.html(video);

      $videoName.text(videoTitle);
      $channelName.text(channelTitle);
      $publishedDate.text("Published on " + publishedDate);
      $views.text(viewCount); 

      getDislikes(videoId).then(function(dislikes) {
        $likes.text(likeCount);
        $dislikes.text(formatNumbers(dislikes, "d"));
        $comments.text(commentCount);
        $mainContent.removeClass("hidden");
        $mainContent.find(".yt-stats").removeClass("hidden");
        $('footer').show();
      });
    });
  }

  function getDislikes(videoId) {
    var dislikesUrl = "https://returnyoutubedislikeapi.com/votes?videoId=" + videoId;

    return $.getJSON(dislikesUrl).then(function(disData) {
      return disData.dislikes;
    });
  }

  function formatNumbers(number) {
    var formattedNumber = parseInt(number);

    if (formattedNumber >= 1000000000) {
      formattedNumber = (formattedNumber / 1000000000).toFixed(1) + "B";
    } else if (formattedNumber >= 1000000) {
      formattedNumber = (formattedNumber / 1000000).toFixed(1) + "M";
    } else if (formattedNumber >= 1000) {
      formattedNumber = (formattedNumber / 1000).toFixed(1) + "K";
    }

    return formattedNumber;
  }

  //Rickroll
  var defaultVideoId = "dQw4w9WgXcQ";
  getVideoStats(defaultVideoId);

  $searchButton.click(function() {
    if (requestCount >= 15) {
      alert("Sorry, you have exceeded the maximum number of requests. Please try again later.");
      return;
    }

    if ($searchInput.val() === "") {
      alert("Please enter a YouTube video URL or video ID.");
      return;
    }

    requestCount++;

    var videoUrl = $searchInput.val();
    var videoId = null;
    var matches = videoUrl.match(/^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)((?:&(\S*))?)?(?:\?(t=\d+))?/);

    if (matches) {
      videoId = matches[1];
    }

    if (videoId) {
      getVideoStats(videoId);
    } else {
      alert("Please enter a valid YouTube video URL!");
    }
  });

  $(".clear-button").click(function() {
    $('footer').hide();
    $mainContent.addClass("hidden");
    $searchInput.val("");
    $videoContainer.html("");
    $channelName.text("");
    $publishedDate.text("");
    $subscribers.text("");
    $views.text("");
    $likes.text("");
    $dislikes.text("");
    $comments.text("");
  });
});