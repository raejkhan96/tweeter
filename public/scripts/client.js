/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  const renderTweets = function(tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    console.log('TWEETS: ', tweets);
    for (let tweet of tweets) {
      $('.show-tweet').prepend(createTweetElement(tweet));
    }
  };

  // Escape functions to avoid XSS attacks
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
  
  const createTweetElement = function(tweet) { 
    const $tweet = $(` <section class="previous-tweet">
      <header class="tweet-header">
        <div class="name-img"> 
          <div class="previous-tweet-img">
            <img src=${tweet.user.avatars}> 
          </div>
          <div class="name"> ${tweet.user.name} </div>
        </div>
        <div class="nameTag"> ${tweet.user.handle}</div>
      </header>
      <article class="tweet-text">${escape(tweet.content.text)}</article>
      <footer class="tweet-footer">
        <div section="tweet-footer-icons">
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
        ${timeago.format(tweet.created_at)}
      </footer>
    </section>`);
    return $tweet;
  };
  

  $('#submitTweet').on('submit', function(event) {
    // stops refreshing not redirection
    event.preventDefault();
    let form = $(this)

    // 1st argument is selector, 2nd argument inside this
    const input = $('#tweet-text', form)
    let length = input.val().length;

    if (length === 0 || typeof length === null) {
      console.log('ALERT')
      $('.alertEmptyTweet').slideDown('slow');
      // alert('Empty Tweet! Please type out a tweet! ');
    } else if (length > 140) {
      $('.alertTooMany').slideDown('slow');
    } else {
      const tweetData = ($(this).serialize());
      $.post('/tweets', tweetData);
      $('.counter').val(140);
      // Code is slow to update, but does update
      loadTweets();
      // clears tweet
      input.val('');
    }
  
  });

  const loadTweets = function() {
    $('.alertEmptyTweet').slideUp('slow');
    $('.alertTooMany').slideUp('slow');
    $.ajax('/tweets', { method: 'GET'})
    .then(function (result){
      renderTweets(result);
    });

  }

  $('.alertEmptyTweet').hide();
  $('.alertTooMany').hide();
  loadTweets();

});
